import styles from './GameGrid.module.css'

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
      <div className={styles.fourColCenterWide}>
        <div className={styles.burgerBox}>{burgerSVG}</div>
        <div className={
          [ styles.upper, styles.center ].join(' ')
        }>
          <div className="bg-box">chessboard</div>
        </div>
        <div className={styles.centerLeft}>
          <div className="bg-box">W</div>
        </div>
        <div className={styles.centerRight}>
          <div className="bg-box">B</div>
        </div>
        <div className={
          [ styles.bottom, styles.center ].join(' ')
        }>
          <div className="bg-box">scoresheet</div>
        </div>
      </div>
    </div>
  );
}
