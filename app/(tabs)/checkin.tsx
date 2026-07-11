import { useAuth } from "../../src/AuthContext";
import CheckinScreen from "../../src/screens/CheckinScreen";

export default function Checkin() {
  const { token } = useAuth();

  return <CheckinScreen token={token} />;
}
