import { useAuth } from "../../src/AuthContext";
import DashboardScreen from "../../src/screens/DashboardScreen";

export default function Index() {
  const { token } = useAuth();
  return <DashboardScreen token={token} />;
}
