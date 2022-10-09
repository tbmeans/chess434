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

  const indexOfSelected = (
    "abcdefgh".indexOf(props.org[0]) - 8 * props.org[1] + 64
  );

  const piece = Object.freeze(
    { b: 'bishop', k: 'king', n: 'knight',
    p: 'pawn', q: 'queen', r: 'rook' }
  );

  const activeColorIsWhite = props.pos.split(' ')[1] === 'w';

  const squares = Object.freeze(
    props.exp(props.pos.split(' ')[0], true).split('').map(
      function(n, i, ppd64) {
        const x = i % 8;
        const y = 7 - (i - i % 8) / 8;
        const shade = (x + y) % 2 === 1 ? "Lite" : "Dark";
        const file = "abcdefgh"[x];
        const rank = "12345678"[y];
        const hasMoves = origins.includes(file + rank);
        const isSelectedSquare = file + rank === props.org;

        const bg = (
          [ styles[props.theme + shade] ].concat(
            isSelectedSquare ? (
              (hasMoves ? [ styles.moveAvail ] : [ styles.noMove ])
            ) : []
          )
        ).join(' ');

        const fg = file === 'a' || rank == 1 ? (
          [ styles.anLabel ].concat(
            ( file === 'a' && rank % 2 == 1 ||
              rank == 1 && 'aceg'.includes(file) ) ?
            [ styles.onDark ] : []
          ).join(' ')
        ) : '';

        const text = '\u00A0' + (
          (rank == 1 ? file : '') +
          (file === 'a' ? rank : '')
        );

        const isTargetSquare = movesFromSel.includes(file + rank);

        const isPromotionMove = (
          isTargetSquare &&
          (activeColorIsWhite && rank == 8 ||
          activeColorIsWhite === false && rank == 1) &&
          ppd64[indexOfSelected] === (activeColorIsWhite ? 'P' : 'p')
        );

        const imgTitle = (n == 1 ?
          [] : [
            n.toUpperCase() === n ? "white" : "black",
            piece[n.toLowerCase()],
            "on"
          ]
        ).concat([ file + rank ]).join(' ') +
        (isTargetSquare ? ", legal move" : '') +
        (isSelectedSquare ? " selected" : '');

        const path = n == 1 ? (
          isTargetSquare ? "dot.svg" : ''
        ) : (
          "Chess_" +
          n.toLowerCase() +
          (n.toUpperCase() === n ? "lt45" : "dt45") +
          (isTargetSquare ? "_dotted" : '') +
          ".svg"
        );

        const label = fg.length ? <span className={fg}>{text}</span> : null;

        const image = path.length ? (
          <img
            src={path}
            title={imgTitle}
            className={styles.piece}
          />
        ) : null;

        return (
          <div key={file + rank}
            id={file + rank}
            title={file + rank}
            className={bg}
            onClick={ (props.isActive || null) && ( () => {
              if (isTargetSquare) {
                if (isPromotionMove) {
                  props.setTgt(file + rank);
                  props.setIsActive(false);
                  props.setMenu(props.pro);
                  props.setProDisabled(false);
                } else {
                  const pcn = props.org + file + rank;
                  clearInterval(props.timerId);
                  props.setTime(t => t + props.bonus);
                  props.setSeq( s => props.seqIncr(s, pcn) );
                  props.setOrg('');
                  props.setIsDown(v => !v);
                }
              } else if (isSelectedSquare) {
                props.setOrg('');
              } else {
                props.setOrg(file + rank);
              }
              return;
            })}
          >{label}{image}</div>
        );
      }
    )
  );

  return (
    <div className={styles.grid8Cols}>{squares}</div>
  );
}
