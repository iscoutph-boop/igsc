import { createContext, useContext, type ReactNode } from "react";

type Theme = "light";
type ThemeContextValue = { theme: Theme; toggle: () => void; setTheme: (theme: Theme) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider
      value={{ theme: "light", toggle: () => undefined, setTheme: () => undefined }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
