import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const TOKEN_KEY = "vitracka_token";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  carregandoToken: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  carregandoToken: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [carregandoToken, setCarregandoToken] = useState(true);

  useEffect(() => {
    async function carregarToken() {
      try {
        const tokenSalvo = await SecureStore.getItemAsync(TOKEN_KEY);
        if (tokenSalvo) setTokenState(tokenSalvo);
      } finally {
        setCarregandoToken(false);
      }
    }

    carregarToken();
  }, []);

  function setToken(novoToken: string | null) {
    setTokenState(novoToken);

    if (novoToken) {
      SecureStore.setItemAsync(TOKEN_KEY, novoToken);
    } else {
      SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  }

  return (
    <AuthContext.Provider value={{ token, setToken, carregandoToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
