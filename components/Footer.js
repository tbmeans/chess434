import styles from './Footer.module.css'
import WikimediaCredit from './WikimediaCredit'

export default function Footer({ cred, fnames, params }) {
  const { content, lang, user, lic, ver } = JSON.parse(cred);
  const fileids = JSON.parse(fnames);
  const curids = JSON.parse(params);
  return (
    <>
      <footer className={styles.footer}>
        <p>
          2022, Tim Means
        </p>
        <WikimediaCredit
          content={content}
          lang={lang}
          user={user}
          lic={lic}
          ver={ver}
          mediaFileids={fileids}
          mediaCurids={curids}
        />
      </footer>
    </>
  )
}
