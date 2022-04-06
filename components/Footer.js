import styles from './Footer.module.css'

export default function Footer() {
  const commons = "https://commons.wikimedia.org/w/index.php?curid=";
  const curid = {
    kdt: 1499803,
    klt: 1499806,
    qdt: 1499811,
    qlt: 1499812,
    rdt: 1499813,
    rlt: 1499814,
    bdt: 1499800,
    blt: 1499801,
    ndt: 1499807,
    nlt: 1499808,
    pdt: 1499809,
    plt: 1499810
  };
  const pieces = Object.keys(curid);
  const credits = [];
  for (let pc, i = 0; i < pieces.length; i++) {
    pc = pieces[i];
    credits[i] = <a href={commons + curid[pc]}>{pc}</a>;
  }
  return (
    <>
      <footer className={styles.footer}>
        <p>2021-2022, Tim Means<br/><br/><i>Images credit</i>: Chess vector images {credits[0]}, {credits[1]}, {credits[2]}, {credits[3]}, {credits[4]}, {credits[5]}, {credits[6]}, {credits[7]}, {credits[8]}, {credits[9]}, {credits[10]}, {credits[11]} by <a href="https://en.wikipedia.org/wiki/User:Cburnett">en:User:Cburnett</a> - Own work, <a href="http://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>, via Wikimedia Commons</p>
      </footer>
    </>
  )
}
