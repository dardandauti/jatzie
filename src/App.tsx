import YatzyTable from "./components/YatzyTable";
import { LocaleProvider, useLocale } from "./locale/LocaleContext";

function LangSelector() {
  const { lang, setLang, available, t } = useLocale();
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ marginRight: 8 }}>{t("ui.language")}</label>
      <select value={lang} onChange={(e) => setLang(e.currentTarget.value)}>
        {available.map((a) => (
          <option key={a} value={a}>
            {a}
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
      <div style={{ padding: 12 }}>
        <LangSelector />
        <YatzyTable players={players} />
      </div>
    </LocaleProvider>
  );
}

export default App;
