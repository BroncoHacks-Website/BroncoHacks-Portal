

function Competitors() {

  const competitors = [
    {
      Name: "The Kickass Krab",
      Owner: "Patrick Subaru",
      Member1: "John Pork",
      Member2: "Squidward Tortillini",
      Member3: "Eugene Krabs"
    },
    {
      Name: "The Los Angeles Lakers",
      Owner: "Jeanie Buss",
      Member1: "LeBron James",
      Member2: "Luka Doncic",
      Member3: "LeSperm James"
    },
    {
      Name: "Cobra Kai",
      Owner: "Johnny Lawrence",
      Member1: "Miguel Diaz",
      Member2: "Tory Nichols",
      Member3: "Hawk Tuah"
    },
    {
      Name: "Miyagi-Do",
      Owner: "Daniel LaRusso",
      Member1: "Samantha LaRusso",
      Member2: "Robby Keene",
      Member3: "Demitri Alexopoulos"
    },
    {
      Name: "Blue Lock",
      Owner: "Ego Jinpachi",
      Member1: "Itoshi Rin",
      Member2: "Isagi Yoichi",
      Member3: null
    }
  ];

  return (
    <>
      <div className="bg-[#af9ffa] min-h-[85vh] flex flex-col items-center">
        <div className="bg-white m-4 p-3 rounded-lg shadow-lg flex flex-col items-center">
          <div>
            <h1 className="text-5xl font-bold p-2">🐴Competitors🐴</h1>
          </div>
          <table className="bg-gray-1 text-black m-2 text-center w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-[#c3d3eb]">
                <th className="border px-3 py-1 first:rounded-tl-lg last:rounded-tr-lg">Team Name</th>
                <th className="border px-3 py-1">Owner</th>
                <th className="border px-3 py-1">Teammate</th>
                <th className="border px-3 py-1">Teammate</th>
                <th className="border px-3 py-1">Teammate</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((team, index) => (
                <tr className="odd:bg-gray-100 even:bg-white">
                  <td key={index} className="hover:bg-gray-50 border px-3 py-1">{team.Name}</td>
                  <td className="hover:bg-gray-50 border border px-3 py-1">{team.Owner}</td>
                  <td className="hover:bg-gray-50 border border px-3 py-1">{team.Member1}</td>
                  <td className="hover:bg-gray-50 border border px-3 py-1">{team.Member2}</td>
                  <td className="hover:bg-gray-50 border border px-3 py-1">{team.Member3}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="bg-[#c3d3eb] border px-3 py-1 text-center first:rounded-bl-lg last:rounded-br-lg">
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