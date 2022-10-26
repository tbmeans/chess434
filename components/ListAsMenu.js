import React from 'react'
import { noBullet, hiLite } from './ListAsMenu.module.css'

/**
 *
 * @param {Object} props properties
 *     * list: an array of arrays each [ menuText, optionalSubMenu ]
 *     * path: index of selected menu item from an array of menu list items
 *     * pathLength: number of path indices required to clickthru to given list
 *     * setPath: setState's bind or state hook setter for path
 *     * isLeaf: function ret. true if path completes selection to close menu
 *     * values: array of values corres. to menu choices for given path
 *     * setValue: an array of state setters for each category of values
 *     * unlocked: string of bits rep'ing operability of main menu choices
 * @returns unordered list, no bullets, and each list item can have a heading
 */
export default function ListAsMenu(props) {
  return (
    <menu>
      {props.list.map( (item, k) => {
        const select = (props.unlocked || null) && (e => {
          e.stopPropagation(); // prevent submenu click bubbling
          if (props.path.length > props.pathLength) {
            props.setPath(''); // close submenu for outside clicks
          } else if ( props.isLeaf(props.path + k) ) {
            // value selection
            props.setValue[ props.path[0] ](props.values[k]);
            props.setPath('');
          } else {
            props.setPath(props.path + k); // open submenu
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
