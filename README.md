# Memory Card Game

A clean, responsive memory matching game built with HTML, CSS & JavaScript.

## Features

- Three difficulty levels: Easy (4×4), Medium (6×6), Hard (8×8)
- Timer, move counter & dynamic scoring with time/move bonuses
- Persistent best times per difficulty in localStorage
- Sound toggle with Web Audio API feedback (flip/match/win tones)
- Win modal with final stats and option to play again
- Stylish animations and responsive layout

## How to Run

1. Clone or download the repo.
2. Open `index.html` in your browser.
3. Click **New Game**, select difficulty, and start matching!

## How It Works

- On difficulty selection or "New Game", the app selects a number of emoji pairs, shuffles them, and builds the card grid.
- Click to flip cards; if two match, they stay visible and score is awarded. Otherwise, they flip back.
- Timer starts on the first flip. Moves and score update live.
- On completing all pairs, a modal shows your final time, moves, and score. If it's your best time for that level, it's saved in localStorage.

## Customization Tips

- Swap emojis by editing the `symbols` array in `script.js`.
- Adjust timing, grid size or scoring logic in class constructor or methods.
- Styling is in `styles.css` — tweak colors, gradients, fonts or card styles as needed.

## License

MIT License
