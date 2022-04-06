export default function Square(o) {
	return <div id={o.a} className={color(o.a)}>{label(o.a)}{image(o.c)}</div>;

	function color(an) {
		const x = 'abcdefgh'.indexOf(an[0]);
		const y = an[1] - 1;
		return (x + y) % 2 === 1 ? "lite" : "dark";
	}
	function label(an) {
		const file = an[0];
		const rank = an[1];
		const darkLeftEdge = file === 'a' && rank % 2 == 0;
		const darkBottomEdge = rank == 1 && 'bdfh'.includes(file);
		const labelOnDark = darkLeftEdge || darkBottomEdge ? "" : " on-dark";
		const value = "rank-and-or-file-label" + labelOnDark;
		if (file === 'a' && rank != 1) {
			return <span className={value}>&nbsp;{rank}</span>;
		}
		if (an === 'a1') {
			return <span className={value}>&nbsp;{an}</span>;
		}
		if (rank == 1 && file !== 'a') {
			return <span className={value}>&nbsp;{file}</span>;
		}
	}
	function image(ch) {
		if (ch == 1) {
			return;
		}
		const commons = "https://upload.wikimedia.org/wikipedia/commons/";
		const path2levels = {
			k: 'f/f0/',
			K: '4/42/',
			q: '4/47/',
			Q: '1/15/',
			r: 'f/ff/',
			R: '7/72/',
			b: '9/98/',
			B: 'b/b1/',
			n: 'e/ef/',
			N: '7/70/',
			p: 'c/c7/',
			P: '4/45/'
		};
		const fname1 = "Chess_";
		const fname2 = "t45.svg";
		const piece = {
			b: 'bishop',
			k: 'king',
			n: 'knight',
			p: 'pawn',
			q: 'queen',
			r: 'rook'
		};
		const c = ch.toLowerCase();
		let fileid,
			fullpath;
		if (c === ch) {
			fileid = c + 'd';
		} else {
			fileid = c + 'l';
		}
		fullpath = commons + path2levels[ch] + fname1 + fileid + fname2;

		return <img src={fullpath} title={piece[c]} />;
	}
}
