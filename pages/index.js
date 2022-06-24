import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

const cred = {
  c: "Chess vector images",
  l: "en",
  u: "User:Cburnett",
  i: 'by-sa',
  v: '3.0'
};

const fnames = [ 'kdt', 'klt', 'qdt', 'qlt', 'rdt', 'rlt',
'bdt', 'blt', 'ndt', 'nlt', 'pdt', 'plt' ];

const params = [ 1499803, 1499806, 1499811, 1499812, 1499813, 1499814,
1499800, 1499801, 1499807, 1499808, 1499809, 1499810 ];

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Chess I guess</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* // Not using Next.js template default main tag
      <main>
        <Header title="Welcome to my app!" />
        <p className="description">
          Get started by editing <code>pages/index.js</code>
        </p>
      </main>
      */}

      <Footer cred={cred} fnames={fnames} params={params} />
    </div>
  )
}
