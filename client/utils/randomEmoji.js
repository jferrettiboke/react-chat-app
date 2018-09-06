export default function randomEmoji() {
  const emoji = ["😎", "🤩", "😍", "🤓"];
  const index = Math.floor(Math.random() * emoji.length);

  return emoji[index];
}
