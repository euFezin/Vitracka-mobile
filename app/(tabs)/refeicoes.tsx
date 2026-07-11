import { useAuth } from "../../src/AuthContext";
import MealPlanScreen from "../../src/screens/MealPlanScreen";

export default function Refeicoes() {
  const { token } = useAuth();

  return <MealPlanScreen token={token} />;
}
