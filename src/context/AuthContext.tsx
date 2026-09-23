import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getUserRole } from "../action";
import supabases from "../superbase/superbase";

interface AuthContextType {
  session: Session | null;
  role: string | null;
  isLoading: boolean;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  role: null,
  isLoading: true,
});

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateAuthState = async (nextSession: Session | null) => {
      setSession(nextSession);
      setRole(null);

      if (nextSession) {
        try {
          setRole(await getUserRole(nextSession.user.id));
        } catch {
          setRole(null);
        }
      }

      setIsLoading(false);
    };

    void supabases.auth.getSession().then(({ data: { session: initialSession } }) =>
      updateAuthState(initialSession),
    );

    const { data: authListener } = supabases.auth.onAuthStateChange(
      (_event, nextSession) => void updateAuthState(nextSession),
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, role, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// El provider y su hook deben compartir este módulo para exponer una única API.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};