import { noBullets, hiLite } from './ListAsMenu.module.css'

export default function ListAsMenu(props) {
  return (
    <menu>
      {props.list.map( (s, i) => {
        return (
          <li key={i}
            className={[ noBullets, hiLite ].join(' ')}
            onClick={ (props.unlocked || null) && ( () => {
              if (props.setValue) {
                props.setValue[ props.index[0] ](
                  props.values[props.index.at(-1)]
                );
                return;
              }
              props.setIndex(props.exit(i) ? '' : props.index + i);
              return;
            })}
          >{s}</li>
        );
      })}
    </menu>
  );
}
