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
- `g/saugu/data.js`: config of the second game, "Saugu ar apgavystė?" (Roblox scams). Its pictures are recreated Roblox screens, so they live only on the Mac in `g/saugu/local/` (gitignored); open `ekranas.html?g=saugu` from the Mac. Start it with: `open "$HOME/PProjects/pamokos-vaikams/Saugu ar apgavystė ekranas.command"` (starts the local server on :8847 and opens Chrome).
- `data.js`: two rounds (max 20 each) with answers, explanations and credits, generated from the teacher's picks by `pamokos-vaikams/tikra-ar-ai-select/build_game.py` (not in this repo). Media is from Wikimedia Commons plus one OpenAI Sora sample; credits are on the end screen.

## Mokomės ir Saugiai internete (2026-10)

Written directly in the repo, not built by build.sh:
- Daugybos kasykla: Ore Rush engine, catch the block with the right product, pick the tables.
- Miesto žemėlapis: courier with compass moves (Š, P, R, V), map scale and legend, 15 levels (par verified by BFS).
- Paieškos detektyvas: simulated search engine, 12 cases (search words, ads, find in page, two sources).
- Spąstų medžioklė: safe or trap cards (fake download buttons, prizes, phishing), 10 rounds, generic names only.
- Slaptas šifras: Caesar cipher wheel and pigpen-style symbols, 12 missions (every ciphertext checked).

## Robotų ringas (2026-10)

A programming fighting game in `robotu-ringas/`, written directly in the repo (not built by build.sh).

- `index.html`: the tablet. Build a robot (name, color, one trait), write up to 5 JEI/TAI rules, test them in Sparingas, climb the 4-robot computer ladder, or join the class ring with the screen's code.
- `ekranas.html`: the class screen on the Mac. Code + QR, round-robin tournament, side-view fights (best of 3, 20 s rounds) and a 45 s Pataisymas pause between rounds where both fighters fix their rules. Space = next. Only the screen runs the fight; fighter tablets light up their rules live from the screen's ticks.
- `engine.js`: the fight rules (tick 0.5 s, 1-tick wind-up so "Priešas puola" can be countered). Deterministic per match and round. Balance: no sample robot beats all others.
- `net.js`: the tikra-ar-ai transport with its own topic. Tablets send their robot and "paruošta" tagged with match id + round, so old messages can't leak into a new round or tournament.
- Test switches: `?fast=1` (8x fight speed, both pages), `ekranas.html?fix=N` (pause length), `?new=1` (fresh code).

