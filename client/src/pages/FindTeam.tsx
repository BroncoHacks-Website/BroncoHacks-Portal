import { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { uri } from "../App";
import { Filter } from "bad-words";
import { HackerModel } from "../models/hacker";
import Alert from "../components/Alert";

function FindTeam() {
  const navigate = useNavigate();
  const filter = new Filter();

  const token = localStorage.getItem("token");
  const [hacker, setHacker] = useState<HackerModel>();

  const [newTeamName, setNewTeamName] = useState<string>("");
  const [newTeamCode, setNewTeamCode] = useState<string>("");

  const [createMessage, setCreateMessage] = useState<string>("");
  const [joinMessage, setJoinMessage] = useState<string>("");

  const [showAlert, setShowAlert] = useState(false);
	const [alertMsg, setAlertMsg] = useState("");
	const [function1, setFunction1] = useState<(() => void) | null>(null)
	const [alertButtonMsg, setAlertButtonMsg] = useState("");

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

          if (hackerJSON["status"] != 200) {
            alert("Session Expired, Logging Out");
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setHacker(hackerJSON.hacker);
            if (hackerJSON.hacker["isConfirmed"] == false) {
              navigate("/EmailConfirmation");
            }
            if (hackerJSON.hacker["teamID"]) {
              navigate("/ManageTeam");
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

  const changeTeamName = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewTeamName(event.target.value);
  };

  const changeTeamCode = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewTeamCode(event.target.value);
  };

  const hasNoNoWord = (text: string) => {
    return filter.isProfane(text);
  };

  const joinTeam = async () => {
    setJoinMessage("");
    if (newTeamCode == "") {
      setJoinMessage("Enter a code before joining a team");
      return;
    }

    const body = {
      teamID: newTeamCode,
      teamMember: hacker?.UUID,
    };
    console.log(body);
    const res = await fetch(
      uri + "team/addTeamMember",

      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const json = await res.json();
    console.log(json);
    if (
      json.message === "Team does not exist" ||
      json.message === "Team is full"
    ) {
      setJoinMessage(json.message);
    } else if (json.status != 200) {
      setJoinMessage("Team does not exist");
    } else {
      setAlertMsg("Joining Team ...")
      setAlertButtonMsg("Ok")
      setFunction1(() => () => {navigate("/ManageTeam")})
      setShowAlert(true)
    }
  };

  const createTeam = async () => {
    setCreateMessage("");
    if (hasNoNoWord(newTeamName)) {
      setCreateMessage("Team Name not Allowed");
      return;
    }

    try {
      const reqJSON = {
        teamName: newTeamName,
        owner: hacker?.UUID,
      };

      const createTeamRes = await fetch(uri + "team", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqJSON),
      });

      const resJSON = await createTeamRes.json();
      console.log(resJSON);
      if (resJSON.status != 200) {
        console.log("error");
      } else {
        navigate("/ManageTeam");
      }
    } catch {
      console.log("Hi");
    }
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
              <input
                type="text"
                onChange={changeTeamName}
                className="border-b-1 ml-2 pl-2"
              />
            </div>
            <div className="flex items-center justify-center my-2">
              <input
                type="submit"
                value="Create New Team"
                onClick={createTeam}
                className="bg-[#97d9c3] h-[5vh] w-[40vw] md:w-[30vw] lg:w-[20vw] xl:w-[10vw] rounded-xl text-white font-bold shadow-lg hover:cursor-pointer hover:bg-[#72e9d3]"
              />
              {/* <br /> */}
              <br />
            </div>
            <span className="text-red-500 text-sm ml-3">{createMessage}</span>
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
            <input
              type="text"
              className="border-b-1 ml-2 pl-2"
              onChange={changeTeamCode}
            />

            <div className="flex flex-col items-center justify-center my-5">
              <input
                onClick={joinTeam}
                type="submit"
                value="Join"
                className="bg-[#97d9c3] h-[5vh] w-[40vw] md:w-[30vw] lg:w-[20vw] xl:w-[10vw] rounded-xl text-white font-bold shadow-lg hover:cursor-pointer"
              />
              <span className="text-red-500 text-sm ml-3">{joinMessage}</span>
            </div>
          </div>
        </div>
      </div>
      {showAlert && (<Alert msg={alertMsg} function1={function1 ?? (() => {})} message1={alertButtonMsg}/>)}
    </>
  );
}

export default FindTeam;
