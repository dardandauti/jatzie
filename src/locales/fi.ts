import { createLocale, type Translations } from "./types";

// Finnish translations
export const fi: Translations = createLocale({
  rows: {
    ones: "Ykköset",
    twos: "Kakkoset",
    threes: "Kolmoset",
    fours: "Neloset",
    fives: "Vitoset",
    sixes: "Kutokset",
    upperTotal: "Yhteensä",
    bonus: "Bonus",
    pair: "Pari",
    twoPairs: "Kaksi paria",
    threeOfAKind: "Kolmoset",
    fourOfAKind: "Neloset",
    smallStraight: "Pieni suora",
    largeStraight: "Suuri suora",
    fullHouse: "Täyskäsi",
    chance: "Sattuma",
    yatzy: "Yatzy",
    gameTotal: "Yhteensä",
  },
  ui: {
    players: "Pelaajat",
    language: "Kieli",
    add: "Lisätä",
    startGame: "Aloita peli",
    playerNamePlaceholder: "Pelaajan nimi",
  },
});

export default fi;
