import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import "../index.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/FindTeam");
    }
  }, [navigate]);

  return (
    <>
      <div className="relative h-[85vh] flex flex-col overflow-hidden">
        {/* underlay to get that gradient background */}
        <div className="absolute inset-0 moving-background opacity-60"></div>
        <div className="relative z-10 flex flex-col md:flex-row h-[70vh] w-[100vw] justify-center items-center m-auto">
          <img
            src="BroncoHacksSquareLogo.png"
            className="h-[30vh] w-[30vh] mx-auto animate-[float_3s_infinite_alternate] shadow-2xl rounded-full mt-25 md:mt-0"
            alt="BroncoHacks Logo"
          />
          <div className="w-[65vw]">
            <div className="mx-auto text-[1.4rem] md:text-[2.65rem] mt-2 sm:mt-10 mb-[10%] text-center font-bold overflow-hidden border-r-4 border-white whitespace-nowrap animate-[typing_6s_steps(50,end)_infinite] w-fit max-w-fit">
              Official Registration Portal
            </div>
            <div className="flex flex-col sm:flex-row justify-items:start ">
              {/* for some reason chatgpt said that the gradient background cannot be used for the Links which was weird cause it's literally the same exact code. See tailwind really pmo rn gng */}
              <Link
                className="mx-auto md:w-[20vw] text-center text-white text-[1.5rem] md:text-[1.7rem] shadow-2xl bg-[#035BA5] anmat-th-bttn-gng focus:outline-none focus:ring-2 focus:ring-green-300  rounded-[20px] py-3 px-4 md:py-4 md:px-8 transform hover:scale-105"
                to={{ pathname: "/Login" }}
              >
                Login 🐎
              </Link>
              <Link
                className="mx-auto mt-2 sm:mt-0 md:w-[20vw] text-center text-white text-[1.5rem] md:text-[1.7rem] shadow-2xl bg-[#035BA5] anmat-th-bttn-gng focus:outline-none focus:ring-2 focus:ring-green-300  rounded-[20px] py-3 px-4 md:py-4 md:px-8 transform hover:scale-105"
                to={{ pathname: "/CreateAccount" }}
              >
                Register Here 👋
              </Link>
            </div>
            <div className="flex justify-center pt-5 md:pt-20 mb-30">
              <a
                href="https://discord.gg/aMP4nYbaX4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="discord.jpeg"
                  className="h-[50px] rounded-xl mr-10"
                ></img>
              </a>
              <a
                href="https://www.instagram.com/cppbroncohacks/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="insta.png" className="h-[50px] mr-10"></img>
              </a>
              <a
                href="https://www.BroncoHacks.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="BroncoHacksSquareLogo.png"
                  className="h-[50px] rounded-xl"
                ></img>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
