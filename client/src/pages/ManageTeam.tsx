import { SetStateAction, useEffect, useState } from "react";
import { HackerModel } from "../models/hacker";
import { useNavigate } from "react-router";
import { uri } from "../App";
import { TeamModel } from "../models/team";
import Alert from "../components/Alert";
import Contact from "../components/Contact";
import "../index.css";

interface PartialHackerModel {
  UUID: string;
  email: string;
  firstName: string;
  lastName: string;
  school: string;
  discord: string;
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
  const [function1, setFunction1] = useState<(() => void) | null>(null);
  const [alertButtonMsg, setAlertButtonMsg] = useState("");
  const [function2, setFunction2] = useState<(() => void) | null>(null);
  const [alertButtonMsg2, setAlertButtonMsg2] = useState("");

  const [showContact, setShowContact] = useState(false);
  const [contactContent, setContactContent] =
    useState<PartialHackerModel | null>();

  const [role, setRole] = useState<
    "owner" | "teamMember1" | "teamMember2" | "teamMember3" | undefined
  >(undefined);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

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
                status: teamJSON.team.status,
              });
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

  const resetAlertState = () => {
    setAlertMsg("");
    setAlertButtonMsg("");
    setFunction1(() => {});
    setAlertButtonMsg2("");
    setFunction2(() => {});
    setShowAlert(false);
  };

  const makeOwnerAlertFirstBecauseFuckingMobileHasToLikeNeedAnAlert = (
    newPerson: PartialHackerModel
  ) => {
    resetAlertState();
    setAlertMsg(
      "Are you sure you want to make " +
        newPerson.firstName +
        " " +
        newPerson.lastName +
        " owner of the team?"
    );
    setAlertButtonMsg("No");
    setFunction1(() => () => {
      resetAlertState();
      setShowAlert(false);
    });
    setAlertButtonMsg2("Yes");
    setFunction2(() => () => {
      makeOwner(newPerson);
      setShowAlert(false);
    });
    setShowAlert(true);
  };

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewName(e.target.value);
  };

  const changeTeamName = async () => {
    if (newName == "") {
      console.log(role);
      return;
    }
    const body = {
      teamID: team?.teamID,
      newName: newName,
    };
    try {
      const newNameRes = await fetch(`${uri}team/changeName`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await newNameRes.json();
      if (json.status == 200) {
        resetAlertState();
        setAlertMsg("Team name updated to: " + newName);
        setAlertButtonMsg("Ok");
        setFunction1(() => () => window.location.reload());
        setShowAlert(true);
      }
    } catch {
      alert("Something went wrong");
    }
  };

  const makeOwner = async (newPerson: PartialHackerModel) => {
    if (!hacker || !team) {
      console.error("TS MISSING");
      return;
    }

    try {
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
      if (data.status === 200) {
        resetAlertState();
        setAlertMsg(
          "Ownership successfully transferred to " +
            newPerson.firstName +
            " " +
            newPerson.lastName
        );
        setAlertButtonMsg("Ok");
        setFunction1(() => () => window.location.reload());
        setShowAlert(true);
      } else {
        resetAlertState();
        setAlertMsg("Error transferring Ownership");
        setAlertButtonMsg("Ok");
        setFunction1(() => () => resetAlertState());
        setShowAlert(true);
        console.error(
          "FUCK YOU YOU'RE STUPID I HATE YOU YOU ALWAYS WERE A DUMB SACK OF LARD",
          data.error
        );
      }
    } catch (e) {
      console.error("error transffering owenrship", e);
    }
  };

  const removeMemberAlert = async (memberToRemove: PartialHackerModel) => {
    resetAlertState();
    setAlertMsg(
      "Are you sure you want to kick " +
        memberToRemove.firstName +
        " " +
        memberToRemove.lastName +
        "?"
    );
    setAlertButtonMsg("No");
    setFunction1(() => () => {
      resetAlertState();
      setShowAlert(false);
    });
    setAlertButtonMsg2("Yes");
    setFunction2(() => () => {
      removeMember(memberToRemove);
      setShowAlert(false);
    });
    setShowAlert(true);
  };

  const removeMember = async (memberToRemove: PartialHackerModel) => {
    if (!hacker || !team) {
      console.error("TS MISSING");
      return;
    }

    try {
      const removeRes = await fetch(`${uri}team/removeTeamMember`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          owner: owner?.UUID,
          teamMember: memberToRemove?.UUID,
          teamID: team.teamID,
        }),
      });
      const data = await removeRes.json();
      if (data.status === 200) {
        resetAlertState();
        setAlertMsg(
          memberToRemove.firstName +
            " " +
            memberToRemove.lastName +
            " successfully removed from your team."
        );
        setAlertButtonMsg("Ok");
        setFunction1(() => () => window.location.reload());
        setShowAlert(true);
      } else {
        resetAlertState();
        setAlertMsg("Error removing member");
        setAlertButtonMsg("Ok");
        setFunction1(() => () => window.location.reload());
        setShowAlert(true);
        console.error("error removing member", data.error);
      }
    } catch (e) {
      console.error("error removing member", e);
    }
  };

  const leaveTeamAlert = () => {
    resetAlertState();
    setAlertMsg("Are you sure you want to leave the team?");
    setAlertButtonMsg("No");
    setFunction1(() => () => {
      resetAlertState();
      setShowAlert(false);
    });
    setAlertButtonMsg2("Yes");
    setFunction2(() => () => {
      leaveTeam();
      setShowAlert(false);
    });
    setShowAlert(true);
  };

  const leaveTeam = async () => {
    if (!hacker || !team) {
      console.error("TS MISSING");
      return;
    }

    try {
      const leaveRes = await fetch(`${uri}team/leave`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teamID: team.teamID,
          teamMember: hacker.UUID,
        }),
      });
      const data = await leaveRes.json();
      if (data.status === 200) {
        resetAlertState();
        setAlertMsg("Successfully left your team.");
        setAlertButtonMsg("Ok");
        setFunction1(() => () => window.location.reload());
        setShowAlert(true);
      } else {
        resetAlertState();
        setAlertMsg("Error leaving.");
        setAlertButtonMsg("Ok");
        setShowAlert(true);
        setFunction1(() => () => resetAlertState());
        console.error("you can't leave gang 😂😂😂", data.error);
      }
    } catch (e) {
      console.error("you can't leave gang 😂😂😂", e);
    }
  };

  const deleteTeamAlert = () => {
    resetAlertState();
    setAlertMsg("Are you sure you want to delete the team?");
    setAlertButtonMsg("No");
    setFunction1(() => () => {
      resetAlertState();
      setShowAlert(false);
    });
    setAlertButtonMsg2("Yes");
    setFunction2(() => () => {
      deleteTeam();
      setShowAlert(false);
    });
    setShowAlert(true);
  };

  const deleteTeam = async () => {
    if (!hacker || !team) {
      console.error("TS MISSING");
      return;
    }

    try {
      const deleteRes = await fetch(`${uri}team`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teamID: team.teamID,
          owner: hacker.UUID,
        }),
      });
      const data = await deleteRes.json();
      if (data.status === 200) {
        resetAlertState();
        setAlertMsg("Successfully deleted your team.");
        setAlertButtonMsg("Ok");
        setFunction1(() => () => window.location.reload());
        setShowAlert(true);
      } else {
        resetAlertState();
        setAlertMsg(
          "Error deleting team. You must be the only member in the team."
        );
        setAlertButtonMsg("Ok");
        setFunction1(() => () => resetAlertState());
        setShowAlert(true);
        console.error("u cnt dlt ts gng 😂😂😂", data.error);
      }
    } catch (e) {
      console.error("u cnt dlt ts gng 😂😂😂", e);
    }
  };
  const displayContact = (hacker: PartialHackerModel) => {
    setShowContact(true);
    setContactContent(hacker);
    return;
  };
  const closeContact = () => {
    setShowContact(false);
    setContactContent(null);
  };

  const whatToDo = (status: "approved" | "unregistered" | "pending") => {
    if (status == "approved") {
      setShowAlert(true);
      setAlertMsg(
        "Your team has been approved. No further actions are needed until the day of the hackathon :)"
      );
      setFunction1(() => () => {
        resetAlertState();
        setShowAlert(false);
      });
      setAlertButtonMsg("ok");
    } else if (status == "pending") {
      setShowAlert(true);
      setAlertMsg(
        "Your team has submitted an application and is awaiting review. If it has been over 72 hours since you've sent your application, you can email cppbroncohacks@gmail.com or send a message in the discord for a status update"
      );
      setFunction1(() => () => {
        resetAlertState();
        setShowAlert(false);
      });
      setAlertButtonMsg("ok");
    } else if (status == "unregistered") {
      setShowAlert(true);
      setAlertMsg(
        "Your team hasn't submitted an application to compete in BroncoHacks2025 yet. Once all of your team members are finalized, have the owner register your team on this same page by clicking the 'Register Team' button on the bottom of this page (only the owner can click/see this button)."
      );
      setFunction1(() => () => {
        resetAlertState();
        setShowAlert(false);
      });
      setAlertButtonMsg("ok");
    }
  };

  const registerTeam = async () => {
    if (!hacker || !team) {
      console.error("sumting wong");
      return;
    }

    if (!teamMember1?.UUID) {
      setShowAlert(true);
      setAlertMsg(
        "Need at least 2 members on your team to register for the event"
      );
      setFunction1(() => () => {
        resetAlertState();
        setShowAlert(false);
      });
      setAlertButtonMsg("ok");
    }
    try {
      const reqJSON = {
        teamID: team?.teamID,
        owner: owner?.UUID,
      };

      const res = await fetch(uri + "team/sendApplication", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reqJSON),
      });

      const resJSON = await res.json();

      if (resJSON.status === 200) {
        setAlertMsg(
          "Successfully Registered Team. Your team will be notified via email once your application has been approved"
        );
        setAlertButtonMsg("Ok");
        setFunction1(() => () => window.location.reload());
        setShowAlert(true);
      } else {
        console.error("you stuck here forever");
      }
    } catch {
      setAlertMsg("Error Registering");
      setAlertButtonMsg("Ok");
      setShowAlert(true);
      setFunction1(() => () => window.location.reload());
      console.error("massive error registering");
    }
  };

  const withdrawTeam = async () => {
    if (!hacker || !team) {
      console.error("sumting wong");
      return;
    }

    try {
      const reqJSON = {
        teamID: team?.teamID,
      };

      const res = await fetch(uri + "team/withdrawApplication", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reqJSON),
      });

      const resJSON = await res.json();

      if (resJSON.status === 200) {
        setAlertMsg("Application Withdrawn");
        setAlertButtonMsg("Ok");
        setFunction1(() => () => window.location.reload());
        setShowAlert(true);
      } else {
        console.error("you stuck here forever");
      }
    } catch {
      setAlertMsg("Error Withdrawing");
      setAlertButtonMsg("Ok");
      setShowAlert(true);
      setFunction1(() => () => window.location.reload());
      console.error("massive error registering");
    }
  };
  return (
    <>
      {team && (
        <div className="min-h-[85vh] bg-[#C7D1EB] flex items-center justify-center">
          <div
            id=""
            className="min-h-[60vh] w-[77vw] pl-8 pt-4 pb-4 pr-4 bg-white rounded-4xl flex flex-col items-shadow-xl align-middle my-4"
          >
            {isEditingName ? (
              <div className="flex flex-row gap-2">
                <input
                  placeholder="Input New Team Name"
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[40vw] pl-2"
                />
                <button
                  onClick={() => {
                    setIsEditingName(false);
                  }}
                  className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <button
                  className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                  onClick={changeTeamName}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-row">
                <h1 className="mt-2 md:mt-5 relative font-bold text-[2rem] md:text-[3.5rem]">
                  {team.teamName}
                </h1>
                {hacker?.UUID === parseInt(owner?.UUID ?? "") && (
                  <img
                    onClick={() => {
                      setIsEditingName(true);
                    }}
                    src="edit.png"
                    className="w-[3vh] h-[3vh] my-auto ml-2 cursor-pointer"
                  ></img>
                )}
              </div>
            )}
            <h2 className="relative font-bold text-md md:text-2xl">
              Access Code: {team.teamID}
            </h2>
            {team.status == "approved" && (
              <h3 className="flex flex-row relative font-bold text-md md:text-xl">
                Application Status:{" "}
                <u className="text-green-400 underline ml-2">Approved</u>
                <div
                  className="text-lg text-gray-700 my-auto ml-2 cursor-pointer"
                  onClick={() => {
                    whatToDo(team.status!);
                  }}
                >
                  ⓘ
                </div>
              </h3>
            )}
            {team.status == "pending" && (
              <h3 className="flex flex-row relative font-bold text-md md:text-xl">
                Application Status:
                <u className="text-yellow-400 underline ml-2">In Review</u>
                <div
                  className="text-lg text-gray-700 my-auto ml-2 cursor-pointer"
                  onClick={() => {
                    whatToDo(team.status!);
                  }}
                >
                  ⓘ
                </div>
              </h3>
            )}
            {team.status == "unregistered" && (
              <h3 className="flex flex-row relative font-bold text-md md:text-xl">
                Application Status:{" "}
                <u className="text-red-400 ml-2 underline">
                  Requires Submission
                </u>
                <div
                  className="text-lg text-gray-700 my-auto ml-2 cursor-pointer"
                  onClick={() => {
                    whatToDo(team.status!);
                  }}
                >
                  ⓘ
                </div>
              </h3>
            )}
            <div className="flex flex-col gap-12 mt-5">
              {owner && (
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col md:flex-row items-start justify-center md:items-center gap-1">
                    <h4 className="text-[1.2rem]">Owner:</h4>
                    <h4 className="text-[1.4rem] md:text-[1.7rem] font-semibold flex gap-1">
                      {owner.firstName} {owner.lastName}{" "}
                      {hacker?.UUID === parseInt(owner?.UUID ?? "") && (
                        <span className="text-green-400">(you)</span>
                      )}
                    </h4>
                  </div>
                  <div className="inline-flex w-auto justify-end items-center">
                    <button
                      className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-xl w-[10vw] h-[5vh] sm:px-1 relative overflow-hidden anmat-th-bttn-gng"
                      onClick={() => displayContact(owner)}
                    >
                      <span className="block sm:hidden text-sm">✉</span>
                      <span className="hidden sm:block text-center mx-auto my-auto text-xs lg:text-md">
                        Contact Info
                      </span>
                    </button>
                  </div>
                </div>
              )}
              {teamMember1 && (
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col md:flex-row items-start justify-center md:items-center gap-1">
                    <h4 className="text-[1.2rem]">Teammate:</h4>
                    <h4 className="text-[1.4rem] md:text-[1.7rem] font-semibold flex gap-1">
                      {teamMember1.firstName} {teamMember1.lastName}
                      {hacker?.UUID === parseInt(teamMember1?.UUID ?? "") && (
                        <span className="text-green-400">(you)</span>
                      )}
                    </h4>
                  </div>
                  {teamMember1?.UUID !== null ? (
                    <div className="inline-flex w-auto justify-end items-center gap-2">
                      <button
                        className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-xl w-[10vw] h-[5vh] sm:px-1 relative overflow-hidden anmat-th-bttn-gng"
                        onClick={() =>
                          teamMember1 && displayContact(teamMember1)
                        }
                      >
                        <span className="block sm:hidden text-sm">✉</span>
                        <span className="hidden sm:block text-center mx-auto my-auto text-xs lg:text-md">
                          Contact Info
                        </span>
                      </button>
                      {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (
                        <button
                          className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-xl w-[10vw] h-[5vh] sm:px-1 relative overflow-hidden anmat-th-bttn-gng"
                          onClick={() =>
                            teamMember1 &&
                            makeOwnerAlertFirstBecauseFuckingMobileHasToLikeNeedAnAlert(
                              teamMember1
                            )
                          }
                        >
                          <span className="block sm:hidden text-sm">♕</span>
                          <span className="hidden sm:block text-center mx-auto my-auto text-xs lg:text-md">
                            Make Owner
                          </span>
                        </button>
                      ) : (
                        ""
                      )}
                      {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (
                        <button
                          className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none foc[1.1rem]:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-[1.1rem] w-[10vw] h-[5vh] sm:px-1 relative overflow-hidden anmat-th-bttn-gng"
                          onClick={() =>
                            teamMember1 && removeMemberAlert(teamMember1)
                          }
                        >
                          <span className="block sm:hidden text-sm">✕</span>
                          <span className="hidden sm:block text-center mx-auto my-auto text-xs lg:text-md">
                            Remove Member
                          </span>
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
              {teamMember2 && (
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col md:flex-row items-start justify-center md:items-center gap-1">
                    <h4 className="text-[1.2rem]">Teammate:</h4>
                    <h4 className="text-[1.4rem] md:text-[1.7rem] font-semibold flex gap-1">
                      {teamMember2.firstName} {teamMember2.lastName}
                      {hacker?.UUID === parseInt(teamMember2?.UUID ?? "") && (
                        <span className="text-green-400">(you)</span>
                      )}
                    </h4>
                  </div>
                  {teamMember2?.UUID !== null ? (
                    <div className="inline-flex w-auto justify-end items-center gap-2">
                      <button
                        className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-xl w-[10vw] h-[5vh] sm:px-1 relative overflow-hidden anmat-th-bttn-gng"
                        onClick={() =>
                          teamMember2 && displayContact(teamMember2)
                        }
                      >
                        <span className="block sm:hidden text-sm">✉</span>
                        <span className="hidden sm:block text-center mx-auto my-auto text-xs lg:text-md">
                          Contact Info
                        </span>
                      </button>
                      {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (
                        <button
                          className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-xl w-[10vw] h-[5vh] sm:px-1 relative overflow-hidden anmat-th-bttn-gng"
                          onClick={() =>
                            teamMember2 &&
                            makeOwnerAlertFirstBecauseFuckingMobileHasToLikeNeedAnAlert(
                              teamMember2
                            )
                          }
                        >
                          <span className="block sm:hidden text-sm">♕</span>
                          <span className="hidden sm:block text-center mx-auto my-auto text-xs lg:text-md">
                            Make Owner
                          </span>
                        </button>
                      ) : (
                        ""
                      )}
                      {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (
                        <button
                          className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-[1.1rem] w-[10vw] h-[5vh] sm:px-1 relative overflow-hidden anmat-th-bttn-gng"
                          onClick={() =>
                            teamMember2 && removeMemberAlert(teamMember2)
                          }
                        >
                          <span className="block sm:hidden text-sm">✕</span>
                          <span className="hidden sm:block text-center mx-auto my-auto text-xs lg:text-md">
                            Remove Member
                          </span>
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}

              {teamMember3 && (
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col md:flex-row items-start justify-center md:items-center gap-1">
                    <h4 className="text-[1.2rem]">Teammate:</h4>
                    <h4 className="text-[1.4rem] md:text-[1.7rem] font-semibold flex gap-1">
                      {teamMember3.firstName} {teamMember3.lastName}
                      {hacker?.UUID === parseInt(teamMember3?.UUID ?? "") && (
                        <span className="text-green-400">(you)</span>
                      )}
                    </h4>
                  </div>
                  {teamMember3?.UUID !== null ? (
                    <div className="inline-flex w-auto justify-end items-center gap-2">
                      <button
                        className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-xl w-[10vw] h-[5vh] sm:px-1 relative overflow-hidden anmat-th-bttn-gng"
                        onClick={() =>
                          teamMember3 && displayContact(teamMember3)
                        }
                      >
                        <span className="block sm:hidden text-sm">✉</span>
                        <span className="hidden sm:block text-center mx-auto my-auto text-xs lg:text-md">
                          Contact Info
                        </span>
                      </button>
                      {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (
                        <button
                          className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-xl w-[10vw] h-[5vh] sm:px-1 relative overflow-hidden anmat-th-bttn-gng"
                          onClick={() =>
                            teamMember3 &&
                            makeOwnerAlertFirstBecauseFuckingMobileHasToLikeNeedAnAlert(
                              teamMember3
                            )
                          }
                        >
                          <span className="block sm:hidden text-sm">♕</span>
                          <span className="hidden sm:block text-center mx-auto my-auto text-xs lg:text-md">
                            Make Owner
                          </span>
                        </button>
                      ) : (
                        ""
                      )}
                      {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (
                        <button
                          className="text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring[1.1rem] focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-[1.1rem] w-[10vw] h-[5vh] sm:px-1 relative overflow-hidden anmat-th-bttn-gng"
                          onClick={() =>
                            teamMember3 && removeMemberAlert(teamMember3)
                          }
                        >
                          <span className="block sm:hidden text-sm">✕</span>
                          <span className="hidden sm:block text-center mx-auto my-auto text-xs lg:text-md">
                            Remove Member
                          </span>
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end align-end mt-5">
              <div className="relative inset-0 flex flex-col-reverse items-center md:flex-row md:justify-between md:mb-5 md:mr-2 w-[100vw]">
                {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (
                  <div>
                    {team.status == "unregistered" ? (
                      <button
                        type="button"
                        onClick={registerTeam}
                        className="text-[#F8FAFC] bg-blue-400 hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-xl w-[45vw] h-[5vh] md:w-[12vw] md:h-[7vh] relative overflow-hidden anmat-th-bttn-gng"
                      >
                        Register Team
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={withdrawTeam}
                        className="text-[#F8FAFC] bg-yellow-400 focus:outline-none  font-bold rounded-lg text-sm sm:text-xl w-[45vw] h-[5vh] md:w-[12vw] md:h-[7vh] relative overflow-hidden anmat-th-bttn-gng"
                      >
                        Withdraw Application
                      </button>
                    )}
                  </div>
                ) : (
                  ""
                )}
                <div
                  className={`flex gap-1 my-1 ${
                    hacker?.UUID === parseInt(owner?.UUID ?? "")
                      ? "items-center"
                      : "md:ml-auto"
                  }`}
                >
                  {hacker?.UUID !== parseInt(owner?.UUID ?? "") ? (
                    <button
                      type="button"
                      className="focus:outline-none text-white bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5"
                      onClick={leaveTeamAlert}
                    >
                      Leave Team
                    </button>
                  ) : (
                    ""
                  )}
                  {hacker?.UUID === parseInt(owner?.UUID ?? "") ? (
                    <button
                      type="button"
                      className="focus:outline-none text-white bg-red-500 font-medium rounded-lg text-sm px-5 py-2.5"
                      onClick={deleteTeamAlert}
                    >
                      Delete Team
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            {showAlert && (
              <Alert
                msg={alertMsg}
                function1={function1 ?? (() => {})}
                message1={alertButtonMsg}
                function2={function2 ?? (() => {})}
                message2={alertButtonMsg2}
              />
            )}
            {showContact && contactContent && (
              <Contact hacker={contactContent} onClose={closeContact} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ManageTeam;
