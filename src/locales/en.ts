import { createLocale, type Translations } from "./types";

export const en: Translations = createLocale({
  rows: {
    ones: "Ones",
    twos: "Twos",
    threes: "Threes",
    fours: "Fours",
    fives: "Fives",
    sixes: "Sixes",
    upperTotal: "Total",
    bonus: "Bonus",
    pair: "Pair",
    twoPairs: "Two Pairs",
    threeOfAKind: "Three of a Kind",
    fourOfAKind: "Four of a Kind",
    smallStraight: "Small Straight",
    largeStraight: "Large Straight",
    fullHouse: "Full House",
    chance: "Chance",
    yatzy: "Yatzy",
    gameTotal: "Total",
  },
  ui: {
    players: "Players",
    language: "Language",
  },
});

export default en;
