import styles from './Chessboard.module.css'

export default function Chessboard(props) {
  const origins = Object.freeze(
    props.lm.split(',').map( pcn => pcn.slice(0, 2) )
  );

  const movesFromSel = Object.freeze(
    props.lm.split(',').filter(
      pcn => pcn.slice(0, 2) === props.org
    ).map( pcn => pcn.slice(2, 4) )
  );

  const piece = Object.freeze({
    b: 'bishop', k: 'king', n: 'knight', p: 'pawn', q: 'queen', r: 'rook'
  });

  const activeColorIsWhite = props.pos.split(' ')[1] === 'w';

  const squares = Object.freeze(
    props.exp(props.pos.split(' ')[0], true).split('').map(
      function(n, i, ppd64) {
        const x = i % 8;
        const y = 7 - (i - i % 8) / 8;
        const shade = (x + y) % 2 === 1 ? "Lite" : "Dark";
        const file = "abcdefgh"[x];
        const rank = "12345678"[y];
        const sq = file + rank;
        const hasMoves = origins.includes(sq);
        const isSelectedSquare = sq === props.org;
        const isTargetSquare = movesFromSel.includes(sq);

        const bg = [ styles[props.theme + shade] ].concat(
          isSelectedSquare ? (
            (hasMoves ? [ styles.moveAvail ] : [ styles.noMove ])
          ) : []
        ).join(' ');

        const isPromotionMove = (
          activeColorIsWhite && rank == 8 ||
          activeColorIsWhite === false && rank == 1
        ) && props.pieceOn(props.org, ppd64) === (
          activeColorIsWhite ? 'P' : 'p'
        );

        const select = (props.isActive || null) && ( () => {
          if (isTargetSquare) {
            if (isPromotionMove) {
              props.setTgt(sq);
              props.setGame(props.isHeld);
              props.openMenu(true);
              props.setMenu('1');
            } else {
              const pcn = props.org + sq;
              props.setSeq( props.seqIncr(pcn) );
              props.setOrg('');
            }
          } else if (isSelectedSquare) {
            props.setOrg('');
          } else {
            props.setOrg(sq);
          }
          return;
        });

        const fg = (file === 'a' || rank == 1) && (
          [ styles.anLabel ].concat(
            ( file === 'a' && rank % 2 == 1 ||
              rank == 1 && 'aceg'.includes(file)
            ) && [ styles.onDark ] || []
          ).join(' ')
        ) || '';

        const text = '\u00A0' + (
          (rank == 1 ? file : '') +
          (file === 'a' ? rank : '')
        );

        const boardLabel = fg.length && (
          <span className={fg}>{text}</span>
        ) || null;

        const path = (isTargetSquare || n != 1) && (
          n == 1 && "dot.svg" || (
            "Chess_" +
            n.toLowerCase() +
            (n.toUpperCase() === n ? "lt45" : "dt45") +
            (isTargetSquare && "_dotted" || '') +
            ".svg"
          )
        ) || '';

        const imgLabel = (
          n == 1 && [] || [
            n.toUpperCase() === n ? "white" : "black",
            piece[n.toLowerCase()],
            "on"
          ]
        ).concat([ sq ]).join(' ') +
        (isTargetSquare ? ", legal move" : '') +
        (isSelectedSquare ? " selected" : '');

        const image = path.length && (
          <img src={path} alt={imgLabel} className={styles.piece} />
        ) || null;

        return (
          <div key={sq} className={bg} onClick={select}>
            {boardLabel}{image}
          </div>
        );
      }
    )
  );

  return (
    <div className={styles.grid8Cols}>
      {squares}
    </div>
  );
}
