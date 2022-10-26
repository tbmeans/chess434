import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import uiData from 'chess434-ui-data/uiData'
import GameGrid from '@components/GameGrid'

const hamburger = (
  <svg height="5em" width="6em" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="30" x2="60" y2="30" stroke="black" strokeWidth="3" />
    <line x1="30" y1="40" x2="60" y2="40" stroke="black" strokeWidth="3" />
    <line x1="30" y1="50" x2="60" y2="50" stroke="black" strokeWidth="3" />
  </svg>
);

const closeButton = (
  <svg height="5em" width="6em" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="30" x2="60" y2="60" stroke="black" strokeWidth="3" />
    <line x1="60" y1="30" x2="30" y2="60" stroke="black" strokeWidth="3" />
  </svg>
);

const {
  menu,
  isLeaf,
  getNodeValue,
  parseTC,
  indexOfPawnPromotion,
  cred,
  fnames,
  params
 } = uiData;

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Chess I guess</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header title="Chess" />

      <GameGrid
        closeButton={closeButton}
        hamburger={hamburger}
        menu={menu}
        isLeaf={isLeaf}
        getNodeValue={getNodeValue}
        parseTC={parseTC}
        proIdx={indexOfPawnPromotion}
      />

      <Footer cred={cred} fnames={fnames} params={params} />
    </div>
  )
}
