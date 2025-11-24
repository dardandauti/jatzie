import { createLocale, type Translations } from "./types";

// Japanese translations
export const ja: Translations = createLocale({
  rows: {
    ones: "1の目",
    twos: "2の目",
    threes: "3の目",
    fours: "4の目",
    fives: "5の目",
    sixes: "6の目",
    upperTotal: "合計",
    bonus: "ボーナス",
    pair: "ワンペア",
    twoPairs: "ツーペア",
    threeOfAKind: "スリーカード",
    fourOfAKind: "フォーカード",
    smallStraight: "小ストレート",
    largeStraight: "大ストレート",
    fullHouse: "フルハウス",
    chance: "チャンス",
    yatzy: "ヤッツィー",
    gameTotal: "合計",
  },
  ui: {
    players: "プレイヤー",
    language: "言語",
    add: "追加",
    startGame: "ゲームを開始",
    playerNamePlaceholder: "プレイヤー名",
  },
});

export default ja;
