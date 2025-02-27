import { Link } from "react-router";

function Home() {
  return (
    <>
      <div className="bg-indigo-300 h-[85vh] flex flex-col">
        <div className="flex flex-col h-[60vh] w-[30vw] m-auto rounded-lg bg-white">
          <div className="mx-auto mt-5 text-xl">
            BroncoHacks Official Regisration Portal
          </div>
          <img
            src="BroncoHacksSquareLogo.png"
            className="h-[30vh] w-[30vh] mx-auto"
            alt="BroncoHacks Logo"
          />
          <Link
            className="mt-5 mx-auto text-white bg-[#035BA5] hover:bg-[#02498A] focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-lg  py-2 px-4"
            to={{
              pathname: "/Login",
            }}
          >
            Login
          </Link>
          <div className="mx-auto">---------------or---------------</div>
          <Link
            className="mx-auto text-white bg-[#035BA5] hover:bg-[#02498A] focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-lg py-2 px-4"
            to={{
              pathname: "/CreateAccount",
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;