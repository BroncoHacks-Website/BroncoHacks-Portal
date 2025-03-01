import { Link } from "react-router";

function NotFound() {
  return (
    <>
      <div className="bg-indigo-300 h-[85vh] flex flex-col items-center">
        <div className="w-full h-full flex items-center justify-center">
          <div
            className={`flex flex-col gap-4 items-center h-[70vh] sm:h-[70vh] w-[75vw] sm:w-[55vw] md:w-[45vw] lg:w-[28vw] mx-auto rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden `}
          >
            <h1 className="text-4xl font-bold m-15 md:text-4xl">
              404 Not Found
            </h1>
            <img src="WilliamBronco.png" className="h-[25vh] w-[25vh]"></img>
            <Link
              className="text-center mx-auto mt-20 md:mt-10 text-white h-[4vh] md:h-[6vh] w-[50vw] sm:w-[30vw] md:w-[20vw] text-[1.5rem] shadow-2xl bg-[#035BA5] hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-400 anmat-th-bttn-gng transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-[20px] transform hover:scale-105"
              to={{ pathname: "/" }}
            >
              Take Me Back Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;
