import { useEffect, useState } from "react";
import { HackerModel } from "../models/hacker";
import { useNavigate } from "react-router";
import { uri } from "../App";

function ManageTeam() {
  //Authentication
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [hacker, setHacker] = useState<HackerModel>();

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        navigate("/");
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

        if (!json.UUID) {
          alert("Session Expired, Logging Out");
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        // Fetch User Info
        try {
          const hackerRes = await fetch(uri + `hacker?UUID=${json.UUID}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const hackerJSON = await hackerRes.json();
          setHacker(hackerJSON["hacker"]);
          console.log(hackerJSON.hacker);
          if (hackerJSON["status"] != 200) {
            alert("Session Expired, Logging Out");
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setHacker(hackerJSON.hacker);
            if (hackerJSON.hacker["isConfirmed"] == false) {
              navigate("/EmailConfirmation");
            }
            if (!hackerJSON.hacker["teamID"]) {
              navigate("/FindTeam");
            }
          }
        } catch {
          alert("Session Expired, Logging Out");
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch {
        alert("Session Expired, Logging Out");
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate, token]);
  const [teamName, setTeamName] = useState("Quandavius Winglebinglers");
  const [accessCode, setAccessCode] = useState("jAF75F1");

  return (
    <>
      <div className="h-[85vh] bg-[#C7D1EB] flex items-center justify-center">
        <div
          id=""
          className="h-[60vh] w-[77vw] pl-8 pt-4 pb-4 pr-4 bg-white rounded-4xl flex flex-col shadow-xl align-middle"
        >
          <h1 className="self-center relative font-bold text-lg md:text-4xl">
            {teamName}
          </h1>
          <p className="self-center relative font-bold text-md md:text-2xl">
            Access Code: {accessCode}
          </p>
        </div>
      </div>
    </>
  );
}

export default ManageTeam;
