import { useEffect } from 'react';
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

const { PGNSevenTagRoster, getGameStatus, cpuPlay } = engine.ui;

const { expand } = engine.console;

const pgnInit = new PGNSevenTagRoster;

export default function GameGrid() {
  const isCloseButton = true;
  const setIsCloseButton = x => x;

  const menuPathIdx = '';
  const setMenuPathIdx = x => x;

  const navUnlock = '1111';
  const setNavUnlock = x => x;

  const colorTheme = "woodgrain";
  const setColorTheme = x => x;

  const promotionChoice = '';
  const setPromotionChoice = x => x;

  const opponent = -1;
  const setOpponent = x => x;

  const timeControlTag = "-";
  const setTimeControlTag = x => x;

  const whiteTimeIdx = 0;
  const setWhiteTimeIdx = x => x;

  const blackTimeIdx = 0;
  const setBlackTimeIdx = x => x;

  const whiteTime = Infinity;
  const setWhiteTime = x => x;

  const blackTime = Infinity;
  const setBlackTime = x => x;

  const whiteButtonIsDown = false;
  const setWhiteButtonIsDown = x => x;

  const runningTimerId = 0;
  const setRunningTimerId = x => x;

  const startIsDisabled = false;
  const setStartIsDisabled = x => x;

  const resignIsDisabled = true;
  const setResignIsDisabled = x => x;

  const promoteIsDisabled = true;
  const setPromoteIsDisabled = x => x;

  const boardIsClickable = false;
  const setBoardIsClickable = x => x;

  const sequence = '';
  const setSequence = x => x;

  const selectedOrigin = 'a2';
  const setSelectedOrigin = x => x;

  const selectedTarget = '';
  const setSelectedTarget = x => x;

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

  const incr = (csv, v) => {
    return (csv.length ? csv.split(',') : []).concat([ v ]).join();
  };

  const hmmss = totalSeconds => {
    return [
      Math.floor(totalSeconds / 60 / 60),
      Math.floor(totalSeconds / 60) % 60,
      totalSeconds % 60
    ].map( (x, i) => `${x}`.padStart( (i ? 2 : 1), 0 ) ).join(':');
  };

  const timeToString = t => t === Infinity ? '\u221E' : hmmss(t);

  const indexOfPawnPromotion = (
    Object.keys( JSON.parse(menu) ).indexOf("Pawn Promotion")
  );

  const { position, legalMoves, white, black,
    openingName, movetext, capturedList, gameover, pgn
  } = JSON.parse( getGameStatus(sequence, pgnInit) );

  const plyCount = sequence ? sequence.split(',').length : 0;

  if (startIsDisabled && whiteTime < Infinity) {
    const tc = parseTC(timeControlTag);
    const whiteGoal = tc[whiteTimeIdx].goal;
    const blackGoal = tc[blackTimeIdx].goal;
    const whiteMoves = Math.ceil(plyCount / 2);
    const blackMoves = Math.floor(plyCount / 2);

    if (whiteMoves === whiteGoal && whiteTimeIdx < tc.length - 1) {
      setWhiteTime(t => t + tc[whiteTimeIdx + 1].init);
      setWhiteTimeIdx(i => i + 1);
    } else if (whiteTime <= 0) {
      clearInterval(runningTimerId);
      setWhiteTime(0);
      setSequence( s => incr(s, 'T') );
    }

    if (blackMoves === blackGoal && blackTimeIdx < tc.length - 1) {
      setBlackTime(t => t + tc[blackTimeIdx + 1].init);
      setBlackTimeIdx(i => i + 1);
    } else if (blackTime <= 0) {
      clearInterval(runningTimerId);
      setBlackTime(0);
      setSequence( s => incr(s, 'T') );
    }

    useEffect( () => {
      const setTime = whiteButtonIsDown ? setBlackTime : setWhiteTime;
      setRunningTimerId(
        setInterval( () => setTime(t => t - 1), 1000 )
      );
      return;
    }, [ whiteButtonIsDown ] );
  }

  if (opponent > -1 && plyCount % 2 === opponent) {
    const bonus = parseTC(timeControlTag)[(
      whiteButtonIsDown ? blackTimeIdx : whiteTimeIdx
    )].bonus;
    const setTime = whiteButtonIsDown ? setBlackTime : setWhiteTime;
    const move = cpuPlay(legalMoves);
    const piece = expand(position.split(' ')[0], true)[
      "abcdefgh".indexOf(move[0]) - 8 * move[1] + 64
    ];
    const isPromotion = (
      piece === 'P' && move.at(-1) == 8 ||
      piece === 'p' && move.at(-1) == 1
    );
    const pcn = move + (isPromotion ? 'q' : '');

    useEffect( () => {
      const id = setTimeout( () => {
        clearInterval(timerId);
        setTime(t => t + bonus);
        setSequence( s => incr(s, pcn) );
        setWhiteButtonIsDown(v => !v);
        clearInterval(id);
        return;
      }, 5000 );
    } );
  }

  if (gameover) {
    setResignIsDisabled(true);
    clearInterval(runningTimerId);
    setBoardIsClickable(false);
    useEffect( () => console.log(pgn) );
  }

  useEffect( () => {
    window.addEventListener("resize", e => {
      if (window.innerWidth < 1024) {
        setIsCloseButton(false);
      } else {
        setIsCloseButton(true);
      }
    });
    return;
  }, [] );

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
          initTime={parseTC(timeControlTag)[0].init}
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
          bonus={parseTC(timeControlTag)[(
            position.split(' ')[1] === 'w' ?
            whiteTimeIdx : blackTimeIdx
          )].bonus}
          setTime={position.split(' ')[1] === 'w' ?
            setWhiteTime : setBlackTime
          }
          setIsDown={setWhiteButtonIsDown}
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
              bonus={parseTC(timeControlTag)[(
                position.split(' ')[1] === 'w' ?
                whiteTimeIdx : blackTimeIdx
              )].bonus}
              setTime={position.split(' ')[1] === 'w' ?
                setWhiteTime : setBlackTime
              }
              setIsDown={setWhiteButtonIsDown}
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
