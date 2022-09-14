import { header, pageTitle, logo, mobile } from './Header.module.css'

export default function Header({ title }) {
  {/* return <h1 className="title">{title}</h1> */}
  return (
    <div className={header}>
      <div><img src="icon.png" className={logo} /></div>
      <div className={pageTitle}><h1>{title}</h1></div>
      <div><img src="icon.png" className={[mobile, logo].join(' ')} /></div>
    </div>
  );
}
