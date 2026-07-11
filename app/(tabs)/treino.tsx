import { useAuth } from "../../src/AuthContext";
import WorkoutScreen from "../../src/screens/WorkoutScreen";

export default function Treino() {
  const { token } = useAuth();

  return <WorkoutScreen token={token} />;
}
