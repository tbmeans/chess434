export default function ChessMenu() {
	return (
	  <div id="chess-menu" className="navbar-menu">
		<div className="navbar-start">
		  <div className="navbar-item">
			<div className="buttons">
			  <div id="side-select" className="navbar-item">
				<a className="navbar-link">Play both sides</a>
			  </div>
			  <a id="start" className="button is-primary" title="Start game">START</a>
			  <a id="resign" className="button is-primary" title="Resign from game" disabled>RESIGN</a>
			</div>
		  </div>
		</div>
		<div className="navbar-end">
		  <div id="tc-select" className="navbar-item"></div>
		  <div id="promotion-choices" className="navbar-item"></div>
		</div>
	  </div>
	)
}