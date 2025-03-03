import { useNavigate } from "react-router";
import { uri } from "../App";
import { useEffect, useState } from "react";
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

  return (
    <div className="bg-indigo-300 min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Admin Dashboard</h1>
        <h2 className="text-2xl font-semibold mb-4">Hackers</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-indigo-500 text-white">
                <th className="p-2 border">UUID</th>
                <th className="p-2 border">Confrimation Number</th>
                <th className="p-2 border">Discord</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">First Name</th>
                <th className="p-2 border">Admin</th>
                <th className="p-2 border">Confirmed</th>
                <th className="p-2 border">Last Name</th>
                <th className="p-2 border">School</th>
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
        <h2 className="text-2xl font-semibold mb-4">Teams</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-indigo-500 text-white">
                <th className="p-2 border">Owner</th>
                <th className="p-2 border">status</th>
                <th className="p-2 border">Team ID</th>
                <th className="p-2 border">teamMember1</th>
                <th className="p-2 border">teamMember2</th>
                <th className="p-2 border">teamMember3</th>
                <th className="p-2 border">Team Name</th>
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
