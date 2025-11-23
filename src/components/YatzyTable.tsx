import { useReducer } from "react";
import "../index.css";
import { rows, nonEditableCells, maxScoresPerRow } from "../consts";

const YatzyTable = ({ players }: { players: string[] }) => {
  type PlayerRecord = Record<string, number | null>;
  type State = Record<string, PlayerRecord>;

  type Action =
    | { type: "SET_CELL"; player: string; row: string; value: number | null }
    | { type: "BULK_SET"; player: string; changes: Partial<PlayerRecord> }
    | { type: "LOAD_STATE"; state: State }
    | { type: "RESET_PLAYER"; player: string };

  const DERIVED_KEYS = new Set(["upperTotal", "bonus", "gameTotal"]);
  const UPPER_KEYS = rows.slice(0, 6);

  const makeInitialState = (players: string[]): State => {
    return players.reduce((acc, player) => {
      acc[player] = rows.reduce((rowAcc, row) => {
        rowAcc[row] = null;
        return rowAcc;
      }, {} as PlayerRecord);
      return acc;
    }, {} as State);
  };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "SET_CELL": {
        const { player, row, value } = action;
        const sanitized: number | null =
          value === null ? null : Number.isFinite(value) ? value : 0;
        const newState: State = { ...state };
        const prevPlayer = state[player] ?? {};
        const newPlayer: PlayerRecord = { ...prevPlayer };
        newPlayer[row] = sanitized;

        // recompute upper total and bonus (treat null as 0)
        const upperSum = UPPER_KEYS.reduce(
          (acc, key) => acc + (Number(newPlayer[key]) || 0),
          0
        );
        newPlayer["upperTotal"] = upperSum;
        newPlayer["bonus"] = upperSum >= 63 ? 50 : 0;

        // recompute game total (sum of base scoring rows only - exclude derived rows), include bonus
        const baseKeys = rows.filter((k) => !DERIVED_KEYS.has(k));
        const bonusVal = Number(newPlayer["bonus"]) || 0;
        const gameSum =
          baseKeys.reduce(
            (acc, key) => acc + (Number(newPlayer[key]) || 0),
            0
          ) + bonusVal;
        newPlayer["gameTotal"] = gameSum;

        newState[player] = newPlayer;
        return newState;
      }
      case "BULK_SET": {
        const { player, changes } = action;
        const newState: State = { ...state };
        const prevPlayer = state[player] ?? {};
        const newPlayer: PlayerRecord = {
          ...prevPlayer,
          ...(changes as PlayerRecord),
        };

        const upperSum = UPPER_KEYS.reduce(
          (acc, key) => acc + (Number(newPlayer[key]) || 0),
          0
        );
        newPlayer["upperTotal"] = upperSum;
        newPlayer["bonus"] = upperSum >= 63 ? 50 : 0;
        const baseKeys = rows.filter((k) => !DERIVED_KEYS.has(k));
        const bonusVal = Number(newPlayer["bonus"]) || 0;
        const gameSum =
          baseKeys.reduce(
            (acc, key) => acc + (Number(newPlayer[key]) || 0),
            0
          ) + bonusVal;
        newPlayer["gameTotal"] = gameSum;

        newState[player] = newPlayer;
        return newState;
      }
      case "LOAD_STATE": {
        return { ...action.state };
      }
      case "RESET_PLAYER": {
        const { player } = action;
        const newState: State = { ...state };
        newState[player] = rows.reduce((rowAcc, row) => {
          rowAcc[row] = 0;
          return rowAcc;
        }, {} as PlayerRecord);
        return newState;
      }
      default:
        return state;
    }
  };

  const [gameRecord, dispatch] = useReducer(reducer, players, makeInitialState);

  function getGameRecord(player: string, row: string): number | undefined {
    const playerRec = gameRecord[player];
    if (!playerRec) return undefined;
    const val = playerRec[row];
    return val == null ? undefined : typeof val === "number" ? val : undefined;
  }

  function setGameRecord(
    player: string,
    row: string,
    value: number | null
  ): void {
    dispatch({ type: "SET_CELL", player, row, value });
  }

  const baseKeys = rows.filter((k) => !DERIVED_KEYS.has(k));
  const isGameFinished =
    Object.values(gameRecord).length > 0 &&
    players.every((p) =>
      baseKeys.every((k) => gameRecord[p] && gameRecord[p][k] != null)
    );

  return (
    <table>
      <thead>
        <tr>
          <th>YATZY</th>
          {players.map((name) => (
            <th key={name}>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row}>
            <td className={`labelCell ${row}`}>{row}</td>
            {players.map((_, playerIndex) => (
              <td key={`${row}_${playerIndex}`} className={`valueCell ${row}`}>
                {nonEditableCells.includes(row) ? (
                  // derived rows (upperTotal, bonus, gameTotal) are hidden until the game is finished
                  DERIVED_KEYS.has(row) ? (
                    isGameFinished ? (
                      getGameRecord(players[playerIndex], row)
                    ) : null
                  ) : (
                    getGameRecord(players[playerIndex], row)
                  )
                ) : (
                  <input
                    type="text"
                    id={`${row}_${playerIndex}`}
                    onChange={(e) => {
                      const raw = e.currentTarget.value.trim();
                      if (raw === "") {
                        setGameRecord(players[playerIndex], row, null);
                        return;
                      }
                      if (raw === "-") {
                        // struck cell, count as zero but considered filled
                        setGameRecord(players[playerIndex], row, 0);
                        return;
                      }
                      const parsed = parseInt(raw, 10);
                      setGameRecord(
                        players[playerIndex],
                        row,
                        Number.isFinite(parsed) ? parsed : null
                      );
                    }}
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default YatzyTable;
