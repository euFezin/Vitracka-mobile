import { useAuth } from "../../src/AuthContext";
import MetricsScreen from "../../src/screens/MetricsScreen";

export default function Metricas() {
  const { token } = useAuth();
  return <MetricsScreen token={token} />;
}
