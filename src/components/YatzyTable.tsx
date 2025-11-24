import { useReducer } from "react";
import "../index.css";
import { rows, nonEditableCells, displayNames } from "../consts";
import { useLocale } from "../locale/LocaleContext";

const YatzyTable = ({ players }: { players: string[] }) => {
  type PlayerRecord = Record<string, number | null>;
  type State = Record<string, PlayerRecord>;

  type Action =
    | { type: "SET_CELL"; player: string; row: string; value: number | null }
    | { type: "LOAD_STATE"; state: State }
    | { type: "RESET_PLAYER"; player: string };

  const DERIVED_KEYS = new Set(["upperTotal", "bonus", "gameTotal"]);
  const UPPER_KEYS = rows.slice(0, 6);
  const BASE_KEYS = rows.filter((k) => !DERIVED_KEYS.has(k));

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

        // recompute derived values only when all base keys are filled for this player
        const playerFinished = BASE_KEYS.every((k) => newPlayer[k] != null);
        if (playerFinished) {
          const upperSum = UPPER_KEYS.reduce(
            (acc, key) => acc + (Number(newPlayer[key]) || 0),
            0
          );
          newPlayer["upperTotal"] = upperSum;
          newPlayer["bonus"] = upperSum >= 63 ? 50 : 0;
          const bonusVal = Number(newPlayer["bonus"]) || 0;
          const gameSum =
            BASE_KEYS.reduce(
              (acc, key) => acc + (Number(newPlayer[key]) || 0),
              0
            ) + bonusVal;
          newPlayer["gameTotal"] = gameSum;
        } else {
          newPlayer["upperTotal"] = null;
          newPlayer["bonus"] = null;
          newPlayer["gameTotal"] = null;
        }

        newState[player] = newPlayer;
        return newState;
      }
      case "LOAD_STATE": {
        // Normalize loaded state so derived fields are only computed when base keys are complete
        const loaded = action.state;
        const normalized: State = {};
        for (const p of Object.keys(loaded)) {
          const playerRec = { ...loaded[p] } as PlayerRecord;
          const playerFinished = BASE_KEYS.every((k) => playerRec[k] != null);
          if (playerFinished) {
            const upperSum = UPPER_KEYS.reduce(
              (acc, key) => acc + (Number(playerRec[key]) || 0),
              0
            );
            playerRec["upperTotal"] = upperSum;
            playerRec["bonus"] = upperSum >= 63 ? 50 : 0;
            const bonusVal = Number(playerRec["bonus"]) || 0;
            playerRec["gameTotal"] =
              BASE_KEYS.reduce(
                (acc, key) => acc + (Number(playerRec[key]) || 0),
                0
              ) + bonusVal;
          } else {
            playerRec["upperTotal"] = null;
            playerRec["bonus"] = null;
            playerRec["gameTotal"] = null;
          }
          normalized[p] = playerRec;
        }
        return normalized;
      }
      case "RESET_PLAYER": {
        const { player } = action;
        const newState: State = { ...state };
        newState[player] = rows.reduce((rowAcc, row) => {
          rowAcc[row] = null;
          return rowAcc;
        }, {} as PlayerRecord);
        return newState;
      }
      default:
        return state;
    }
  };

  const [gameRecord, dispatch] = useReducer(reducer, players, makeInitialState);

  const { t } = useLocale();

  function getGameRecord(player: string, row: string): number | undefined {
    const playerRec = gameRecord[player];
    if (!playerRec) return undefined;
    const val = playerRec[row];
    return val == null ? undefined : typeof val === "number" ? val : undefined;
  }

  function handleRawInput(player: string, row: string, raw: string) {
    const trimmed = raw.trim();
    // allow empty => clear, single '-' => struck (0), or digits only
    if (trimmed === "") {
      setGameRecord(player, row, null);
      return;
    }
    if (trimmed === "-") {
      setGameRecord(player, row, 0);
      return;
    }
    if (/^[0-9]+$/.test(trimmed)) {
      const parsed = parseInt(trimmed, 10);
      setGameRecord(player, row, Number.isFinite(parsed) ? parsed : null);
      return;
    }
    // otherwise ignore invalid input
  }

  function setGameRecord(
    player: string,
    row: string,
    value: number | null
  ): void {
    dispatch({ type: "SET_CELL", player, row, value });
  }

  const isGameFinished =
    Object.values(gameRecord).length > 0 &&
    players.every((p) =>
      BASE_KEYS.every((k) => gameRecord[p] && gameRecord[p][k] != null)
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
            <td className={`labelCell ${row}`}>
              {t(`rows.${row}`, displayNames[row])}
            </td>
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
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id={`${row}_${playerIndex}`}
                    onKeyDown={(e) => {
                      const allowed = [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Home",
                        "End",
                        "Tab",
                        "Enter",
                      ];
                      if (allowed.includes(e.key)) return;
                      // allow digits and dash only
                      if (e.key.length === 1 && !/[0-9-]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) =>
                      handleRawInput(
                        players[playerIndex],
                        row,
                        e.currentTarget.value
                      )
                    }
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
