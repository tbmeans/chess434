export default function Header({ title }) {
  return (
    <div id="my-logo" className="navbar-brand">
      <div className="navbar-item">
        <img src="icon.png" />
        <span className="title">{title}</span>
      </div>
      <a role="button" id="chessburger" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="chess-menu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
  )
}
