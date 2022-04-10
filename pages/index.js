import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import ChessMenu from '@components/ChessMenu'
import ChessSquare from '@components/ChessSquare'
import ChessClock from '@components/ChessClock'
import ChessScoreSheet from '@components/ChessScoreSheet'

export default function Home() {
  const n = an();
  const h = ch(
    'rnbqkbnr' + 'p'.repeat(8) + 
    '1'.repeat(32) + 
    'P'.repeat(8) + 'RNBQKBNR'
  );
  const placement = [];
  const SANTokens = [];
  let chessboard;
  let symbols = '';
  let moveSAN = '';
  let gameStatus = {
    plyCount: 0,
    check: false,
    mate: false,
    draw: false,
    reasonWhite: '',
    reasonBlack: ''
  };
  let { whiteNote, blackNote } = turnNotes(gameStatus); 

  for (let i = 0; i < 64; i++) {
    placement[i] = { sq: n.next().value, pc: h.next().value };
  }
  chessboard = placement.map( p => <ChessSquare a={p.sq} c={p.pc} /> );

  return (
    <div className="container">
      <Head>
        <title>Chess I Guess</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="navbar" role="navigation" aria-label="main navigation">
        <Header title="&nbsp;Chess" />
        <ChessMenu />
      </nav>

      <main>
        <div className="columns" id="game-panel">
          <div className="column is-one-half">
            <div className="box board-background">
              <div id="chessboard" className="grid-8-cols woodgrain-theme">
                {chessboard}
              </div>
            </div>
          </div>
          <div className="column is-one-half">
            <ChessClock
              white={whiteNote}
              black={blackNote}
            />
            <ChessScoreSheet 
              movetext={SANTokens.join(' ')} 
              captures={symbols} 
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );

  function* an() {
    let i = 0;
    while (i < 64) {
      yield "abcdefgh"[i % 8] + (8 - parseInt(i++ / 8));
    }
  }
  
  function* ch(pieceGridSequence) {
    let i = 0;
    while (i < 64) {
      yield pieceGridSequence[i++];
    }
  }

  function turnNotes(gameStatus) {
    const { plyCount, check, mate, draw,
      reasonWhite, reasonBlack } = gameStatus;
    const note = {
      alert: '',
      status: '',
      text: ''
    };
    const whiteNote = Object.create(note);
    const blackNote = Object.create(note);

    if (plyCount % 2 === 0 && plyCount === 0) {
      whiteNote.alert = "green-note";
      whiteNote.status = "notification is-success";
      whiteNote.text = "Has the move";
      blackNote.alert = "hide-text-on-is-danger";
      blackNote.status = "notification is-danger";
      blackNote.text = "Made move";
    } else if (plyCount % 2 === 0 && check === false) {
      whiteNote.alert = "green-note";
      whiteNote.status = "notification is-success";
      whiteNote.text = "Has the move";
      blackNote.alert = "red-note";
      blackNote.status = "notification is-danger";
      blackNote.text = "Made move";
    } else if (plyCount % 2 === 1 && check === false) {
      blackNote.alert = "green-note";
      blackNote.status = "notification is-success";
      blackNote.text = "Has the move";
      whiteNote.alert = "red-note";
      whiteNote.status = "notification is-danger";
      whiteNote.text = "Made move";
    } else if (plyCount % 2 === 0 && check) {
      whiteNote.alert = "yellow-note";
      whiteNote.status = "notification is-warning";
      whiteNote.text = "In check";
      blackNote.alert = "red-note";
      blackNote.status = "notification is-danger";
      blackNote.text = "Made move";
    } else if (plyCount % 2 === 1 && check) {
      blackNote.alert = "yellow-note";
      blackNote.status = "notification is-warning";
      blackNote.text = "In check";
      blackNote.alert = "red-note";
      blackNote.status = "notification is-danger";
      blackNote.text = "Made move";
    }
    // mate and draw logic here, don't chain it with plycount and check just for brevity's sake
    // maybe start it with if check ?
    return { whiteNote, blackNote };
  }
}
