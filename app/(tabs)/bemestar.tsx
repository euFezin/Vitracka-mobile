import { useAuth } from "../../src/AuthContext";
import WellnessScreen from "../../src/screens/WellnessScreen";

export default function Bemestar() {
  const { token } = useAuth();
  return <WellnessScreen token={token} />;
}
