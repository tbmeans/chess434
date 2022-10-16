import { noBullets, hiLite } from './ListAsMenu.module.css'

export default function ListAsMenu(props) {
  return (
    <menu>
      {props.list.map( (s, i) => {
        return (
          <li key={i}
            className={[ noBullets, hiLite ].join(' ')}
            onClick={
              (props.unlocked || null) && (
                () => {
                  if (props.path.length > props.pathLength) {
                    props.setPath('');
                  } else if ( props.isLeaf(props.path + i) ) {
                    props.setValue[ props.path[0] ](props.values[i]);
                    props.setPath('');
                  } else {
                    props.setPath(props.path + i);
                  }
                  return;
                }
              )
            }
          >{s}</li>
        );
      })}
    </menu>
  );
}
