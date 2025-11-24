import { createLocale, type Translations } from "./types";

// Swedish translations (initially using English displayNames as fallback)
export const sv: Translations = createLocale({
  rows: {
    ones: "Ettor",
    twos: "Tvåor",
    threes: "Treor",
    fours: "Fyror",
    fives: "Femmor",
    sixes: "Sexor",
    upperTotal: "Total",
    bonus: "Bonus",
    pair: "Par",
    twoPairs: "Två par",
    threeOfAKind: "Triss",
    fourOfAKind: "Fyrtal",
    smallStraight: "Liten stege",
    largeStraight: "Stor stege",
    fullHouse: "Kåk",
    chance: "Chans",
    yatzy: "Yatzy",
    gameTotal: "Total",
  },
  ui: {
    players: "Spelare",
    language: "Språk",
    add: "Lägg till",
    startGame: "Starta spel",
    playerNamePlaceholder: "Spelarens namn",
  },
});

export default sv;
