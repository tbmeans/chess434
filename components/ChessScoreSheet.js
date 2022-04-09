export default function ChessScoreSheet(props) {
	return (
		<div className="box" id="score-sheet">
			<p id="movetext">{props.movetext}</p>
			<p id="captures">{props.captures}</p>
		</div>
	);
}