import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { uri } from "../App";

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );
  const [modalVisibility, setModalVisibility] = useState(false);

  useEffect(() => {
    window.addEventListener("storage", () => {
      if (localStorage.getItem("token")) {
        setIsLoggedIn(true);
        setToken(localStorage.getItem("token"));
      } else {
        setIsLoggedIn(false);
        setToken(null);
      }
    });
  }, []);

  const logout = async () => {
    try {
      const res = await fetch(uri + "logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      console.log(json);
      if (json.status == 200) {
        alert("Logging out...");
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      } else {
        alert("Error: " + json.message);
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      }
    } catch {
      alert("No Session Found: Going Back to Home");
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    }
  };

  const handleModal = () => {
    setModalVisibility(!modalVisibility);
  };

  return (
    <div className="flex flex-row justify-between items-center h-[15vh] border-1 py-4 px-8">
      {/* Left Section */}
      <div className="flex flex-row items-center gap-4">
        <img
          src="BroncoHacksSquareLogo.png"
          className="h-[10vh] w-[10vh]"
          alt="BroncoHacks Logo"
        />
        <div className="font-bold text-5xl">BroncoHacks Portal</div>
      </div>

      {/* Right Section */}
      <div className="flex flex-row items-center gap-4">
        {isLoggedIn ? (
          <div>
            <button onClick={handleModal} className="my-auto text-m mr-3" type="button">
              Edit Profile
            </button>
            <button onClick={logout} className="my-ayto text-m">
              Logout
            </button>
          </div>
        ) : (
          <Link
            to={{
              pathname: "/",
            }}
          >
            <div className="text-white bg-[#035BA5] hover:bg-[#02498A] focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-3xl py-2 px-4">
              Back to Home
            </div>
          </Link>
        )}
      </div>

      {/* Edit Profile Modal*/}
      {modalVisibility && 
      <div className="[all:unset] fixed z-20 top-0 left-0 w-full h-full flex items-center justify-center">
        {/* dark background */}
        <div className="fixed top-0 left-0 w-full h-full bg-black/50" onClick={handleModal}>
          {/* modal content */}
          <div className="relative bg-white rounded-md overflow-hidden max-w-md w-full mx-4">
            {/* modal header */}
            <div>

            </div>
          </div>
        </div>
      </div>}
      
    </div>
  );
}

export default Navbar;
