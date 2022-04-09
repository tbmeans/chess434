export default function ChessClock(props) {
	return (
		<div className="columns is-mobile" id="chess-clock">
			<div class="column">
				<div class="box" id="white-clock">
					<div class="columns">
						<div class="column clock-color">W</div>
						<div class="column" id="white-time">-:--:--</div>
					</div>
					<div class="column" id="white-notification">
						<div id={props.white.alert}
							className={props.white.status}>
								{props.white.text}
						</div>
					</div>
				</div>
			</div>
			<div class="column">
				<div class="box" id="black-clock">
					<div class="columns">
						<div class="column clock-color">B</div>
						<div class="column" id="black-time">-:--:--</div>
					</div>
					<div class="column" id="black-notification">
						<div id={props.black.alert}
							className={props.black.status}>
								{props.black.text}
						</div>
					</div>
				</div>
        	</div>
		</div>
	);
}