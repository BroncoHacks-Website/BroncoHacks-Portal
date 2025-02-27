import { Link } from "react-router";

function Login() {
  return (
    <>
    <body className="bg-indigo-300 h-[85vh] flex flex-col items-center">
      <div className="w-full h-full flex items-center justify-center">
        <div className={`flex flex-col gap-4 items-center h-[450px] w-[250px] md:w-[365px] m-auto rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden `}>
          <h1 className="text-3xl font-bold m-10 md:text-5xl">Login🐴</h1>
          <div className="flex flex-col gap-3 w-[90%] items-start">
            <p>Email</p>
            <input type="text" className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]" />
            <p>Password</p>
            <input type="password" className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]" />
          </div>
          <button className="h-[60px] w-[140px] md:mt-7 font-bold text-3xl text-white/90 rounded-xl bg-green-300 shadow-lg shadow-black/50 hover:bg-green-400 active:shadow-none active:scale-95 active:translate-y-1 transition-transform duration-150 ease-out">Login</button>
          <div className="flex flex-col items-center text-sm">
            <p className="">Not a user?</p>
            <Link className="text-purple-500" to={{ pathname: "/CreateAccount" }}>Sign Up</Link>
          </div>
          </div>
        </div>
    </body>
    </>
  );
}

export default Login;
