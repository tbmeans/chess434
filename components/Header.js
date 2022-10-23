import { header, pageTitle, logo, mobile } from './Header.module.css'

export default function Header({ title }) {
  const mobileLogo = [ mobile, logo ].join(' ');
  return (
    <div className={header}>
      <div>
        <img src="icon.png" alt="IC 434" className={logo} />
      </div>
      <div className={pageTitle}>
        <h1>
          {title}
        </h1>
      </div>
      <div>
        <img src="icon.png" alt="IC 434" className={mobileLogo} />
      </div>
    </div>
  );
}
