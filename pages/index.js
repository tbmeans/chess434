import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import Menu from '@components/Menu'
import Square from '@components/Square'

export default function Home() {
  const n = an();
  const h = ch();

  return (
    <div className="container">
      <Head>
        <title>Chess I Guess</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css" />
      </Head>

      <nav className="navbar" role="navigation" aria-label="main navigation">
        <Header title="&nbsp;Chess" />
        <Menu />
      </nav>

      <main className="section">
        <div className="columns">
          <div className="column is-one-half">
            <div className="box board-background">
              <div id="chessboard" className="grid-8-cols woodgrain-theme">
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
                <Square a={n.next().value} c={h.next().value} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )

  function* an() {
    let i = 0;
    while (i < 64) {
      yield "abcdefgh"[i % 8] + (8 - parseInt(i++ / 8));
    }
  }
  
  function* ch() {
    const black = 'rnbqkbnr' + 'p'.repeat(8);
    const white = 'P'.repeat(8) + 'RNBQKBNR';
    const initial = black + '1'.repeat(32) + white;
    let i = 0;
    while (i < 64) {
      yield initial[i++];
    }
  }
}
