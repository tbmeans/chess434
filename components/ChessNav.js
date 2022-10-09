import ListAsMenu from './ListAsMenu'

export default function ChessNav(props) {
  const menu = JSON.parse(props.tree);
  const tcObj = menu[ Object.keys(menu)[ props.hasSub[0] ] ];
  const proMove = props.org + props.tgt + (props.pro || 'q');

  return props.isViz && (
    <nav className={props.sty.underBurger}>
      <div className={props.sty.bgBox}>
        <ListAsMenu
          list={Object.keys(menu)}
          index={props.path}
          setIndex={props.setPath}
          setValue={null}
          unlocked={true}
          exit={itemIdx => false}
        />
        <div className={[ props.sty.button ].concat(
          props.disabled1 ? [ props.sty.ghostedOut ] : []
        ).join(' ')} onClick={ (!props.disabled1 || null) && (
          () => {
            props.setDisab1(true);
            props.setDisab2(false);
            props.setUnlock('1100');
            props.setBoard(true);
            props.setWhite(props.initTime);
            props.setBlack(props.initTime);
            return;
          }
        )}>Start</div>
        <div className={[ props.sty.button ].concat(
          props.disabled2 ? [ props.sty.ghostedOut ] : []
        ).join(' ')} onClick={ (!props.disabled2 || null) && (
          () => {
            props.setDisab2(true);
            props.setMoveSeq( s => props.seqIncr(s, 'R') );
            return;
          }
        )}>Resign</div>
        <div className={[ props.sty.button ].concat(
          props.disabled3 ? [ props.sty.ghostedOut ] : []
        ).join(' ')} onClick={ (!props.disabled3 || null) && (
          () => {
            props.setDisab3(true);
            clearInterval(props.timerId);
            props.setTime(t => t + props.bonus);
            props.setMoveSeq( s => props.seqIncr(s, proMove) );
            props.setBoard(true);
            props.setOrg('');
            props.setIsDown(v => !v);
            return;
          }
        )}>Promote</div>
      </div>
      {props.path.length > 0 &&
        <div className={props.sty.bgBox}>
          <ListAsMenu
            list={Object.keys(menu[ Object.keys(menu)[ props.path[0] ] ])}
            index={props.path}
            setIndex={props.setPath}
            values={Object.values(menu[ Object.keys(menu)[ props.path[0] ] ])}
            setValue={props.setters}
            unlocked={props.unlock[ props.path[0] ] ? true : false}
            exit={itemIdx => {
              return (
                props.path[0] != props.hasSub[0] || itemIdx < props.subLo[0]
              );
            }}
          />
        </div>
      }
      {props.path[0] == props.hasSub[0] && props.path[1] >= props.subLo[0] &&
        <div className={props.sty.bgBox}>
          <ListAsMenu
            list={Object.keys(tcObj[
              Object.keys(tcObj)[ props.path[1] ]
            ])}
            index={props.path}
            setIndex={props.setPath}
            values={Object.values(tcObj[
              Object.keys(tcObj)[ props.path[1] ]
            ])}
            setValue={props.setters}
            unlocked={props.unlock[ props.hasSub[0] ] ? true : false}
            exit={itemIdx => true}
          />
        </div>
      }
    </nav>
  );
}
