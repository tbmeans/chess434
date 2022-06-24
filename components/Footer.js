import styles from './Footer.module.css'
import WikimediaCredit from './WikimediaCredit'

export default function Footer({ cred, fnames, params }) {
  return (
    <>
      <footer className={styles.footer}>
        {/* Made with <img src="/netliheart.svg" alt="Netlify Logo" className={styles.logo} /> for you */}
        <p>2022, Tim Means</p>
        <WikimediaCredit
          content={cred.c} lang={cred.l} user={cred.u} lic={cred.i} ver={cred.v}
          mediaFileids={fnames} mediaCurids={params}
        />
      </footer>
    </>
  )
}
