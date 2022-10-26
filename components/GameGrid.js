import { useState, useEffect } from 'react';
import styles from './GameGrid.module.css';
import ChessNav from './ChessNav';
import Chessboard from './Chessboard';
import engine from 'chess-sjppd/engine';
import MoreString from 'more-string-434/MoreString'

const {
  plyStatusMessages,
  PGNSevenTagRoster,
  getGameStatus,
  expand,
  getPieceOn,
  cpuPlay
} = engine.ui;

const [ has, chk, mate, made ] = plyStatusMessages;

const messageColors = Object.freeze(
  Object.fromEntries(
    new Map([
      [ has, styles.onGreen ],
      [ chk, styles.onYellow ],
      [ mate, styles.onRed ],
      [ made, styles.onRed ]
    ])
  )
);

const pgnInit = new PGNSevenTagRoster;

const toHmmss = MoreString.toHmmss.bind(MoreString);

const toReadableHMS = MoreString.toReadableHMS.bind(MoreString);

const toDuration = MoreString.toDuration.bind(MoreString);

const ChessText = function({ text, bgColor, color }) {
  const padAndColor = [ styles.padded ].concat(
    bgColor && [ bgColor ] || []
  ).concat(
    color && [ styles[color] ] || []
  ).join(' ');

  return (
    <p className={padAndColor}>
      {text}
    </p>
  );
}

export default function GameGrid(props) {
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

  const burgerToggle = () => setIsCloseButton(!isCloseButton);

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

  const plyCount = sequence && sequence.split(',').length || 0;

  const seqObj = Object.freeze( new MoreString(sequence) );

  const seqIncr = seqObj.csvIncrement.bind(seqObj);

  // Handle transition to game over
  useEffect( () => {
    if (gameIsOver % 2) {
      return;
    }
    const t = document.querySelectorAll('time');
    if (
      t[0].textContent.includes('0h 0m 0s') ||
      t[1].textContent.includes('0h 0m 0s')
    ) {
      setSequence( seqIncr('T') );
    }
    if (gameover.length > 0) {
      console.log(pgn);
      setGameIsOver(1);
    }
    return;
  });

  // Chess clock
  useEffect( () => {
    if (gameIsOver === 1) {
      return;
    }
    const tc = props.parseTC(timeControlTag);
    if (gameIsOver === -1) {
      setWhiteTime(tc[0].init);
      setBlackTime(tc[0].init);
      return;
    }
    if (tc[0].init === Infinity) {
      return;
    }
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
      plyCount % 2 && blackStuff || whiteStuff // decr. time for has the move
    );
    const [ , bonus, goal, moves, nextInit, setTime, setTimeIdx ] = (
      plyCount % 2 && whiteStuff || blackStuff // adjust time for made move
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
      const pcn = move + (isPromotion && 'q' || '');
      const id = setTimeout( () => {
        setSequence( seqIncr(pcn) );
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
    <div className={styles.background}>
      <div className={styles.triColCenterWide}>
        <div className={styles.burgerBox} onClick={burgerToggle}>
          {isCloseButton && props.closeButton || props.hamburger}
        </div>
        <ChessNav
          box={styles.bgBox}
          isViz={isCloseButton}
          isMobile={isMobile}
          tree={props.menu}
          path={menuPath}
          setPath={setMenuPath}
          isLeaf={props.isLeaf}
          getNodeValue={props.getNodeValue}
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
          isInProgress={0}
          isOver={1}
          setGame={setGameIsOver}
          org={[ selectedOrigin, '' ][gameIsOver % 2]}
          setOrg={setSelectedOrigin}
          tgt={[ selectedTarget, '' ][gameIsOver % 2]}
          setTgt={setSelectedTarget}
          pro={promotionChoice}
          seqIncr={seqIncr}
          setSeq={setSequence}
        />
        <div className={styles.flexPanels}>
          <div className={styles.bgBox}>
            <Chessboard
              exp={expand}
              pieceOn={getPieceOn}
              theme={colorTheme}
              isActive={
                [
                  false,
                  false,
                  plyCount % 2 === opponent ? false : true,
                  false
                ][gameIsOver + 2]
              }
              pos={position}
              lm={legalMoves}
              org={[ selectedOrigin, '' ][gameIsOver % 2]}
              setOrg={setSelectedOrigin}
              tgt={[ selectedTarget, '' ][gameIsOver % 2]}
              setTgt={setSelectedTarget}
              isHeld={-2}
              setGame={setGameIsOver}
              setMenu={setMenuPath}
              openMenu={setIsCloseButton}
              seqIncr={seqIncr}
              setSeq={setSequence}
            />
          </div>
          <div className={styles.fourSquare}>
            <div className={[ styles.bgBox, styles.clock ].join(' ')}>
              <ChessText
                text={
                  "White: " + (
                    opponent > -1 && (
                      opponent && "visitor" || "CPU"
                    ) || "visitor"
                  )
                }
              />
              <ChessText
                text={white}
                bgColor={messageColors[white]}
              />
              <ChessText text="Time remaining:" />
              <ChessText
                text={
                  whiteTime == Infinity && (
                    <time>
                      {toHmmss(whiteTime).str}
                    </time>
                  ) || (
                    <time dateTime={toDuration(whiteTime).str}>
                      {toReadableHMS(whiteTime).str}
                    </time>
                  )
                }
              />
            </div>
            <div className={[ styles.bgBox, styles.clock ].join(' ')}>
              <ChessText
                text={
                  "Black: " + (
                    opponent > -1 && (
                      opponent && "CPU" || "visitor"
                    ) || "visitor"
                  )
                }
              />
              <ChessText
                text={black}
                bgColor={messageColors[black]}
              />
              <ChessText text="Time remaining:" />
              <ChessText
                text={
                  blackTime == Infinity && (
                    <time>
                      {toHmmss(blackTime).str}
                    </time>
                  ) || (
                    <time dateTime={toDuration(blackTime).str}>
                      {toReadableHMS(blackTime).str}
                    </time>
                  )
                }
              />
            </div>
            <div className={[ styles.bgBox, styles.leftAndRight ].join(' ')}>
              <ChessText text={openingName} />
              <ChessText text={movetext} />
              <ChessText text={capturedList} />
              <ChessText text={gameover} color="red" />
              <ChessText
                text={gameover && "See browser console for PGN export" || ''}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
