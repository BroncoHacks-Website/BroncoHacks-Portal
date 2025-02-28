import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import ManageTeam from "./pages/ManageTeam";

function App() {
  return (
    <>
      {/* <Navbar></Navbar> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<CreateAccount />} />
        <Route path="/" element={<Login />} />
        <Route path="/manageTeam" element={<ManageTeam />} />
      </Routes>
    </>
  );
}

export default App;
