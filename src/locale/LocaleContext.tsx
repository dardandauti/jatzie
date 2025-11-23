import React, { createContext, useContext, useMemo, useState } from "react";
import { displayNames } from "../consts";
import type { Translations } from "../locales/types";
import { en } from "../locales/en";
import { sv } from "../locales/sv";
import { sq } from "../locales/sq";
import { fi } from "../locales/fi";
import { it } from "../locales/it";
import { ja } from "../locales/ja";

const TRANSLATIONS: Record<string, Translations> = {
  en,
  sv,
  sq,
  fi,
  it,
  ja,
};

const STORAGE_KEY = "app_lang";

type LocaleContextType = {
  lang: string;
  setLang: (l: string) => void;
  t: (key: string, defaultValue?: string) => string;
  available: string[];
};

const LocaleContext = createContext<LocaleContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  available: Object.keys(TRANSLATIONS),
});

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const initial =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEY) || "en"
      : "en";
  const [lang, setLangState] = useState<string>(initial);

  const setLang = (l: string) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  };

  const t = useMemo(() => {
    return (key: string, defaultValue?: string) => {
      const parts = key.split(".");
      const get = (obj: any) => {
        let cur = obj;
        for (const p of parts) {
          if (!cur) return undefined;
          cur = cur[p];
        }
        return cur;
      };

      const cur = get(TRANSLATIONS[lang]) ?? get(TRANSLATIONS["en"]);
      if (cur !== undefined) return String(cur);
      // fallback to consts displayNames for rows
      if (parts[0] === "rows") {
        return displayNames[parts[1]] ?? defaultValue ?? key;
      }
      return defaultValue ?? key;
    };
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t, available: Object.keys(TRANSLATIONS) }),
    [lang, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);

export default LocaleContext;
