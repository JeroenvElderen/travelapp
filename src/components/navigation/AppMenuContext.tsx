import { createContext, type ReactNode, useContext } from 'react';

const AppMenuContext = createContext<() => void>(() => undefined);

export function AppMenuProvider({ children, onOpen }: { children: ReactNode; onOpen: () => void }) {
  return <AppMenuContext.Provider value={onOpen}>{children}</AppMenuContext.Provider>;
}

export function useAppMenu() {
  return useContext(AppMenuContext);
}