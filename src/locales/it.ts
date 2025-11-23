import { createLocale, type Translations } from "./types";

// Italian translations
export const it: Translations = createLocale({
  rows: {
    ones: "Assi",
    twos: "Due",
    threes: "Tre",
    fours: "Quattro",
    fives: "Cinque",
    sixes: "Sei",
    upperTotal: "Totale",
    bonus: "Bonus",
    pair: "Coppia",
    twoPairs: "Due coppie",
    threeOfAKind: "Tris",
    fourOfAKind: "Poker",
    smallStraight: "Scala piccola",
    largeStraight: "Scala grande",
    fullHouse: "Full",
    chance: "Chance",
    yatzy: "Yatzy",
    gameTotal: "Totale",
  },
  ui: {
    players: "Giocatori",
    language: "Lingua",
  },
});

export default it;
