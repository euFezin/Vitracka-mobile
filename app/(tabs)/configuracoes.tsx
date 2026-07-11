import { useAuth } from "../../src/AuthContext";
import SettingsScreen from "../../src/screens/SettingsScreen";

export default function Configuracoes() {
  const { token, setToken } = useAuth();

  function handleLogout() {
    setToken(null);
  }

  return <SettingsScreen token={token} onLogout={handleLogout} />;
}
