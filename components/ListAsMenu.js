import { noBullet, hiLite } from './ListAsMenu.module.css'

export default function ListAsMenu(props) {
  return (
    <menu>
      {props.list.map( (item, k) => {
        const select = (props.unlocked || null) && (e => {
          e.stopPropagation();
          if (props.path.length > props.pathLength) {
            props.setPath('');
          } else if ( props.isLeaf(props.path + k) ) {
            props.setValue[ props.path[0] ](props.values[k]);
            props.setPath('');
          } else {
            props.setPath(props.path + k);
          }
          return;
        });
        return (
          <li key={k} className={noBullet} onClick={select}>
            <span className={hiLite}>
              {item[0] /* heading */}
            </span>
            {item[1] /* Assign a new ListAsMenu for submenu. */}
          </li>
        );
      })}
    </menu>
  );
}
