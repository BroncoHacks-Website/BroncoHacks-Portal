import { useEffect, useState } from "react";
import { uri } from "../App";

interface Teams {
  teamName: string,
  owner: string,
  teamMember1: string,
  teamMember2: string,
  teamMember3: string
}

function Competitors() {

  const [teams, setTeams] = useState<Teams[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {

      try {
        const res = await fetch(uri + `teamsApproved`, {
          method: "GET",
        });
        const json = await res.json();
        if (json["status"] !== 200) return;
        setTeams(json["all_teams"])
      } catch (e) {
        console.log(e);
      }
    }
    fetchTeams();
  }, [])


  return (
    <>
      <div className="bg-[#af9ffa] min-h-[85vh] flex flex-col items-center">
        <div className="bg-white m-4 p-3 rounded-lg shadow-lg flex flex-col items-center">
          <div>
            <h1 className="text-5xl font-bold p-2">🐴Competitors🐴</h1>
          </div>
          <table className="bg-gray-1 text-black m-2 text-center w-full border-collapse border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-[#c3d3eb]">
                <th className="px-3 py-1 first:rounded-tl-lg">Team Name</th>
                <th className="px-3 py-1">Owner</th>
                <th className="px-3 py-1">Teammate</th>
                <th className="px-3 py-1">Teammate</th>
                <th className="px-3 py-1 last:rounded-tr-lg">Teammate</th>
              </tr>
            </thead>
            <tbody>
              {teams && teams.map((team, index) => (
                <tr className="odd:bg-gray-100 even:bg-white">
                  <td key={index} className="hover:bg-gray-50 px-3 py-1">{team.teamName}</td>
                  <td className="hover:bg-gray-50 px-3 py-1">{team.owner}</td>
                  <td className="hover:bg-gray-50 px-3 py-1">{team.teamMember1}</td>
                  <td className="hover:bg-gray-50 px-3 py-1">{team.teamMember2}</td>
                  <td className="hover:bg-gray-50 px-3 py-1">{team.teamMember3}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="bg-[#c3d3eb] font-bold px-3 py-1 text-center first:rounded-bl-lg last:rounded-br-lg">
                  End
                </td>
              </tr>
              
            </tfoot>
          </table>
        </div>
      </div>
    </>
  )
}

export default Competitors;