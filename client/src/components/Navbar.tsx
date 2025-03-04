import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { uri } from "../App";
import Alert from "./Alert";
import EditProfileModal from "./EditProfileModal";
import { HackerModel } from "../models/hacker";

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertButtonMsg, setAlertButtonMsg] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [hacker, setHacker] = useState<HackerModel | null>(null);

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

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        return;
      }

      // Initial Token Request
      try {
        const res = await fetch(uri + "whoami", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        // Fetch User Info

        const hackerRes = await fetch(uri + `hacker?UUID=${json.UUID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const hackerJSON = await hackerRes.json();
        if (hackerJSON["status"] != 200) {
          alert("Session Expired, Logging Out");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setHacker(hackerJSON.hacker);
          if (hackerJSON.hacker["isAdmin"] == true) {
            navigate("/Admin");
          } else if (hackerJSON.hacker["isConfirmed"] == true) {
            navigate("/FindTeam");
          }
        }
      } catch {
        console.log("Error");
      }
    };
    if (token) {
      checkAuth();
    }
  }, [token]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logout = async () => {
    try {
      const res = await fetch(uri + "logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.status == 200) {
        setAlertMsg("Logging out...");
        setAlertButtonMsg("Ok");
        setShowAlert(true);
      } else {
        setAlertMsg("error " + json.message);
        setAlertButtonMsg("Ok");
        setShowAlert(true);
      }
    } catch {
      alert("No Session Found: Going Back to Home");
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-row justify-between items-center h-[15vh] py-4 px-8">
      {/* Left Section */}
      <div
        className="flex flex-row items-center gap-4 hover:cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="BroncoHacksSquareLogo.png"
          className="h-[10vh] w-[10vh]"
          alt="BroncoHacks Logo"
        />
        <div className="font-bold text-2xl sm:text-5xl">BroncoHacks Portal</div>
      </div>

      {/* Right Section */}
      <div className="flex flex-row items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white bg-[#035BA5] hover:bg-[#02498A] focus:outline-none focus:ring-4 focus:ring-blue-300  rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1"
          >
            <span className="block sm:hidden text-3xl">Ξ</span>
            <span className="hidden sm:block text-center px-2">Menu</span>
          </button>
          {dropdownOpen && (
            <div
              onClick={() => {
                setDropdownOpen(false);
              }}
              className="absolute mt-2 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            >
              <Link
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                to={{ pathname: "/" }}
              >
                Home
              </Link>
              <a
                href="https://www.broncohacks.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                What is BroncoHacks?
              </a>
              <Link
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                to={{ pathname: "/FAQ" }}
              >
                FAQ/Help
              </Link>

              {isLoggedIn && (
                <div>
                  {" "}
                  <button
                    onClick={() => {
                      setModalVisibility(!modalVisibility);
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showAlert && (
        <Alert
          msg={alertMsg}
          function1={() => {
            localStorage.removeItem("token");
            navigate("/");
            window.location.reload();
          }}
          message1={alertButtonMsg}
        />
      )}

      {/* Edit Profile Modal*/}

      {modalVisibility && hacker && (
        <EditProfileModal
          hackerProp={hacker}
          onClose={() => setModalVisibility(false)}
        />
      )}
    </div>
  );
}

export default Navbar;
