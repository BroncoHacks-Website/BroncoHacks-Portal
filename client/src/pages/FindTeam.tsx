import { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { uri } from "../App";
import { HackerModel } from "../models/hacker";

function FindTeam() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [hacker, setHacker] = useState<HackerModel>();

  const [newTeamName, setNewTeamName] = useState<string>("");

  const [createMessage, setCreateMessage] = useState<string>("");

  useEffect(() => {
    
  });

  const changeTeamName = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewTeamName(event.target.value);
  };

  const createTeam = async() => {

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
          if (hackerJSON["status"] != 200) {
            alert("Session Expired, Logging Out");
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setHacker(hackerJSON.hacker);
            // hacker not frfr
            if (hackerJSON.hacker["isConfirmed"] != true) {
              // WAIT WHERE DO I SEND THEM AGAIN
              navigate("/");
            }
            // hacker already has team
            if (hackerJSON.hacker["teamID"] == null) {
              alert("Unable to create team becauser user is already in a team.");
              navigate("/ManageTeam");
            }
          }

          // Validate Team Name
          if (newTeamName == "") {
            setCreateMessage("No name");
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
  };

  return (
    <>
      <div className="bg-[#c3d3eb] h-[85vh] flex flex-col sm:flex-row justify-center">
        {/* create your team tab */}
        <div className="w-full h-full flex flex-col xl:flex-row items-center justify-center">
          <div className="bg-white h-[35vh] w-[80vw] sm:w-[65vw] md:w-[55vw] lg:w-[45vw] xl:h-[60vh] xl:w-[45vw] 2xl:w-[75vh] rounded-2xl border-lg shadow-lg mx-auto text-center">
            <img
              src="horse.png"
              alt="single user default image"
              className="h-[15vh] xl:h-[35vh] w-[15vh] xl:w-[35vh] mx-auto scale-50"
            />
            <div className="flex items-center justify-center font-black text-3xl xl:text-5xl">
              <h1>Create a Team</h1>
            </div>

            <div className="flex items-center justify-center font-black pt-2">
              <label className="xl:text-2xl">Select a Name: </label>
              <input type="text" onChange={changeTeamName} className="border-b-1 ml-2 pl-2" />
            </div>
            <div className="flex items-center justify-center my-2">
              <input
                type="submit"
                value="Create New Team"
                onClick={createTeam}
                className="bg-[#97d9c3] h-[5vh] w-[40vw] md:w-[30vw] lg:w-[20vw] xl:w-[10vw] rounded-xl text-white font-bold shadow-lg hover:cursor-pointer"
              />
              <span className="text-red-500 text-sm ml-3">{createMessage}</span>
              <br />
              <br />
            </div>
          </div>
          <div className="xl:hidden">---------------or---------------</div>
          {/* join team via code tab */}
          <div className="bg-white h-[35vh] w-[80vw] sm:w-[65vw] md:w-[55vw] lg:w-[45vw] xl:h-[60vh] xl:w-[45vw] 2xl:w-[75vh] rounded-2xl border-lg shadow-lg mx-auto text-center">
            <img
              src="group.png"
              alt="single user default image"
              className="h-[15vh] xl:h-[35vh] [35vh] w-[15vh] xl:w-[35vh] mx-auto"
            />
            <div className="flex items-center justify-center font-black text-3xl xl:text-5xl">
              <h1>Join Team via Code</h1>
            </div>

            <label className="xl:text-2xl">Enter Code: </label>
            <input type="text" className="border-b-1 ml-2 pl-2" />

            <div className="flex items-center justify-center my-5">
              <input
                type="submit"
                value="Join"
                className="bg-[#97d9c3] h-[5vh] w-[40vw] md:w-[30vw] lg:w-[20vw] xl:w-[10vw] rounded-xl text-white font-bold shadow-lg hover:cursor-pointer"
              />
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FindTeam;
