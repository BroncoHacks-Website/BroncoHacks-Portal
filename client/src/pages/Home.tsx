import { Link } from "react-router";
import "../index.css"
function Home() {
  return (
    <>
        <div className="bg-indigo-300 h-[85vh] flex flex-col">
          <div className="flex flex-col md:flex-row h-[vh70] w-[100vw] justify-center items-center m-auto">
            <img src="BroncoHacksSquareLogo.png" className="h-[30vh] w-[30vh] mx-auto animate-[float_3s_infinite_alternate]" alt="BroncoHacks Logo"/>
            <div className="w-[65vw]">
              <div className="mx-auto text-[2rem] md:text-[6rem] mb-[10%] text-center font-bold overflow-hidden border-r-4 border-white whitespace-nowrap animate-[typing_7s_steps(30,end)_infinite]">Official Registration Portal</div>
              <div className="flex justify-items:start ">
                <Link className="mx-auto text-white text-[1.5rem] md:text-[2rem] bg-[#035BA5] hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-300 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-[20px] py-3 px-4 md:py-6 md:px-10 transform hover:scale-105"
                  to={{pathname: "/Login",}}>Login</Link>
                <Link className="mx-auto text-white text-[1.5rem] md:text-[2rem] bg-[#035BA5] hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-300 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-[20px] py-3 px-4 md:py-6 md:px-10 transform hover:scale-105"
                  to={{pathname: "/CreateAccount",}}>Create Account</Link>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default Home;
