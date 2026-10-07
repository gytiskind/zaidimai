# Žaidimai

Small browser games for kids, playable on tablets and computers.

- Unicorn Star Catch: catch falling stars.
- Ore Rush: catch ore blocks, dodge TNT.
- Key Siege: a typing game in Lithuanian and English.
- Piešk, AI spės!: a Lithuanian Quick, Draw!. Kids draw a word with a finger, DoodleNet (ml5, runs in the browser with TensorFlow.js) guesses. 30/60/90 s per word, plus free drawing.

Live at https://gytiskind.github.io/zaidimai/

## Tikra ar AI?

A class game in `tikra-ar-ai/`, written directly in the repo (not built by build.sh).

- `ekranas.html`: the teacher screen on the Mac. Shows a join code, the pictures and videos, and the answers. Space = next.
- `index.html`: the tablet page. Join with the code, then tap TIKRA or AI.
- Screen and tablets talk through two public MQTT brokers (`net.js`), so no server is needed.
- `g/saugu/data.js`: config of the second game, "Saugu ar apgavystė?" (Roblox scams). Its pictures are recreated Roblox screens, so they live only on the Mac in `g/saugu/local/` (gitignored); open `ekranas.html?g=saugu` from the Mac.
- `data.js`: two rounds (max 20 each) with answers, explanations and credits, generated from the teacher's picks by `pamokos-vaikams/tikra-ar-ai-select/build_game.py` (not in this repo). Media is from Wikimedia Commons plus one OpenAI Sora sample; credits are on the end screen.

## Mokomės ir Saugiai internete (2026-10)

Written directly in the repo, not built by build.sh:
- Daugybos kasykla: Ore Rush engine, catch the block with the right product, pick the tables.
- Miesto žemėlapis: courier with compass moves (Š, P, R, V), map scale and legend, 15 levels (par verified by BFS).
- Paieškos detektyvas: simulated search engine, 12 cases (search words, ads, find in page, two sources).
- Spąstų medžioklė: safe or trap cards (fake download buttons, prizes, phishing), 10 rounds, generic names only.
- Slaptas šifras: Caesar cipher wheel and pigpen-style symbols, 12 missions (every ciphertext checked).
