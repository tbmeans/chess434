import styles from './ChessNav.module.css';
import ListAsMenu from '@components/ListAsMenu';

export default function ChessNav(props) {
  if (props.isViz == false) {
    return null;
  }

  const disabled = Object.freeze(
    props.disabled.split('').map( x => parseInt(x) )
  );

  const button = bitIdx => {
    return [ styles.button ].concat(
      disabled[bitIdx] && [ styles.ghostedOut ] || (
        bitIdx == 2 && [ styles.blinking ] || []
      )
    ).join(' ');
  };

  const enable = bitIdx => !disabled[bitIdx] || null;

  const startGame = () => props.setGame(props.isInProgress);

  const resign = () => props.setSeq( props.seqIncr('R') );

  const promotePawn = () => {
    const pcn = props.org + props.tgt + props.pro;
    props.setSeq( props.seqIncr(pcn) );
    props.setGame(props.isInProgress);
    props.setOrg('');
    props.setTgt('');
    return;
  };

  const buttons = (
    <>
      <div className={button(0)} onClick={enable(0) && startGame}>
        Start
      </div>
      <div className={button(1)} onClick={enable(1) && resign}>
        Resign
      </div>
      <div className={button(2)} onClick={enable(2) && promotePawn}>
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
      Object.values(
        props.getNodeValue(tree, path, index)
      )
    ) || null;
    const setters = index > 0 && props.setters || null;
    const unlocked = (
      index > 0 && parseInt(props.unlocked[ path[index] ]) || true
    );
    if (index === path.length) {
      const terminalMenu = (
        <ListAsMenu
          pathLength={index}
          list={
            Object.keys( props.getNodeValue(tree, path) ).map(headingOnly)
          }
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
            <div className={props.box}>
              {terminalMenu}
              {buttons}
            </div>
          ) || terminalMenu
        ) || (
          <div className={props.box}>
            {terminalMenu}
            {index == 0 && buttons || null}
          </div>
        )
      );
    }
    if (props.isMobile) {
      const mobileMenu = (
        <ListAsMenu
          pathLength={index}
          list={
            Object.keys(
              props.getNodeValue(tree, path, index)
            ).map(headingAndSub)
          }
          path={path}
          setPath={props.setPath}
          isLeaf={props.isLeaf}
          values={values}
          setValue={setters}
          unlocked={unlocked}
        />
      );
      return (
        index == 0 && (
          <div className={props.box}>
            {mobileMenu}
            {buttons}
          </div>
        ) || mobileMenu
      );
    }
    return ( /* desktop */
      <>
        <div className={props.box}>
          <ListAsMenu
            pathLength={index}
            list={
              Object.keys(
                props.getNodeValue(tree, path, index)
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
    );
  };

  return (
    <nav className={styles.underBurger}>
      {treeDisplay(props.path)}
    </nav>
  );
}
