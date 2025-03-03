import { useEffect, useState } from "react";
import { HackerModel } from "../models/hacker";
import { useNavigate } from "react-router";
import { uri } from "../App";
import { TeamModel } from "../models/team";
import Alert from "../components/Alert";

interface PartialHackerModel {
  UUID: string;
  email: string;
  firstName: string;
  lastName: string;
  school: string;
}
function ManageTeam() {
  //Authentication
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [hacker, setHacker] = useState<HackerModel>();
  const [team, setTeam] = useState<TeamModel>();
  const [owner, setOwner] = useState<PartialHackerModel | null>();
  const [teamMember1, setTeamMember1] = useState<PartialHackerModel | null>();
  const [teamMember2, setTeamMember2] = useState<PartialHackerModel | null>();
  const [teamMember3, setTeamMember3] = useState<PartialHackerModel | null>();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertButtonMsg, setAlertButtonMsg] = useState("");

  const [role, setRole] = useState<
    "owner" | "teamMember1" | "teamMember2" | "teamMember3" | undefined
  >(undefined);
  console.log(role);

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
            // Request Team
            const teamRes = await fetch(
              uri + `team?UUID=${hackerJSON.hacker["UUID"]}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const teamJSON = await teamRes.json();
            if (teamJSON.status == 200) {
              setTeam({
                teamID: teamJSON.team.teamID,
                teamName: teamJSON.team.teamName,
                owner: teamJSON.owner,
                teamMember1: teamJSON.teamMember1,
                teamMember2: teamJSON.teamMember2,
                teamMember3: teamJSON.teamMemer3,
              });
              //console.log(teamJSON);
              setOwner(teamJSON.owner);
              if (teamJSON.owner.UUID == hackerJSON.UUID) {
                setRole("owner");
              }
              if (teamJSON.teamMember1) {
                setTeamMember1(teamJSON.teamMember1);
                if (teamJSON.teamMember1.UUID == hackerJSON.UUID) {
                  setRole("teamMember1");
                }
              }
              if (teamJSON.teamMember2) {
                setTeamMember2(teamJSON.teamMember2);
                if (teamJSON.teamMember2.UUID == hackerJSON.UUID) {
                  setRole("teamMember2");
                }
              }

              if (teamJSON.teamMember3) {
                setTeamMember3(teamJSON.teamMember3);
                if (teamJSON.teamMember3.UUID == hackerJSON.UUID) {
                  setRole("teamMember3");
                }
              }
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

  const makeOwner = async (newPerson: PartialHackerModel) => {
    if (!hacker || !team) {
      console.error("TS MISSING");
      return;
    }

    try {
      console.log(owner?.UUID);
      console.log(newPerson?.UUID);
      console.log(team.teamID);
      const newOwnerRes = await fetch(`${uri}team/owner`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          owner: owner?.UUID,
          teamMember: newPerson?.UUID,
          teamID: team.teamID,
        }),
      });

      const data = await newOwnerRes.json();
      console.log(data);
      if (data.status === 200) {
        setAlertMsg(
          "Ownership successfully transferred to " +
            newPerson.firstName +
            " " +
            newPerson.lastName
        );
        setAlertButtonMsg("Ok");
        setShowAlert(true);
      } else {
        console.error(
          "FUCK YOU YOU'RE STUPID I HATE YOU YOU ALWAYS WERE A DUMB SACK OF LARD",
          data.error
        );
      }
    } catch (e) {
      setAlertMsg("Error transferring Ownership");
      setAlertButtonMsg("Ok");
      setShowAlert(true);
      console.error("error transffering owenrship", e);
    }
  };

  return (
    <>
      {team && (
        <div className="h-[85vh] bg-[#C7D1EB] flex items-center justify-center">
          <div
            id=""
            className="h-[60vh] w-[77vw] pl-8 pt-4 pb-4 pr-4 bg-white rounded-4xl flex flex-col shadow-xl align-middle"
          >
            <h1 className="self-center relative font-bold text-lg md:text-4xl">
              {team.teamName}
            </h1>
            <h2 className="self-center relative font-bold text-md md:text-2xl">
              Access Code: {team.teamID}
            </h2>
            <h3 className="self-center relative font-bold text-md md:text-xs">
              Application Status:{" "}
            </h3>
            <div className="flex flex-col gap-16">
              {owner && (
                <div className="flex flex-row">
                  <h4>
                    Owner: {owner.firstName} {owner.lastName}
                  </h4>
                  <button className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1">
                    <span className="block sm:hidden text-sm">✉</span>
                    <span className="hidden sm:block text-center">
                      Contact Info
                    </span>
                  </button>
                  {/* <button className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1" >
                    <span className="block sm:hidden text-sm">♕</span>
                    <span className="hidden sm:block text-center">
                      Make Owner
                    </span>
                  </button> */}
                  {/* {hacker?.UUID === parseInt(owner.UUID) ? (<button className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1">
                    <span className="block sm:hidden text-sm">✕</span>
                    <span className="hidden sm:block text-center">
                      Remove Member
                    </span>
                  </button>): ""} */}
                </div>
              )}
              {teamMember1 && (
                <div className="flex flex-row">
                  <h4>
                    Teammate: {teamMember1.firstName} {teamMember1.lastName}
                  </h4>
                  <button className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1">
                    <span className="block sm:hidden text-sm">✉</span>
                    <span className="hidden sm:block text-center">
                      Contact Info
                    </span>
                  </button>
                  {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (<button
                    className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1"
                    onClick={() => teamMember1 && makeOwner(teamMember1)}
                  >
                    <span className="block sm:hidden text-sm">♕</span>
                    <span className="hidden sm:block text-center">
                      Make Owner
                    </span>
                  </button>):""}
                  {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (<button className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1">
                    <span className="block sm:hidden text-sm">✕</span>
                    <span className="hidden sm:block text-center">
                      Remove Member
                    </span>
                  </button>): ""}
                </div>
              )}
              {teamMember2 && (
                <div className="flex flex-row">
                  <h4>
                    Teammate: {teamMember2.firstName} {teamMember2.lastName}
                  </h4>
                  <button className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1">
                    <span className="block sm:hidden text-sm">✉</span>
                    <span className="hidden sm:block text-center">
                      Contact Info
                    </span>
                  </button>
                  {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (<button
                    className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1"
                    onClick={() => teamMember2 && makeOwner(teamMember2)}
                  >
                    <span className="block sm:hidden text-sm">♕</span>
                    <span className="hidden sm:block text-center">
                      Make Owner
                    </span>
                  </button>):""}
                  {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (<button className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1">
                    <span className="block sm:hidden text-sm">✕</span>
                    <span className="hidden sm:block text-center">
                      Remove Member
                    </span>
                  </button>): ""}
                </div>
              )}
              {teamMember3 && (
                <div className="flex flex-row">
                  <h4>
                    Teammate: {teamMember3.firstName} {teamMember3.lastName}
                  </h4>
                  <button className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1">
                    <span className="block sm:hidden text-sm">✉</span>
                    <span className="hidden sm:block text-center">
                      Contact Info
                    </span>
                  </button>
                  {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (<button
                    className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1"
                    onClick={() => teamMember3 && makeOwner(teamMember3)}
                  >
                    <span className="block sm:hidden text-sm">♕</span>
                    <span className="hidden sm:block text-center">
                      Make Owner
                    </span>
                  </button>): ""}
                  {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (<button className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-3xl py-2 px-4 sm:px-1">
                    <span className="block sm:hidden text-sm">✕</span>
                    <span className="hidden sm:block text-center">
                      Remove Member
                    </span>
                  </button>): ""}
                </div>
              )}
            </div>
            {owner ? (
              <div className="flex flex-row justify-end mt-13 sm:mt-0">
                <button
                  type="button"
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Submit Team
                </button>
                <button
                  type="button"
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Leave Team
                </button>
                <button
                  type="button"
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Delete Team
                </button>
              </div>
            ) : (
              <button>Leave Team</button>
            )}
          </div>
          {showAlert && (
            <Alert
              msg={alertMsg}
              function1={() => {
                window.location.reload();
              }}
              message1={alertButtonMsg}
            />
          )}
        </div>
      )}
    </>
  );
}

export default ManageTeam;
