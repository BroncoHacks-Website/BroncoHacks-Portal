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

  return (
    <div className="flex flex-row justify-between items-center h-[15vh] border-1 shadow-lg py-4 px-8">
      {/* Left Section */}
      <div className="flex flex-row items-center gap-4">
        <img
          src="BroncoHacksSquareLogo.png"
          className="h-[10vh] w-[10vh]"
          alt="BroncoHacks Logo"
        />
        <div className="font-bold text-2xl sm:text-5xl">BroncoHacks Portal</div>
      </div>

      {/* Right Section */}

      <div className="flex flex-row items-center gap-4">
        {isLoggedIn ? (
          <div>
            <button className="my-auto text-m mr-3">Edit Profile</button>
            <button onClick={logout} className="my-ayto text-m">
              Logout
            </button>
          </div>
        ) : (
          <Link to={{ pathname: "/" }}>
            <div className="text-white bg-[#035BA5] hover:bg-[#02498A] focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1">
              <span className="block sm:hidden text-3xl">⌂</span>
              <span className="hidden sm:block text-center">Back to Home</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
