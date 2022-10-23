import { useState, useEffect } from 'react';
import styles from './GameGrid.module.css';
import ListAsMenu from './ListAsMenu';
import Chessboard from './Chessboard';
import engine from 'chess-sjppd/engine';

const {
  PGNSevenTagRoster,
  getGameStatus,
  expand,
  getPieceOn,
  cpuPlay
} = engine.ui;

const pgnInit = new PGNSevenTagRoster;

const inits = JSON.parse( getGameStatus('') );

export default function ChessGame(props) {
  const [ isCloseButton, setIsCloseButton ] = useState(false);
  const [ menuPath, setMenuPath ] = useState('');
  const [ colorTheme, setColorTheme ] = useState("woodgrain");
  const [ promotionChoice, setPromotionChoice ] = useState('q');
  const [ opponent, setOpponent ] = useState(-1);
  const [ timeControlTag, setTimeControlTag ] = useState("-");
  const [ gameIsOver, setGameIsOver ] = useState(-1);
  const [ whiteTimeIdx, setWhiteTimeIdx ] = useState(0);
  const [ blackTimeIdx, setBlackTimeIdx ] = useState(0);
  const [ whiteTime, setWhiteTime ] = useState(Infinity);
  const [ blackTime, setBlackTime ] = useState(Infinity);
  const [ sequence, setSequence ] = useState('');
  const [ selectedOrigin, setSelectedOrigin ] = useState('');
  const [ selectedTarget, setSelectedTarget ] = useState('');
  const [ isMobile, setIsMobile ] = useState(null);

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

  const plyCount = sequence ? sequence.split(',').length : 0;

  // Handle transition to game over
  useEffect( () => {
    if (gameIsOver % 2) {
      return;
    }
    const [ white, , black ] = document.querySelectorAll('p');
    if (
      white.textContent.includes('0:00:00') ||
      black.textContent.includes('0:00:00')
    ) {
      setSequence( s => incr(s, 'T') );
    }
    if (gameover.length > 0) {
      console.log(pgn);
      setGameIsOver(1);
    }
    return;
  });

  // Chess clock
  useEffect( () => {
    if (timeControlTag === '-' || gameIsOver % 2) {
      return;
    }
    const tc = parseTC(timeControlTag);
    const hasEndSign = sequence.split(',').at(-1).match(/[DRT]/);
    const whiteStuff = [
      { w: -1, b: 0 },
      hasEndSign ? 0 : tc[whiteTimeIdx].bonus,
      tc[whiteTimeIdx].goal,
      Math.ceil(plyCount / 2),
      tc[whiteTimeIdx + 1]?.init || 0,
      setWhiteTime,
      setWhiteTimeIdx
    ];
    const blackStuff = [
      { w: 0, b: -1 },
      hasEndSign ? 0 : tc[blackTimeIdx].bonus,
      tc[blackTimeIdx].goal,
      Math.floor(plyCount / 2),
      tc[blackTimeIdx + 1]?.init || 0,
      setBlackTime,
      setBlackTimeIdx
    ];
    const [ countdown ] = (
      plyCount % 2 ? blackStuff : whiteStuff // decr. time for has the move
    );
    const [ , bonus, goal, moves, nextInit, setTime, setTimeIdx ] = (
      plyCount % 2 ? whiteStuff : blackStuff // adjust time for made move
    );
    setTime(t => {
      return (
        t + (sequence.length > 0 ? bonus : 0) + (moves === goal ? nextInit : 0)
      );
    });
    if (moves === goal && nextInit > 0) {
      setTimeIdx(i => i + 1);
    }
    const id = setInterval( () => {
      setWhiteTime(t => t ? t + countdown.w : 0);
      setBlackTime(t => t ? t + countdown.b : 0);
      return;
    }, 1000 );
    return () => clearInterval(id);
  }, [ timeControlTag, gameIsOver, sequence, whiteTimeIdx, blackTimeIdx ] );

  // CPU opponent play
  useEffect( () => {
    if (plyCount % 2 === opponent && gameIsOver === 0) {
      const move = cpuPlay(legalMoves);
      const piece = getPieceOn(
        move.slice(0, 2),
        expand(position.split(' ')[0], true)
      );
      const isPromotion = (
        piece === 'P' && move.at(-1) == 8 ||
        piece === 'p' && move.at(-1) == 1
      );
      const pcn = move + (isPromotion ? 'q' : '');
      const id = setTimeout( () => {
        setSequence( s => incr(s, pcn) );
        return;
      }, 5000 );
      return () => clearInterval(id);
    }
    return;
  }, [ sequence, opponent, gameIsOver ] );

  // Menu should permanently display in desktop mode
  useEffect( () => {
    const menuToggle = () => {
      if (window.innerWidth < 1024) {
        setIsCloseButton(false);
        setIsMobile(true);
      } else {
        setIsCloseButton(true);
        setIsMobile(false);
      }
      return;
    };
    menuToggle();
    window.addEventListener("resize", menuToggle);
    return;
  }, [] );

  return (
    <GameGrid
      isX={isCloseButton}
      setIsX={setIsCloseButton}
      xBtn={props.closeButton}
      burg={props.hamburger}
      tree={props.menu}
      isMobile={isMobile}
      path={menuPath}
      setPath={setMenuPath}
      isLeaf={props.isLeaf}
      setters={
        [
          [ setColorTheme, setPromotionChoice, x => x, x => x ],
          [ setColorTheme, x => x, setOpponent, setTimeControlTag ],
          [ setColorTheme, x => x, x => x, x => x ],
          [ setColorTheme, x => x, x => x, x => x ]
        ][gameIsOver + 2]
      }
      unlocked={[ '1100', '1011', '1000', '1000' ][gameIsOver + 2]}
      disabled={[ '110', '011', '101', '111' ][gameIsOver + 2]}
      setGame={setGameIsOver}
      theme={colorTheme}
      vs={opponent}
      pro={promotionChoice}
      initTime={parseTC(timeControlTag)[0].init}
      isActive={
        [
          false,
          false,
          plyCount % 2 === opponent ? false : true,
          false
        ][gameIsOver + 2]
      }
      org={[ selectedOrigin, '' ][gameIsOver % 2]}
      setOrg={setSelectedOrigin}
      tgt={[ selectedTarget, '' ][gameIsOver % 2]}
      setTgt={setSelectedTarget}
      setSeq={setSequence}
      bg={JSON.parse(props.bgColor)}
      whiteTime={
        [ parseTC(timeControlTag)[0].init, whiteTime ][
          gameIsOver === -1 ? 0 : 1
        ]
      }
      blackTime={
        [ parseTC(timeControlTag)[0].init, blackTime ][
          gameIsOver === -1 ? 0 : 1
        ]
      }
      setWhiteTime={setWhiteTime}
      setBlackTime={setBlackTime}
      gameStat={
        [
          {
            position: inits.position,
            legalMoves: inits.legalMoves,
            white: inits.white,
            black: inits.black,
            openingName: inits.openingName,
            movetext: inits.movetext,
            capturedList: inits.capturedList,
            gameover: inits.gameover
          },
          {
            position,
            legalMoves,
            white,
            black,
            openingName,
            movetext,
            capturedList,
            gameover
          }
        ][gameIsOver === -1 ? 0 : 1]
      }
    />
  );
};

function incr(csv, v) {
  return (csv.length ? csv.split(',') : []).concat([ v ]).join();
}

function parseTC(tag) {
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

function GameGrid(props) {
  const burgerToggle = () => props.setIsX(!props.isX);
  const boxedTimer = [ styles.bgBox, styles.clock ].join(' ');

  return (
    <div className={styles.background}>
      <div className={styles.triColCenterWide}>
        <div className={styles.burgerBox} onClick={burgerToggle}>
          {props.isX ? props.xBtn : props.burg}
        </div>
        <ChessNav
          isViz={props.isX}
          isMobile={props.isMobile}
          tree={props.tree}
          path={props.path}
          setPath={props.setPath}
          isLeaf={props.isLeaf}
          setters={props.setters}
          unlocked={props.unlocked}
          disabled={props.disabled}
          initTime={props.initTime}
          setWhiteTime={props.setWhiteTime}
          setBlackTime={props.setBlackTime}
          isInProgress={0}
          isOver={1}
          setGame={props.setGame}
          org={props.org}
          tgt={props.tgt}
          pro={props.pro}
          seqIncr={incr}
          setSeq={props.setSeq}
        />
        <div className={styles.flexPanels}>
          <div className={styles.bgBox}>
            <Chessboard
              exp={expand}
              pieceOn={getPieceOn}
              theme={props.theme}
              isActive={props.isActive}
              pos={props.gameStat.position}
              lm={props.gameStat.legalMoves}
              org={props.org}
              setOrg={props.setOrg}
              tgt={props.tgt}
              setTgt={props.setTgt}
              isHeld={-2}
              setGame={props.setGame}
              setMenu={props.setPath}
              openMenu={props.setIsX}
              seqIncr={incr}
              setSeq={props.setSeq}
              setTime={
                props.gameStat.position.split(' ')[1] === 'w' ?
                props.setWhiteTime : props.setBlackTime
              }
            />
          </div>
          <div className={styles.fourSquare}>
            <div className={boxedTimer}>
              <ChessText
                text={
                  "Player: " + (
                    props.vs > -1 && (
                      props.vs && "visitor" || "CPU"
                    ) || "visitor"
                  ) +
                  '\n' +
                  "White's time remaining " +
                  timeToString(props.whiteTime)
                }
              />
              <ChessText
                text={props.gameStat.white}
                bgColor={props.bg[props.gameStat.white]}
              />
            </div>
            <div className={boxedTimer}>
              <ChessText
                text={
                  "Player: " + (
                    props.vs > -1 && (
                      props.vs && "CPU" || "visitor"
                    ) || "visitor"
                  ) +
                  '\n' +
                  "Black's time remaining " +
                  timeToString(props.blackTime)
                }
              />
              <ChessText
                text={props.gameStat.black}
                bgColor={props.bg[props.gameStat.black]}
              />
            </div>
            <div className={[ styles.bgBox, styles.leftAndRight ].join(' ')}>
              <ChessText text={props.gameStat.openingName} />
              <ChessText text={props.gameStat.movetext} />
              <ChessText text={props.gameStat.capturedList} />
              <ChessText
                text={props.gameStat.gameover}
                bgColor={null}
                color="red"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getNodeValue(tree, path, depth = path.length) {
  if (depth == 0) {
    return Object.freeze(tree);
  }
  return Object.freeze(
    getNodeValue(tree, path, depth - 1)[
      Object.keys(
        getNodeValue(tree, path, depth - 1)
      )[ path[depth - 1] ]
    ]
  );
}

function ChessNav(props) {
  if (props.isViz == false) {
    return null;
  }

  const disabled = Object.freeze(
    props.disabled.split('').map(x => parseInt(x) ? true : false)
  );

  const btn = bitIdx => {
    return [ styles.button ].concat(
      disabled[bitIdx] && [ styles.ghostedOut ] || (
        bitIdx == 2 && [ styles.blinking ] || []
      )
    ).join(' ');
  };

  const enable = bitIdx => !disabled[bitIdx] || null;

  const startGame = () => {
    props.setWhiteTime(props.initTime);
    props.setBlackTime(props.initTime);
    props.setGame(props.isInProgress);
    return;
  };

  const resign = () => props.setSeq( s => props.seqIncr(s, 'R') );

  const promotePawn = () => {
    const pcn = props.org + props.tgt + props.pro;
    props.setSeq( s => props.seqIncr(s, pcn) );
    props.setGame(props.isInProgress);
    return;
  };

  const sta = enable(0) && startGame;

  const res = enable(1) && resign;

  const pro = enable(2) && promotePawn;

  const buttons = (
    <>
      <div className={btn(0)} onClick={sta}>
        Start
      </div>
      <div className={btn(1)} onClick={res}>
        Resign
      </div>
      <div className={btn(2)} onClick={pro}>
        Promote
      </div>
    </>
  );

  const tree = JSON.parse(props.tree);

  const treeDisplay = (path, index = 0) => {
    const headingOnly = heading => Object.freeze([ heading, null ]);
    const headingAndSub = (heading, i) => {
      return [
        heading,
        i == path[index] && (
          treeDisplay(path, index + 1)
        ) || null
      ];
    };
    const values = index > 0 && (
      Object.values( getNodeValue(tree, path, index) )
    ) || null;
    const setters = index > 0 && props.setters || null;
    const unlocked = (
      index > 0 && parseInt(props.unlocked[ path[index] ]) || true
    );
    if (index === path.length) {
      const terminalMenu = (
        <ListAsMenu
          pathLength={index}
          list={Object.keys( getNodeValue(tree, path) ).map(headingOnly)}
          path={path}
          setPath={props.setPath}
          isLeaf={props.isLeaf}
          values={values}
          setValue={setters}
          unlocked={unlocked}
        />
      );
      return (
        props.isMobile && (
          index == 0 && (
            <div className={styles.bgBox}>
              {terminalMenu}
              {buttons}
            </div>
          ) || terminalMenu
        ) || (
          <div className={styles.bgBox}>
            {terminalMenu}
            {index == 0 && buttons || null}
          </div>
        )
      );
    }
    return (
      props.isMobile && (
        index == 0 && (
          <div className={styles.bgBox}>
            <ListAsMenu
              pathLength={index}
              list={
                Object.keys(
                  getNodeValue(tree, path, index)
                ).map(headingAndSub)
              }
              path={path}
              setPath={props.setPath}
              isLeaf={props.isLeaf}
              values={values}
              setValue={setters}
              unlocked={unlocked}
            />
            {buttons}
          </div>
        ) || (
          <ListAsMenu
            pathLength={index}
            list={
              Object.keys(
                getNodeValue(tree, path, index)
              ).map(headingAndSub)
            }
            path={path}
            setPath={props.setPath}
            isLeaf={props.isLeaf}
            values={values}
            setValue={setters}
            unlocked={unlocked}
          />
        )
      ) || (
        <>
          <div className={styles.bgBox}>
            <ListAsMenu
              pathLength={index}
              list={
                Object.keys(
                  getNodeValue(tree, path, index)
                ).map(headingOnly)
              }
              path={path}
              setPath={props.setPath}
              isLeaf={props.isLeaf}
              values={values}
              setValue={setters}
              unlocked={unlocked}
            />
            {index == 0 && buttons || null}
          </div>
          {treeDisplay(path, index + 1)}
        </>
      )
    );
  };

  return (
    <nav className={styles.underBurger}>
      {treeDisplay(props.path)}
    </nav>
  );
}

function ChessText({ text, bgColor, color }) {
  const padAndColor = [ styles.padded ].concat(
    bgColor ? [ styles[bgColor] ] : []
  ).concat(
    color ? [ styles[color] ] : []
  ).join(' ');

  return (
    <p className={padAndColor}>
      {text}
    </p>
  );
}
