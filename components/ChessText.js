import styles from './ChessText.module.css'

export default function ChessText({ text, bgColor, color }) {
  return (
    <p className={
      (bgColor ? [ styles[bgColor] ] : []).concat(
        color ? [ styles[color] ] : []
      ).join(' ')
    }>{text}</p>
  );
}
