import styles from './GameGrid.module.css'
import engine from 'chess-sjppd/engine'
import Chessboard from './Chessboard';
import ChessText from './ChessText';

const { PGNSevenTagRoster, getGameStatus, cpuPlay } = engine.ui;

const pgnInit = new PGNSevenTagRoster;

const burgerSVG = (
  <svg id="burger-icon" height="5em" width="6em"
    xmlns="http://www.w3.org/2000/svg"
    onClick={() => {}}>
    <line x1="30" y1="30" x2="60" y2="30"
      stroke="black" strokeWidth="3" />
    <line x1="30" y1="40" x2="60" y2="40"
      stroke="black" strokeWidth="3" />
    <line x1="30" y1="50" x2="60" y2="50"
      stroke="black" strokeWidth="3" />
  </svg>
);

const exBurgSVG = (
  <svg id="burger-icon" height="5em" width="6em"
    xmlns="http://www.w3.org/2000/svg"
    onClick={() => {}}>
    <line x1="30" y1="30" x2="60" y2="60"
      stroke="black" strokeWidth="3" />
    <line x1="60" y1="30" x2="30" y2="60"
      stroke="black" strokeWidth="3" />
  </svg>
);

const bgColorFor = {
  "Has move": "onGreen",
  "check": "onYellow",
  "checkmate": "onRed",
  "Made move": "onRed"
};

export default function GameGrid() {
  const { position, legalMoves, white, black,
    openingName, movetext, capturedList, gameover, pgn
  } = JSON.parse( getGameStatus('', pgnInit) );

  return (
    <div className={styles.background}>
      <div className={styles.triColCenterWide}>
        <div className={styles.burgerBox}>{burgerSVG}</div>
        <div className={styles.flexPanels}>
          <div className={styles.bgBox}>
            <Chessboard
              position={position}
              legalMoves={legalMoves}
              selected={"a2"}
              colorTheme={"woodgrain"}
            />
          </div>
          <div className={styles.fourSquare}>
            <div className={[ styles.bgBox, styles.clock ].join(' ')}>
              <ChessText text="W 1:00:00" />
              <ChessText text={white} bgColor={bgColorFor[white]} />
            </div>
            <div className={[ styles.bgBox, styles.clock ].join(' ')}>
              <ChessText text="B 1:00:00" />
              <ChessText text={black} bgColor={bgColorFor[black]} />
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
