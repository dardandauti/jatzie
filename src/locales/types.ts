import { rows } from "../consts";

export type RowKey = (typeof rows)[number];

export type Translations = {
  rows: Record<RowKey, string>;
  ui: {
    players: string;
    language: string;
    add: string;
    startGame: string;
    playerNamePlaceholder: string;
  };
};

export function createLocale<T extends Translations>(t: T): T {
  return t;
}
