import LoginPage from "../login/Login";
import { useAuth } from "../state-context/auth-context";

const Home = () => {
  const { onLogin } = useAuth();
  return (
    <>
      <LoginPage onLogin={onLogin}></LoginPage>
    </>
  );
};

export default Home;