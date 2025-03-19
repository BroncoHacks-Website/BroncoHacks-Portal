import { useEffect, useState } from "react";
import { uri } from "../App";

interface Teams {
  teamName: string;
  owner: string;
  teamMember1: string;
  teamMember2: string;
  teamMember3: string;
}

function Competitors() {
  const [teams, setTeams] = useState<Teams[]>([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(uri + `teamsApproved`, {
          method: "GET",
        });
        const json = await res.json();
        if (json["status"] !== 200) return;
        const newTeams = json["teams"];
        newTeams.push({
          teamName: "The Codekages",
          owner: "Ryan Miller",
          teamMember1: "Roberto Castro",
          teamMember2: "Alexander Paras",
          teamMember3: "Brandon Hoang",
        });
        newTeams.push({
          teamName: "British Bakers",
          owner: "Carlos Vargas",
          teamMember1: "Brandon Shippy",
          teamMember2: "Gian David Marquez",
          teamMember3: "",
        });
        newTeams.push({
          teamName: "Seagulls Taking Bread",
          owner: "Alex Eng",
          teamMember1: "Jason Fuentes",
          teamMember2: "Kelechi Duru",
          teamMember3: "",
        });
        setTeams(json["teams"]);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false); // Set loading to false when data fetching is done
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="bg-indigo-300 min-h-[85vh] flex flex-col items-center px-4 sm:px-8">
      <div className="bg-white w-full max-w-[90vw] sm:max-w-[60vw] m-4 px-6 pb-6 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-2xl sm:text-4xl font-bold p-3 sm:p-5">
          Approved Teams
        </h1>
        <div className="w-full overflow-x-auto">
          <table className="bg-gray-1 text-black text-xs sm:text-sm md:text-base w-full border-collapse border-gray-300">
            <thead>
              <tr className="bg-[#c3d3eb]">
                <th className="px-2 sm:px-3 py-1 first:rounded-tl-lg">
                  Team Name
                </th>
                <th className="px-2 sm:px-3 py-1">Representative</th>
                <th className="px-2 sm:px-3 py-1">Member</th>
                <th className="px-2 sm:px-3 py-1">Member</th>
                <th className="px-2 sm:px-3 py-1 last:rounded-tr-lg">Member</th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <div className="flex justify-center items-center w-full h-full">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 sm:w-8 sm:h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {teams.map((team, index) => (
                  <tr key={index} className="odd:bg-gray-100 even:bg-white">
                    <td className="hover:bg-gray-50 px-2 sm:px-3 py-1 text-[#8cb3ed]">
                      {team.teamName}
                    </td>
                    <td className="hover:bg-gray-50 px-2 sm:px-3 py-1">
                      {team.owner}
                    </td>
                    <td className="hover:bg-gray-50 px-2 sm:px-3 py-1">
                      {team.teamMember1}
                    </td>
                    <td className="hover:bg-gray-50 px-2 sm:px-3 py-1">
                      {team.teamMember2}
                    </td>
                    <td className="hover:bg-gray-50 px-2 sm:px-3 py-1">
                      {team.teamMember3}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default Competitors;
