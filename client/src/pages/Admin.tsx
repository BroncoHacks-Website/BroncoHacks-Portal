import { useNavigate } from "react-router";
import { uri } from "../App";
import { SetStateAction, useEffect, useState } from "react";
import { HackerModel } from "../models/hacker";
import { TeamModel } from "../models/team";

function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [hackers, setHackers] = useState<HackerModel[]>([]);
  const [teams, setTeams] = useState<TeamModel[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch(uri + "whoami", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        const hackerRes = await fetch(uri + `hacker?UUID=${json.UUID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const hackerJSON = await hackerRes.json();

        if (hackerJSON["status"] !== 200 || !hackerJSON.hacker["isAdmin"]) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        const data = await fetch(uri + "admin", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const jsonData = await data.json();
        if (jsonData.status !== 200) return;

        setHackers(jsonData["hackers"]);
        setTeams(jsonData["teams"]);
        console.log(jsonData);
      } catch {
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate, token]);

  const [sql, setSQL] = useState("");
  const [secret, setSecret] = useState("");
  const [response, setResponse] = useState("");

  const changeSql = (event: { target: { value: SetStateAction<string> } }) => {
    setSQL(event.target.value);
  };

  const changeSecret = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSecret(event.target.value);
  };

  const send = async () => {
    const body = { sql: sql, secret: secret };
    console.log(body);
    const res = await fetch(uri + "admin/sql", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    console.log(json);
    setResponse(json.message);
  };

  const approve = async (teamID: number) => {
    const body = 1;
  };

  return (
    <div className="bg-indigo-300 min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        <h1 className="text-4xl font-bold text-center mb-6" onClick={send}>
          Admin Dashboard
        </h1>
        <h2 className="text-2xl font-semibold mb-4">hackers</h2>
        <input onChange={changeSql}></input>
        <input onChange={changeSecret}></input>
        <span className="text-red-700">{response}</span>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-indigo-500 text-white">
                <th className="p-2 border">UUID</th>
                <th className="p-2 border">confrimationNumber</th>
                <th className="p-2 border">discord</th>
                <th className="p-2 border">email</th>
                <th className="p-2 border">firstName</th>
                <th className="p-2 border">isAdmin</th>
                <th className="p-2 border">isConfirmed</th>
                <th className="p-2 border">lastName</th>
                <th className="p-2 border">school</th>
                <th className="p-2 border">teamID</th>
              </tr>
            </thead>
            <tbody>
              {hackers.map((hacker) => (
                <tr key={hacker.UUID} className="odd:bg-gray-100 even:bg-white">
                  {Object.values(hacker).map((value, index) => (
                    <td key={index} className="p-2 border text-center">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="text-2xl font-semibold mb-4">teams</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-indigo-500 text-white">
                <th className="p-2 border">owner</th>
                <th className="p-2 border">status</th>
                <th className="p-2 border">teamID</th>
                <th className="p-2 border">teamMember1</th>
                <th className="p-2 border">teamMember2</th>
                <th className="p-2 border">teamMember3</th>
                <th className="p-2 border">teamName</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.teamID} className="odd:bg-gray-100 even:bg-white">
                  {Object.values(team).map((value, index) => (
                    <td key={index} className="p-2 border text-center">
                      {String(value)}
                    </td>
                  ))}
                  {team.status != "approved" && (
                    <td
                      className="p-2 border bg-red-200 cursor-pointer"
                      onClick={() => {
                        approve(team.teamID);
                      }}
                    >
                      Approve Team
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;
