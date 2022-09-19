import styles from './Chessboard.module.css'
import engine from 'chess-sjppd/engine'

const { expand } = engine.console;

export default function Chessboard({
  position, legalMoves, selected, colorTheme
}) {
  const squares = Object.freeze(
    expand(position.split(' ')[0], true).split('').map( (n, i) => {
      const x = i % 8;
      const y = 7 - (i - i % 8) / 8;
      const shade = (x + y) % 2 === 1 ? "Lite" : "Dark";
      const file = "abcdefgh"[x];
      const rank = "12345678"[y];
      const hasMoves = legalMoves.split(',').map( pcn => {
        return pcn.slice(0, 2);
      }).includes(file + rank);

      const squareBackgroundColor = (
        [ styles[colorTheme + shade] ].concat(
          file + rank === selected ? (
            (hasMoves ? [ styles.moveAvail ] : [ styles.noMove ])
          ) : []
        )
      ).join(' ');

      const labelClass = file === 'a' || rank == 1 ? (
        [ styles.anLabel ].concat(
          (file === 'a' && rank % 2 == 1 ||
            rank == 1 && 'aceg'.includes(file)
          ) ? [ styles.onDark ] : []
        ).join(' ')
      ) : '';

      const text = (
        (rank == 1 ? file : '') +
        (file === 'a' ? rank : '')
      );
      const piece = {
        b: 'bishop',
        k: 'king',
        n: 'knight',
        p: 'pawn',
        q: 'queen',
        r: 'rook'
      };
      const isTargetSquare = legalMoves.split(',').filter(pcn => {
        return pcn.slice(0, 2) === selected;
      }).map( pcn => pcn.slice(2, 4) ).includes(file + rank);

      const imgTitle = (n == 1 ?
        [] : [
          n.toUpperCase() === n ? "white" : "black",
          piece[n.toLowerCase()],
          "on"
        ]
      ).concat([ file + rank ]).join(' ') +
      (isTargetSquare ? ", legal move" : '') +
      (file + rank === selected ? " selected" : '');

      const path = n == 1 ? (
        isTargetSquare ? "dot.svg" : ''
      ) : (
        "Chess_" +
        n.toLowerCase() +
        (n.toUpperCase() === n ? "lt45" : "dt45") +
        (isTargetSquare ? "_dotted" : '') +
        ".svg"
      );

      return (
        <div key={file + rank}
          id={file + rank}
          title={file + rank}
          className={squareBackgroundColor}
          onClick={x => x}
        >
          { labelClass.length ? (
              <span className={labelClass}>
                &nbsp;{text}
              </span>
            ) : null
          }
          { path.length ? (
              <img src={path} title={imgTitle} className={styles.piece}/>
            ) : null
          }
        </div>
      );
    })
  );

  return (
    <div className={styles.grid8Cols}>{squares}</div>
  );
}
