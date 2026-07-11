import { useAuth } from "../../src/AuthContext";
import ChatScreen from "../../src/screens/ChatScreen";

export default function Explore() {
  const { token } = useAuth();

  return <ChatScreen token={token} />;
}
