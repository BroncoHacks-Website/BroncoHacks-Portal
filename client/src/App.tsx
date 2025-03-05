import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import EmailConfirmation from "./pages/EmailConfirmation";
import NotFound from "./pages/NotFound";
import ManageTeam from "./pages/ManageTeam";
import FindTeam from "./pages/FindTeam";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import FAQ from "./pages/FAQ";
import Devs from "./pages/Devs";
import Competitors from "./pages/Competitors";

export const uri = "http://127.0.0.1:8000/";
// export const uri = "https://bhportal.onrender.com/";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/FindTeam" element={<FindTeam />} />
        <Route path="/EmailConfirmation" element={<EmailConfirmation />} />
        <Route path="/ManageTeam" element={<ManageTeam />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Devs" element={<Devs />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/Competitors" element={<Competitors />} />
      </Routes>
    </>
  );
}

export default App;
