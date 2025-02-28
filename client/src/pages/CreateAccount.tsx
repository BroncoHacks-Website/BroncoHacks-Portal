import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

function CreateAccount() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/FindTeam");
    }
  }, [navigate]);

  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <>
      <div className="bg-indigo-300 h-[85vh] flex flex-col items-center justify-center">
        {/* White Card */}
        <div
          className={`flex flex-col items-center h-[80vh] sm:h-[60vh] w-[80vw] sm:w-[55vw] md:w-[45vw] lg:w-[28vw] mx-auto rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden `}
        >
          <h1 className="text-2xl font-bold m-3 sm:m-10 md:text-4xl">
            Create Account🐴
          </h1>
          <div className="flex flex-col gap-2 sm:gap-3 justify-between w-[90%]">
            <p>First Name</p>
            <input
              type="text"
              className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
            />

            <p>Last Name</p>
            <input
              type="text"
              className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
            />
            <p>Email</p>
            <input
              type="text"
              className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
            />
            <p>Password</p>
            <input
              type="password"
              className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
            />
            <p>Confirm Password</p>
            <input
              type="password"
              className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
            />
          </div>

          <button
            className="h-[5vh] w-[20vw] mt-2 font-bold text-md text-white/90 rounded-xl bg-green-300 shadow-lg shadow-black/50 hover:bg-green-400 active:shadow-none active:scale-95 active:translate-y-1 transition-transform duration-150 ease-out"
            onClick={handleFlip}
          >
            Next
          </button>
          <div className="flex flex-col items-center text-sm">
            <p className="">Already have an Account?</p>
            <Link className="text-purple-500" to={{ pathname: "/Login" }}>
              Login
            </Link>
          </div>
        </div>

        {/* <div
          className={`flex flex-col gap-4 items-center h-[80vh] sm:h-[60vh] w-[80vw] sm:w-[55vw] md:w-[45vw] lg:w-[28vw] mx-auto rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden `}
        >
          <h1 className="text-3xl font-bold m-5 sm:m-10 md:text-5xl">🐴</h1>
          <div className="flex flex-col gap-3 w-[90%] items-start">
            <p>Discord Name</p>
            <input
              type="text"
              className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
            />
            <p>School</p>
            <input
              type="text"
              className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
            />
            <p>Miscellaneous</p>
            <input
              type="text"
              className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
            />
            <p>Extra</p>
            <input
              type="text"
              className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
            />
          </div>
          <button className="h-[8vh] sm:h-[5vh] w-[30vw] sm:w-[10vw] md:mt-7 font-bold text-sm text-white/90 rounded-xl bg-green-300 shadow-lg shadow-black/50 hover:bg-green-400 active:shadow-none active:scale-95 active:translate-y-1 transition-transform duration-150 ease-out cursor-pointer">
            Create Account
          </button>
          <div className="flex flex-col items-center text-sm">
            <button
              className="text-purple-500"
              onClick={() => setIsFlipped(false)}
            >
              Back
            </button>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default CreateAccount;
