import { createLocale, type Translations } from "./types";

// Albanian translations
export const sq: Translations = createLocale({
  rows: {
    ones: "Njësat",
    twos: "Dyset",
    threes: "Tret",
    fours: "Katër",
    fives: "Pesë",
    sixes: "Gjashtë",
    upperTotal: "Totali",
    bonus: "Bonusi",
    pair: "Çift",
    twoPairs: "Dy çifte",
    threeOfAKind: "Tre të njëjtë",
    fourOfAKind: "Katër të njëjtë",
    smallStraight: "Radhë e vogël",
    largeStraight: "Radhë e madhe",
    fullHouse: "Shtëpi e plotë",
    chance: "Shans",
    yatzy: "Yatzy",
    gameTotal: "Totali",
  },
  ui: {
    players: "Lojtarët",
    language: "Gjuha",
    add: "Shtoj",
    startGame: "Fillo lojën",
    playerNamePlaceholder: "Emri i lojtarit",
  },
});

export default sq;
