export default function WikimediaCredit(props) {
  const credUrl = [
    "https://", props.lang, '.', "wikipedia.org/wiki/", props.user
  ].join('');

  const credText = props.lang + ':' + props.user;

  const licDir = "http://creativecommons.org/licenses";

  const licUrl = [ licDir, props.lic, props.ver, '' ].join("/");

  const licText = [ "CC", props.lic.toUpperCase(), props.ver ].join(' ');

  const commons = "https://commons.wikimedia.org/w/index.php?curid=";

  const sources = Object.freeze(
    props.mediaCurids.map( (curid, i) => {
      return (
        <span key={curid}>
          {i ? ', ' : ' '}
          <a href={commons + curid}>
            {props.mediaFileids[i]}
          </a>
        </span>
      );
    })
  );

  return (
    <p>
      {props.content}
      {sources}
      {[ '', 'by', '' ].join(' ')}
      <a href={credUrl}>
        {credText}
      </a>
      {[ '', '-', 'Own', 'work,', '' ].join(' ')}
      <a href={licUrl}>
        {licText}
      </a>
      {[ ',', 'via', 'Wikimedia', 'Commons' ].join(' ')}
    </p>
  );
}
