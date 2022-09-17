import styles from './GameGrid.module.css'

const { PGNSevenTagRoster, getGameStatus, cpuPlay } = engine.ui;

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

export default function GameGrid(props) {
  return (
    <div className={styles.background}>
      <div className={styles.triColCenterWide}>
        <div className={styles.burgerBox}>{burgerSVG}</div>
        <div className={styles.flexPanels}>
          <div className="bg-box">chessboard</div>
          <div className={styles.fourSquare}>
            <div className="bg-box">W</div>
            <div className="bg-box">B</div>
            <div className={
              [ "bg-box", styles.leftAndRight ].join(' ')
            }>1.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
