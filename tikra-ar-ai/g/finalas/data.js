// "Didysis finalas": the 17-question finale of the club (concept scenes, Tikra ar AI picks, Saugu picks).
// Public file: concept scenes and Tikra ar AI picks with public media. The Saugu picks are in local/local.js (Mac only).
// Built by pamokos-vaikams/finalas/build.py
window.GAME = {
 "id": "didysis-finalas",
 "title": "Didysis finalas",
 "a": {
  "key": "a",
  "word": "A",
  "sub": "",
  "color": "#3a8ee0",
  "ink": "#ffffff"
 },
 "b": {
  "key": "b",
  "word": "B",
  "sub": "",
  "color": "#f5a623",
  "ink": "#2a1800"
 },
 "sections": {
  "kam": {
   "title": "Ką išmokom?",
   "a": {
    "key": "a",
    "word": "A",
    "sub": "",
    "color": "#3a8ee0",
    "ink": "#ffffff"
   },
   "b": {
    "key": "b",
    "word": "B",
    "sub": "",
    "color": "#f5a623",
    "ink": "#2a1800"
   }
  },
  "ai": {
   "title": "Tikra ar AI?",
   "a": {
    "key": "real",
    "word": "TIKRA",
    "sub": "📷 tikras vaizdas",
    "color": "#7ee04f",
    "ink": "#10300a"
   },
   "b": {
    "key": "ai",
    "word": "AI",
    "sub": "🤖 sukūrė kompiuteris",
    "color": "#c04ff0",
    "ink": "#ffffff"
   }
  },
  "saugu": {
   "title": "Saugu ar apgavystė?",
   "a": {
    "key": "safe",
    "word": "SAUGU",
    "sub": "✅ galima",
    "color": "#5cbf3a",
    "ink": "#0e2a07"
   },
   "b": {
    "key": "scam",
    "word": "APGAVYSTĖ",
    "sub": "🚫 neliesk!",
    "color": "#e0402e",
    "ink": "#ffffff"
   }
  }
 },
 "verdicts": [
  "Tikri būrelio čempionai! Viską žinot.",
  "Puikiai! Beveik viską prisiminėt.",
  "Gerai pasistengėt. Kitą kartą bus dar geriau!"
 ],
 "offlineEnd": "Šiandien daug išmokom: algoritmus, klaidas, ciklus, AI ir saugų internetą.",
 "creditTag": {
  "ai": " (sukurta AI)"
 },
 "creditsNote": "Klausimų paveikslėlius nupiešė būrelio vadovas. Kiti vaizdai iš Tikra ar AI? ir Saugu ar apgavystė? žaidimų.",
 "fullNote": "✓ Mac versija: visi 17 klausimų",
 "publicNote": "Viešoji versija: be Saugu ar apgavystė klausimų ir naujausių AI klipų. Pilnai: paleisk \"Didysis finalas ekranas\" Mac'e."
};
window.ROUNDS = [[
 {
  "file": "media/k1-algoritmas.png",
  "answer": "a",
  "kind": "image",
  "tell_lt": "Nepavyks! Robotas pirma valgo, o duonos dar nėra. Algoritmas yra žingsniai teisinga tvarka.",
  "author": "Kompiuterių būrelis",
  "license": "own",
  "license_url": "",
  "source_url": "",
  "generator": "",
  "note": "",
  "has_audio": false,
  "sec": "kam",
  "q": "Robotas daro sumuštinį pagal šiuos žingsnius. Pavyks?",
  "a": {
   "key": "a",
   "word": "NEPAVYKS",
   "sub": "❌",
   "color": "#3a8ee0",
   "ink": "#ffffff"
  },
  "b": {
   "key": "b",
   "word": "PAVYKS",
   "sub": "✅",
   "color": "#f5a623",
   "ink": "#2a1800"
  }
 },
 {
  "file": "media/k2-klaida.png",
  "answer": "b",
  "kind": "image",
  "tell_lt": "Klaida! Trečias žingsnis veda į sieną. Rasti ir pataisyti klaidą yra programuotojo darbas.",
  "author": "Kompiuterių būrelis",
  "license": "own",
  "license_url": "",
  "source_url": "",
  "generator": "",
  "note": "",
  "has_audio": false,
  "sec": "kam",
  "q": "Ar robotas pasieks žvaigždę?",
  "a": {
   "key": "a",
   "word": "PASIEKS",
   "sub": "⭐",
   "color": "#3a8ee0",
   "ink": "#ffffff"
  },
  "b": {
   "key": "b",
   "word": "KLAIDA",
   "sub": "🐞",
   "color": "#f5a623",
   "ink": "#2a1800"
  }
 },
 {
  "file": "media/k3-ciklas.png",
  "answer": "a",
  "kind": "image",
  "tell_lt": "Taip! Ciklas kartoja tą patį. Trumpiau parašyta, o rezultatas tas pats.",
  "author": "Kompiuterių būrelis",
  "license": "own",
  "license_url": "",
  "source_url": "",
  "generator": "",
  "note": "",
  "has_audio": false,
  "sec": "kam",
  "q": "Ar abi programos nuves robotą į tą pačią vietą?",
  "a": {
   "key": "a",
   "word": "TAIP",
   "sub": "👍",
   "color": "#3a8ee0",
   "ink": "#ffffff"
  },
  "b": {
   "key": "b",
   "word": "NE",
   "sub": "👎",
   "color": "#f5a623",
   "ink": "#2a1800"
  }
 },
 {
  "file": "media/k4-salyga.png",
  "answer": "b",
  "kind": "image",
  "tell_lt": "Į „Visa kita“! Sąlyga: JEI obuolys, tai į pirmą dėžę. Visa kita važiuoja toliau.",
  "author": "Kompiuterių būrelis",
  "license": "own",
  "license_url": "",
  "source_url": "",
  "generator": "",
  "note": "",
  "has_audio": false,
  "sec": "kam",
  "q": "Kur nukeliaus bananas?",
  "a": {
   "key": "a",
   "word": "🍎 DĖŽĖ",
   "sub": "pirmi vartai",
   "color": "#3a8ee0",
   "ink": "#ffffff"
  },
  "b": {
   "key": "b",
   "word": "VISA KITA",
   "sub": "galas",
   "color": "#f5a623",
   "ink": "#2a1800"
  }
 },
 {
  "file": "media/k5-kintamasis.png",
  "answer": "a",
  "kind": "image",
  "tell_lt": "Penki! Taškai yra kintamasis: skaičius, kuris keičiasi žaidimo metu.",
  "author": "Kompiuterių būrelis",
  "license": "own",
  "license_url": "",
  "source_url": "",
  "generator": "",
  "note": "",
  "has_audio": false,
  "sec": "kam",
  "q": "Kiek taškų dabar?",
  "a": {
   "key": "a",
   "word": "5",
   "sub": "taškai",
   "color": "#3a8ee0",
   "ink": "#ffffff"
  },
  "b": {
   "key": "b",
   "word": "3",
   "sub": "taškai",
   "color": "#f5a623",
   "ink": "#2a1800"
  }
 },
 {
  "file": "media/k6-mokinys.png",
  "answer": "a",
  "kind": "image",
  "tell_lt": "Tingiai! AI mokosi iš pavyzdžių. Koks mokytojas, toks ir mokinys.",
  "author": "Kompiuterių būrelis",
  "license": "own",
  "license_url": "",
  "source_url": "",
  "generator": "",
  "note": "",
  "has_audio": false,
  "sec": "kam",
  "q": "Mokytojas žaidė tingiai ir stovėjo vietoje. Kaip žais robotas?",
  "a": {
   "key": "a",
   "word": "TINGIAI",
   "sub": "😴",
   "color": "#3a8ee0",
   "ink": "#ffffff"
  },
  "b": {
   "key": "b",
   "word": "GERAI",
   "sub": "🏃",
   "color": "#f5a623",
   "ink": "#2a1800"
  }
 },
 {
  "file": "media/k7-saltiniai.png",
  "answer": "b",
  "kind": "image",
  "tell_lt": "Patikrinu! Geras detektyvas visada randa antrą šaltinį.",
  "author": "Kompiuterių būrelis",
  "license": "own",
  "license_url": "",
  "source_url": "",
  "generator": "",
  "note": "",
  "has_audio": false,
  "sec": "kam",
  "q": "Radai vieną puslapį. Ką darai?",
  "a": {
   "key": "a",
   "word": "TIKIU",
   "sub": "👍",
   "color": "#3a8ee0",
   "ink": "#ffffff"
  },
  "b": {
   "key": "b",
   "word": "PATIKRINU",
   "sub": "🔍",
   "color": "#f5a623",
   "ink": "#2a1800"
  }
 },
 {
  "file": "../../media/v2-01-sesi-pirstai.jpg",
  "answer": "ai",
  "kind": "image",
  "tell_lt": "Suskaičiuok pirštus: jų šeši! Dirbtinis intelektas dažnai klysta piešdamas rankas.",
  "author": "Stable Diffusion 1.5, prompted by Corvus",
  "license": "Public domain",
  "license_url": "",
  "source_url": "https://commons.wikimedia.org/wiki/File:AI_generated_hand.png",
  "generator": "Stable Diffusion 1.5",
  "note": "Kept from v1 (item 01).",
  "has_audio": "",
  "sec": "ai"
 },
 {
  "file": "../../media/v2-02-suo-futbolininkas.jpg",
  "answer": "real",
  "kind": "image",
  "tell_lt": "Tikra! Šis šuo Stambule atbėgo į futbolo aikštę ir pats varinėjo kamuolį. Gal jį pakvies į rinktinę?",
  "author": "CeeGee",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0",
  "source_url": "https://commons.wikimedia.org/wiki/File:FootballerDog_(2).jpg",
  "generator": "",
  "note": "Nikon D5100 EXIF 2018-01-07. Fatih Mimar Sinan Stadium, Istanbul.",
  "has_audio": "",
  "sec": "ai"
 },
 {
  "file": "../../media/v2-03-mamutai.mp4",
  "answer": "ai",
  "kind": "video",
  "tell_lt": "Mamutai išnyko prieš tūkstančius metų. Niekas negalėjo jų nufilmuoti.",
  "author": "Sora / OpenAI",
  "license": "Public domain",
  "license_url": "",
  "source_url": "https://commons.wikimedia.org/wiki/File:Wooly_Mammoth_by_OpenAI_Sora.webm",
  "generator": "OpenAI Sora (2024)",
  "note": "Original from openai.com/sora (Feb 2024). Edges cropped slightly. Kept from v1 (item 04).",
  "has_audio": "",
  "sec": "ai"
 },
 {
  "file": "../../media/v2-14-bezdziones-pirtyje.mp4",
  "answer": "real",
  "kind": "video",
  "tell_lt": "Tikra! Japonijoje beždžionės žiemą maudosi karštose versmėse, kad sušiltų. Tikras beždžionių SPA!",
  "author": "Nesnad",
  "license": "CC BY-SA 3.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/3.0",
  "source_url": "https://commons.wikimedia.org/wiki/File:Jigokudani_Monkey_Park_-_hotsprings.ogv",
  "generator": "",
  "note": "Original is 4.97 s; slowed to 0.9x speed (5.5 s) to meet the 5 s minimum.",
  "has_audio": "",
  "sec": "ai"
 },
 {
  "file": "../../media/v2-07-dailiaciuoze-su-kate.mp4",
  "answer": "ai",
  "kind": "video",
  "tell_lt": "Perskaityk reklamas ant bortelio: raidės sumaišytos į košę. O kokia katė leistųsi vežiojama ant galvos per šuolį?",
  "author": "Sora 2 / OpenAI",
  "license": "Public domain",
  "license_url": "",
  "source_url": "https://commons.wikimedia.org/wiki/File:OpenAI_-_This_is_Sora_2.webm",
  "generator": "OpenAI Sora 2 (2025)",
  "note": "Cut 2.95-12.75 s from the Sora 2 launch compilation. Prompt: 'figure skater performs a triple axle with a cat on her head'.",
  "has_audio": "",
  "sec": "ai"
 }
]];
