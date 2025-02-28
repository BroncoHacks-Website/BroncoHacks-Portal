import { Link } from "react-router";
import "../index.css"
function Home() {
  return (
    <>
        <div className="relative h-[85vh] flex flex-col overflow-hidden">
          {/* underlay to get that gradient background */}
          <div className="absolute inset-0 moving-background opacity-60"></div>
          <div className="relative z-10 flex flex-col md:flex-row h-[vh70] w-[100vw] justify-center items-center m-auto">
            <img src="BroncoHacksSquareLogo.png" className="h-[30vh] w-[30vh] mx-auto animate-[float_3s_infinite_alternate] shadow-2xl" alt="BroncoHacks Logo"/>
            <div className="w-[65vw]">
              <div className="mx-auto text-[1.6rem] md:text-[6rem] mb-[10%] text-center font-bold overflow-hidden border-r-4 border-white whitespace-nowrap animate-[typing_7s_steps(30,end)_infinite]">Official Registration Portal</div>
              <div className="flex justify-items:start ">
                {/* for some reason chatgpt said that the gradient background cannot be used for the Links which was weird cause it's literally the same exact code. See tailwind really pmo rn gng */}
                <Link className="mx-auto text-white text-[1.2rem] md:text-[2rem] shadow-2xl bg-[#035BA5] hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-400 anmat-th-bttn-gng transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-[20px] py-3 px-4 md:py-6 md:px-10 transform hover:scale-105"
                  to={{ pathname: "/Login" }}>Login 🐎</Link>
                <Link className="mx-auto text-white text-[1.2rem] md:text-[2rem] shadow-2xl bg-[#035BA5] hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-400 anmat-th-bttn-gng transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-[20px] py-3 px-4 md:py-6 md:px-10 transform hover:scale-105"
                  to={{ pathname: "/CreateAccount" }}>Register Here 👋</Link>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default Home;
