export default function WikimediaCredit({ lang, user, lic, ver,
  mediaCurids, mediaFileids, content }) {
  const credUrl = [
    "https://",
    lang,
    '.',
    "wikipedia.org/wiki/",
    user
  ].join('');

  const credText = lang + ':' + user;

  const licDir = "http://creativecommons.org/licenses";

  const licUrl = [ licDir, lic, ver, '' ].join("/");

  const licText = [ "CC", lic.toUpperCase(), ver ].join(' ');

  const commons = "https://commons.wikimedia.org/w/index.php?curid=";

  const sources = [];

  for (let fileid, curid, i = 0; i < mediaFileids.length; i++) {
    fileid = mediaFileids[i];
    curid = mediaCurids[i];

    if (i !== 0) {
      sources.push( <span key={'sep' + i}>,&nbsp;</span> );
    }

    sources.push( <a href={commons + curid} key={fileid}>{fileid}</a> );
  }

  return (
    <p>
      <i>Media credit</i>: {content} {sources} by <a href={credUrl}>{credText}</a> - Own work, <a href={licUrl}>{licText}</a>, via Wikimedia Commons
    </p>
  );
}
