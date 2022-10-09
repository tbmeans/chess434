import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import GameGrid from '@components/GameGrid'

const cred = JSON.stringify({
  content: "Chess vector images",
  lang: "en",
  user: "User:Cburnett",
  lic: 'by-sa',
  ver: '3.0'
});

const fnames = JSON.stringify([
  'kdt', 'klt', 'qdt', 'qlt', 'rdt', 'rlt',
  'bdt', 'blt', 'ndt', 'nlt', 'pdt', 'plt'
]);

const params = JSON.stringify([
  1499803, 1499806, 1499811, 1499812, 1499813, 1499814,
  1499800, 1499801, 1499807, 1499808, 1499809, 1499810
]);

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Chess I guess</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header title="Chess" />

      <GameGrid />

      <Footer cred={cred} fnames={fnames} params={params} />
    </div>
  )
}
