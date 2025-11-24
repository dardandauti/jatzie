import { useState } from "react";

const AddPlayers = ({
  setPlayers,
}: {
  setPlayers: (list: string[]) => void;
}) => {
  const [players, setTempPlayers] = useState<string[]>([]);
  const [name, setName] = useState<string>("");

  const addPlayer = () => {
    const trimmed = name.trim();
    if (trimmed === "") return;
    setTempPlayers((prev) => [...prev, trimmed]);
    setName("");
  };

  return (
    <div className="add-players-container">
      <h1>YATZYYY!</h1>
      {players.map((p, idx) => (
        <p key={idx} className="player-name">
          {p}
        </p>
      ))}
      <div className="add-player-inputs">
        <input
          id="player_name_input"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPlayer();
            }
          }}
          placeholder="Player name"
        />
        <button onClick={addPlayer}>Add</button>
      </div>
      <button
        disabled={players.length === 0}
        onClick={() => setPlayers(players)}
      >
        Start Game
      </button>
    </div>
  );
};

export default AddPlayers;
