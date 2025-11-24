import { useState } from "react";
import AddPlayers from "./components/AddPlayers";
import YatzyTable from "./components/YatzyTable";
import { LocaleProvider, useLocale } from "./locale/LocaleContext";

function LangSelector() {
  const { lang, setLang, available, t } = useLocale();
  const flagMap: Record<string, string> = {
    en: "🇬🇧",
    sv: "🇸🇪",
    sq: "🇦🇱",
    fi: "🇫🇮",
    it: "🇮🇹",
    ja: "🇯🇵",
  };
  return (
    <div>
      <label>{t("ui.language")}</label>
      <select value={lang} onChange={(e) => setLang(e.currentTarget.value)}>
        {available.map((a) => (
          <option key={a} value={a}>
            {flagMap[a] ?? a}
          </option>
        ))}
      </select>
    </div>
  );
}

function App() {
  const [players, setPlayers] = useState<string[]>([]);

  return (
    <LocaleProvider>
      <div className="root-app-container">
        <LangSelector />
        {players.length === 0 ? (
          <AddPlayers setPlayers={setPlayers} />
        ) : (
          <YatzyTable players={players} />
        )}
      </div>
    </LocaleProvider>
  );
}

export default App;
