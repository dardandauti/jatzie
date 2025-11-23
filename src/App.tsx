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
    <div style={{ marginBottom: 12 }}>
      <label style={{ marginRight: 8 }}>{t("ui.language")}</label>
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
  const players = ["Alice", "Bob", "Charlie"];

  return (
    <LocaleProvider>
      {/* <LangSelector /> */}
      <YatzyTable players={players} />
    </LocaleProvider>
  );
}

export default App;
