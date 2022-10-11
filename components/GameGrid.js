import { useEffect, useState } from 'react';
import styles from './GameGrid.module.css';
import engine from 'chess-sjppd/engine';
import Chessboard from './Chessboard';
import ChessNav from './ChessNav';

const url = "http://www.w3.org/2000/svg";

const hamburger = (
  <svg id="burger-icon" height="5em" width="6em" xmlns={url}>
    <line x1="30" y1="30" x2="60" y2="30" stroke="black" strokeWidth="3" />
    <line x1="30" y1="40" x2="60" y2="40" stroke="black" strokeWidth="3" />
    <line x1="30" y1="50" x2="60" y2="50" stroke="black" strokeWidth="3" />
  </svg>
);

const closeButton = (
  <svg id="burger-icon" height="5em" width="6em" xmlns={url}>
    <line x1="30" y1="30" x2="60" y2="60" stroke="black" strokeWidth="3" />
    <line x1="60" y1="30" x2="30" y2="60" stroke="black" strokeWidth="3" />
  </svg>
);

const menu = JSON.stringify({
	"Board theme": {
    Woodgrain: "woodgrain",
    "Green-and-buff": "greenbuff"
  },
  "Pawn Promotion": {
    Queen: 'q',
    Rook: 'r',
    Bishop: 'b',
    Knight: 'n'
  },
  Opponent: {
    "Vs self": -1,
    "Vs CPU black": 1,
    "Vs CPU white": 0
  },
  "Time control": {
    untimed: "-",
    "30 min": "1800",
    "60 min": "3600",
    "90 min w/ 30-sec incr.": "5400+30",
    "90 min for 40 moves; 30 min w/ 30-sec incr.": "40/5400:1800+30",
    "100'40mv; 50'20mv; 15'+30\" incr.": "40/6000:20/3000:900+30",
    "2 hrs for 40 moves followed by": {
      "30 min": "40/7200:1800",
      "1 hr": "40/7200:3600",
      "1 hr for 20 moves then 30 min": "40/7200:20/3600:1800",
      "1 hr 20mv then 15 min w/ 30-sec incr.": "40/7200:20/3600:900+30"
    },
    Rapid: {
      "15 min w/ 10-sec incr.": "900+10",
      "15 min w/ 5-sec incr.": "900+5",
      "25 min w/ 10-sec incr.": "1500+10",
      "25 min": "1500"
    },
    Blitz: {
      "3 min w/ 2-sec incr.": "180+2",
      "5 min": "300",
      "5 min w/ 3-sec incr.": "300+3"
    }
  }
});

const mainMenuIdxOfSubWithSub = [ 3 ];

const idxOf1stItemWithSub = [ 6 ];

const indexOfPawnPromotion = (
  Object.keys( JSON.parse(menu) ).indexOf("Pawn Promotion")
);

const bgColor = JSON.stringify({
  "Has move": "onGreen",
  "check": "onYellow",
  "checkmate": "onRed",
  "Made move": "onRed"
});

const stylesForNav = JSON.stringify({
  bgBox: styles.bgBox,
  underBurger: styles.underBurger,
  button: styles.button,
  ghostedOut: styles.ghostedOut
});

const { PGNSevenTagRoster, getGameStatus, expand, cpuPlay } = engine.ui;

const pgnInit = new PGNSevenTagRoster;

export default function GameGrid() {
  const [ isCloseButton, setIsCloseButton ] = useState(false);
  const [ menuPathIdx, setMenuPathIdx ] = useState('');
  const [ navUnlock, setNavUnlock ] = useState('1111');
  const [ colorTheme, setColorTheme ] = useState("woodgrain");
  const [ promotionChoice, setPromotionChoice ] = useState('');
  const [ opponent, setOpponent ] = useState(-1);
  const [ timeControlTag, setTimeControlTag ] = useState("-");
  const [ whiteTimeIdx, setWhiteTimeIdx ] = useState(0);
  const [ blackTimeIdx, setBlackTimeIdx ] = useState(0);
  const [ whiteTime, setWhiteTime ] = useState(Infinity);
  const [ blackTime, setBlackTime ] = useState(Infinity);
  const [ runningTimerId, setRunningTimerId ] = useState(0);
  const [ startIsDisabled, setStartIsDisabled ] = useState(false);
  const [ resignIsDisabled, setResignIsDisabled ] = useState(true);
  const [ promoteIsDisabled, setPromoteIsDisabled ] = useState(true);
  const [ boardIsClickable, setBoardIsClickable ] = useState(false);
  const [ sequence, setSequence ] = useState('');
  const [ selectedOrigin, setSelectedOrigin ] = useState('');
  const [ selectedTarget, setSelectedTarget ] = useState('');

  /* Derivations from state */
  const tc = parseTC(timeControlTag);
  const initTime = tc[0].init;
  const plyCount = sequence ? sequence.split(',').length : 0;
  const bonus = tc[plyCount % 2 ? blackTimeIdx : whiteTimeIdx].bonus;
  const setTime = plyCount % 2 ? setBlackTime : setWhiteTime;
  const {
    position,
    legalMoves,
    white,
    black,
    openingName,
    movetext,
    capturedList,
    gameover,
    pgn
  } = JSON.parse( getGameStatus(sequence, pgnInit) );

  // Run the chess clocks if applicable
  useEffect( () => {
    if (initTime === Infinity || startIsDisabled === false) {
      setRunningTimerId(null);
      return;
    }
    setRunningTimerId(
      setInterval( () => setTime(t => t - 1), 1000 )
    );
    return;
  }, [ timeControlTag, startIsDisabled, sequence ] );

  // Play vs CPU with faux CPU thinking time effect
  useEffect( () => {
    if (
      startIsDisabled === false ||
      opponent === -1 ||
      plyCount % 2 !== opponent
    ) {
      return;
    }
    const move = cpuPlay(legalMoves);
    const piece = expand(position.split(' ')[0], true)[
      "abcdefgh".indexOf(move[0]) - 8 * move[1] + 64
    ];
    const isPromotion = (
      piece === 'P' && move.at(-1) == 8 ||
      piece === 'p' && move.at(-1) == 1
    );
    const pcn = move + (isPromotion ? 'q' : '');
    const id = setTimeout( () => {
      clearInterval(runningTimerId)
      setTime(t => t + bonus);
      setSequence( s => incr(s, pcn) );
      setWhiteButtonIsDown(v => !v);
      clearInterval(id);
      return;
    }, 5000 );
    return;
  });

  // Handle end of game
  useEffect( () =>  {
    if (gameover) {
      setResignIsDisabled(true);
      clearInterval(runningTimerId);
      setBoardIsClickable(false);
      console.log(pgn);
    }
    return;
  });

  // Menu should permanently display in desktop mode
  useEffect( () => {
    const menuToggle = () => {
      if (window.innerWidth < 1024) {
        setIsCloseButton(false);
      } else {
        setIsCloseButton(true);
      }
      return;
    };
    menuToggle();
    window.addEventListener("resize", menuToggle);
    return;
  }, [] );

  // Handle meeting move goal and flag fall
  if (startIsDisabled && whiteTime < Infinity && gameover.length === 0) {
    const whiteStuff = [
      whiteTime, whiteTimeIdx, setWhiteTimeIdx, tc[whiteTimeIdx].goal
    ];
    const blackStuff = [
      blackTime, blackTimeIdx, setBlackTimeIdx, tc[blackTimeIdx].goal
    ];
    const [ time, timeIdx, setTimeIdx, goal ] = (
      plyCount % 2 ? blackStuff : whiteStuff
    );
    const moves = (plyCount % 2 ? Math.floor : Math.ceil)(plyCount / 2);

    if (moves === goal && timeIdx < tc.length - 1) {
      setTime(t => t + tc[timeIdx + 1].init);
      setTimeIdx(i => i + 1);
    } else if (time <= 0) {
      clearInterval(runningTimerId);
      setTime(0);
      setSequence( s => incr(s, 'T') );
    }
  }

  return (
    <div className={styles.background}>
      <div className={styles.triColCenterWide}>
        <MenuIcon
          isX={isCloseButton}
          setIsX={setIsCloseButton}
        />
        <ChessNav
          sty={JSON.parse(stylesForNav)}
          tree={menu}
          isViz={isCloseButton}
          path={menuPathIdx}
          setPath={setMenuPathIdx}
          hasSub={mainMenuIdxOfSubWithSub}
          subLo={idxOf1stItemWithSub}
          setters={
            [ setColorTheme, setPromotionChoice,
            setOpponent, setTimeControlTag ]
          }
          unlock={navUnlock}
          setUnlock={setNavUnlock}
          disabled1={startIsDisabled}
          setDisab1={setStartIsDisabled}
          initTime={initTime}
          setWhite={setWhiteTime}
          setBlack={setBlackTime}
          disabled2={resignIsDisabled}
          setDisab2={setResignIsDisabled}
          disabled3={promoteIsDisabled}
          setDisab3={setPromoteIsDisabled}
          setBoard={setBoardIsClickable}
          org={selectedOrigin}
          setOrg={setSelectedOrigin}
          tgt={selectedTarget}
          pro={promotionChoice}
          seqIncr={incr}
          setMoveSeq={setSequence}
          timerId={runningTimerId}
          bonus={bonus}
          setTime={setTime}
        />
        <div className={styles.flexPanels}>
          <div className={styles.bgBox}>
            <Chessboard
              exp={expand}
              theme={colorTheme}
              isActive={boardIsClickable}
              setIsActive={setBoardIsClickable}
              pos={position}
              lm={legalMoves}
              org={selectedOrigin}
              setOrg={setSelectedOrigin}
              pro={indexOfPawnPromotion}
              setMenu={setMenuPathIdx}
              setProDisabled={setPromoteIsDisabled}
              setTgt={setSelectedTarget}
              seqIncr={incr}
              setSeq={setSequence}
              timerId={runningTimerId}
              bonus={bonus}
              setTime={setTime}
            />
          </div>
          <div className={styles.fourSquare}>
            <div className={[ styles.bgBox, styles.clock ].join(' ')}>
              <ChessText text={
                [ "W",
                  opponent > -1 ? (opponent ? "visitor" : "CPU") : "visitor",
                  whiteTime < 1 ? "0:00:00" : timeToString(whiteTime)
                ].join(' ')
              } />
              <ChessText text={white} bgColor={JSON.parse(bgColor)[white]} />
            </div>
            <div className={[ styles.bgBox, styles.clock ].join(' ')}>
              <ChessText text={
                [ "B",
                  opponent > -1 ? (opponent ? "CPU" : "visitor") : "visitor",
                  blackTime < 1 ? "0:00:00" : timeToString(blackTime)
                ].join(' ')
              } />
              <ChessText text={black} bgColor={JSON.parse(bgColor)[black]} />
            </div>
            <div className={[ styles.bgBox, styles.leftAndRight ].join(' ')}>
              <ChessText text={openingName} />
              <ChessText text={movetext} />
              <ChessText text={capturedList} />
              <ChessText text={gameover} bgColor={null} color="red" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuIcon({ isX, setIsX }) {
  return (
    <div className={styles.burgerBox} onClick={() => setIsX(!isX)}>
      {isX ? closeButton : hamburger}
    </div>
  );
}

function ChessText({ text, bgColor, color }) {
  return (
    <p className={[ styles.padded ].concat(
        bgColor ? [ styles[bgColor] ] : []
      ).concat(
        color ? [ styles[color] ] : []
      ).join(' ')
    }>{text}</p>
  );
}

const parseTC = tag => {
  return Object.freeze(tag.split(':').map(field => {
    if (field === "-") {
      return Object.freeze({ init: Infinity, bonus: 0, goal: 0 });
    }
    return Object.freeze({
      init: parseInt(field.split('/').at(-1).split('+')[0]),
      bonus: parseInt(field.split('+')[1]) || 0,
      goal: parseInt( field.split('/').at(-2) ) || 0
    });
  }));
};

function incr(csv, v) {
  return (csv.length ? csv.split(',') : []).concat([ v ]).join();
}

function hmmss(totalSeconds) {
  return [
    Math.floor(totalSeconds / 60 / 60),
    Math.floor(totalSeconds / 60) % 60,
    totalSeconds % 60
  ].map( (x, i) => `${x}`.padStart( (i ? 2 : 1), 0 ) ).join(':');
};

function timeToString(t) {
  return t === Infinity ? '\u221E' : hmmss(t);
}
