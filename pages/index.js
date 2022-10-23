import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import ChessGame from '@components/ChessGame'

const url = "http://www.w3.org/2000/svg";

const hamburger = (
  <svg id="burger-icon" height="5em" width="6em" xmlns={url}>
    <line x1="30" y1="30" x2="60" y2="30" stroke="black" strokeWidth="3" />
    <line x1="30" y1="40" x2="60" y2="40" stroke="black" strokeWidth="3" />
    <line x1="30" y1="50" x2="60" y2="50" stroke="black" strokeWidth="3" />
  </svg>
);

const closeButton = (
  <svg id="burger-icon" height="5em" width="6em" xmlns={url}>
    <line x1="30" y1="30" x2="60" y2="60" stroke="black" strokeWidth="3" />
    <line x1="60" y1="30" x2="30" y2="60" stroke="black" strokeWidth="3" />
  </svg>
);

const menu = JSON.stringify({
  "Board theme": {
    Woodgrain: "woodgrain",
    "Green-and-buff": "greenbuff"
  },
  "Pawn Promotion": {
    Queen: 'q',
    Rook: 'r',
    Bishop: 'b',
    Knight: 'n'
  },
  Opponent: {
    "Vs self": -1,
    "Vs CPU black": 1,
    "Vs CPU white": 0
  },
  "Time control": {
    untimed: "-",
    "G/30": "1800",
    "G/60": "3600",
    "G/90+30": "5400+30",
    "40/90+30, SD/30+30": "40/5400+30:1800+30",
    "40/100+30, 20/50+30, SD/15+30": "40/6000+30:20/3000+30:900+30",
    "40/120, ...": {
      "SD/30": "40/7200:1800",
      "SD/60": "40/7200:3600",
      "20/60, SD/30": "40/7200:20/3600:1800",
      "20/60, SD/15+30": "40/7200:20/3600:900+30"
    },
    Rapid: {
      "G/15+10": "900+10",
      "G/15+5": "900+5",
      "G/25+10": "1500+10",
      "G/25": "1500"
    },
    Blitz: {
      "G/3+2": "180+2",
      "G/5": "300",
      "G/5+3": "300+3"
    }
  }
});

const isLeaf = s => {
  return (
    s.length === 3 ||
    s.length === 2 &&
    (s[0] < 3 || s[1] < 6)
  );
};

const indexOfPawnPromotion = (
  Object.keys( JSON.parse(menu) ).indexOf("Pawn Promotion")
);

const backgroundColor = JSON.stringify({
  "Has move": "onGreen",
  "check": "onYellow",
  "checkmate": "onRed",
  "Made move": "onRed"
});

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

      <ChessGame
        closeButton={closeButton}
        hamburger={hamburger}
        menu={menu}
        isLeaf={isLeaf}
        proIdx={indexOfPawnPromotion}
        bgColor={backgroundColor}
      />

      <Footer cred={cred} fnames={fnames} params={params} />
    </div>
  )
}
