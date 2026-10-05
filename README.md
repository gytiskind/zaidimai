# Žaidimai

Small browser games for kids, playable on tablets and computers.

- Unicorn Star Catch: catch falling stars.
- Ore Rush: catch ore blocks, dodge TNT.
- Key Siege: a typing game in Lithuanian and English.

Live at https://gytiskind.github.io/zaidimai/

## Tikra ar AI?

A class game in `tikra-ar-ai/`, written directly in the repo (not built by build.sh).

- `ekranas.html`: the teacher screen on the Mac. Shows a join code, the pictures and videos, and the answers. Space = next.
- `index.html`: the tablet page. Join with the code, then tap TIKRA or AI.
- Screen and tablets talk through two public MQTT brokers (`net.js`), so no server is needed.
- `data.js`: two rounds (max 20 each) with answers, explanations and credits, generated from the teacher's picks by `pamokos-vaikams/tikra-ar-ai-select/build_game.py` (not in this repo). All media is from Wikimedia Commons; credits are on the end screen.
