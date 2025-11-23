import "../index.css";
import { useMemo, useState } from "react";
import { NumberInput } from "@mantine/core";

type Props = {
  players: string[];
};

const scoringRows = [
  "ones",
  "twos",
  "threes",
  "fours",
  "fives",
  "sixes",
  "totalUpper",
  "bonus",
  "pair",
  "twoPair",
  "threeKind",
  "fourKind",
  "smallStraight",
  "largeStraight",
  "fullHouse",
  "chance",
  "yahtzee",
  "gameTotal",
];

const nonEditable = new Set(["totalUpper", "bonus", "gameTotal"]);

// NOTE: exported helper implementing the placeholder logic for upper-category rows.
// It's intentionally not used inside the component so you can hook it up later.
export function computeUpperPlaceholder(
  e: string,
  pi: number,
  scores: Record<string, (number | null)[]>
): string | undefined {
  const upperKeys = ["ones", "twos", "threes", "fours", "fives", "sixes"];
  const idx = upperKeys.indexOf(e);
  if (idx === -1) return undefined;
  if (scores[e][pi] != null) return undefined;

  // baseline: need 3 of each face (counts)
  const counts = [3, 3, 3, 3, 3, 3];

  // apply filled scores: compute actual counts and deduct surplus
  // Prioritize reducing needs on least-costly faces (ones first)
  for (let f = 0; f < 6; f++) {
    const key = upperKeys[f];
    const s = scores[key][pi];
    if (s != null) {
      const actualCount = Math.floor(s / (f + 1));
      const surplus = Math.max(0, actualCount - 3);
      let rem = surplus;
      // distribute surplus to faces starting from ones (least costly)
      for (let k = 0; k < 6 && rem > 0; k++) {
        if (k === f) continue;
        const take = Math.min(counts[k], rem);
        counts[k] -= take;
        rem -= take;
      }
    }
  }

  const neededCount = Math.max(0, counts[idx]);
  const neededPoints = neededCount * (idx + 1);
  return String(neededPoints);
}

function maxForEntry(e: string): number | undefined {
  const map: Record<string, number> = {
    ones: 5,
    twos: 10,
    threes: 15,
    fours: 20,
    fives: 25,
    sixes: 30,
    pair: 12,
    twoPair: 20,
    threeKind: 18,
    fourKind: 24,
    smallStraight: 15,
    largeStraight: 20,
    fullHouse: 28,
    chance: 30,
    yahtzee: 50,
  };
  return map[e];
}

export default function YahtzeeTable({ players }: Props) {
  // scores: mapping entryKey -> array of (number | null) per player
  const [scores, setScores] = useState<Record<string, (number | null)[]>>(
    () => {
      const base: Record<string, (number | null)[]> = {};
      for (const e of scoringRows) {
        base[e] = Array(players.length).fill(null);
      }
      return base;
    }
  );

  const setCell = (
    entryKey: string,
    playerIdx: number,
    value: number | null
  ) => {
    setScores((prev) => {
      const next: Record<string, (number | null)[]> = { ...prev };
      next[entryKey] = [...prev[entryKey]];
      next[entryKey][playerIdx] = value;
      return next;
    });
  };

  const totalUpperFor = (playerIdx: number) => {
    const keys = ["ones", "twos", "threes", "fours", "fives", "sixes"];
    return keys.reduce((sum, k) => sum + (scores[k][playerIdx] ?? 0), 0);
  };

  const bonusFor = (playerIdx: number) => {
    return totalUpperFor(playerIdx) >= 63 ? 50 : 0;
  };

  const gameTotalFor = (playerIdx: number) => {
    // Sum all numeric (including bonus) except gameTotal itself
    return scoringRows.reduce((sum, k) => {
      if (k === "gameTotal") return sum;
      if (k === "totalUpper") return sum + totalUpperFor(playerIdx);
      if (k === "bonus") return sum + bonusFor(playerIdx);
      if (nonEditable.has(k)) return sum; // already handled
      return sum + (scores[k][playerIdx] ?? 0);
    }, 0);
  };

  const editableKeys = scoringRows.filter((e) => !nonEditable.has(e));

  const computedScores = useMemo(() => {
    const upperKeys = ["ones", "twos", "threes", "fours", "fives", "sixes"];
    return players.map((_, idx) => {
      const totalUpper = totalUpperFor(idx);
      const upperCompleted = upperKeys.every((k) => scores[k][idx] != null);
      const totalUpperShown = upperCompleted ? totalUpper : null;
      const bonusShown = upperCompleted ? (totalUpper >= 63 ? 35 : 0) : null;
      const completed = editableKeys.every((k) => scores[k][idx] != null);
      const gameTotal = completed ? gameTotalFor(idx) : null;
      return {
        totalUpper: totalUpperShown,
        bonus: bonusShown,
        gameTotal,
        completed,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scores, players]);

  return (
    <div style={{ overflowX: "auto" }}>
      <div className="outer">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>YATZY</th>
                {players.map((p) => (
                  <th key={p}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scoringRows.map((scoreRow) => {
                const isSummarizedScore = [
                  "totalUpper",
                  "bonus",
                  "gameTotal",
                ].includes(scoreRow);
                return (
                  <tr
                    key={scoreRow}
                    className={isSummarizedScore ? "separator" : undefined}
                  >
                    <td className="labelCell">{scoreRow}</td>
                    {players.map((_, playerIndex) => {
                      const tdClasses = `${isSummarizedScore ? "bold" : ""} ${
                        nonEditable.has(scoreRow) ? "valueCell" : ""
                      }`.trim();
                      return (
                        <td
                          key={`${scoreRow}_${playerIndex}`}
                          className={tdClasses}
                        >
                          {nonEditable.has(scoreRow) ? (
                            scoreRow === "totalUpper" ? (
                              computedScores[playerIndex].totalUpper
                            ) : scoreRow === "bonus" ? (
                              computedScores[playerIndex].bonus
                            ) : scoreRow === "gameTotal" ? (
                              computedScores[playerIndex].completed ? (
                                computedScores[playerIndex].gameTotal
                              ) : (
                                ""
                              )
                            ) : null
                          ) : (
                            <NumberInput
                              value={scores[scoreRow][playerIndex] ?? undefined}
                              hideControls
                              variant="unstyled"
                              min={0}
                              max={maxForEntry(scoreRow)}
                              onChange={(v) => {
                                const nv =
                                  typeof v === "number"
                                    ? v
                                    : v
                                    ? Number(v)
                                    : null;
                                setCell(
                                  scoreRow,
                                  playerIndex,
                                  nv as number | null
                                );
                              }}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
