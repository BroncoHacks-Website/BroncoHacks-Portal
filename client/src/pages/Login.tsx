import { SetStateAction, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { uri } from "../App";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/ManageTeam");
    }
  }, [navigate]);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [requestMessage, setRequestMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const login = async () => {
    //  Client Side Validation
    setRequestMessage("");
    if (email.length == 0) {
      setEmailMessage("*enter email before attempting login");
      if (password.length == 0) {
        setPasswordMessage("*enter password before attempting login");
        return;
      } else {
        setPasswordMessage("");
        return;
      }
    }
    if (password.length == 0) {
      setEmailMessage("");
      setPasswordMessage("*enter password before attempting login");
      return;
    }
    setEmailMessage("");
    setPasswordMessage("");

    //Request for login credentials
    setIsLoading(true);
    try {
      const res = await fetch(
        uri + `login?email=${email}&password=${password}`
      );
      const json = await res.json();

      setIsLoading(false);
      if (json.status != 200) {
        setRequestMessage(json.message);
      } else {
        //Succesful Login, Determining if they are confirmed or not
        setRequestMessage("");
        setLoggedIn(true);
        localStorage.setItem("token", json.token);
        window.dispatchEvent(new Event("storage"));
        if (json.isAdmin) {
          navigate("/Admin");
        } else if (json.isConfirmed) {
          navigate("/ManageTeam");
        } else {
          navigate("/EmailConfirmation");
        }
      }
    } catch (error) {
      console.error("Login request failed:", error);
    }
  };

  const changeEmail = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setEmail(event.target.value);
  };

  const changePassword = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setPassword(event.target.value);
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      login();
    }
  };

  return (
    <>
      <div className="bg-indigo-300 min-h-[85vh] flex flex-col items-center">
        <div className="w-full min-h-[80vh] my-4 flex items-center justify-center">
          <div
            className={`flex flex-col gap-4 items-center min-h-[70vh] sm:min-h-[70vh] w-[75vw] sm:w-[55vw] md:w-[45vw] lg:w-[28vw] mx-auto rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden `}
          >
            <h1 className="text-3xl font-bold ml-10 mt-10 mr-10 mb-5 md:text-4xl md:">
              Login
            </h1>

            {/* div holding email and password fields */}
            <div className="flex flex-col w-[80%] gap-8 justify-center items-center">
              {/* email */}
              <div className="flex flex-col gap-2 w-full">
                <p className="w-full">Email</p>
                <input
                  onChange={changeEmail}
                  type="text"
                  className="border-b-2 focus:border-indigo-300 focus:outline-none w-full text-lg p-2 rounded-t-md"
                />
                <span className="text-red-500 text-sm ml-3">
                  {emailMessage}
                </span>
              </div>

              {/* password */}
              <div className="flex flex-col gap-2 w-full">
                <p className="w-full">Password</p>
                <input
                  onChange={changePassword}
                  type="password"
                  className="border-b-2 focus:border-indigo-300 focus:outline-none w-full text-lg p-2 rounded-t-md"
                  onKeyDown={handleKeyDown}
                />
                <span className="text-red-500 text-sm ml-3">
                  {passwordMessage}
                </span>
              </div>
            </div>

            <span className="text-red-500 text-sm text-center">
              {requestMessage}
            </span>
            {isLoading && (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
            )}
            {loggedIn ? (
              <div className="flex flex-row">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                </div>
                <div className="ml-5 my-auto text-green-500 text-sm">
                  logging in...
                </div>
              </div>
            ) : (
              <button
                onClick={login}
                className="h-[60px] w-[140px] font-bold text-2xl cursor-pointer text-white/90 rounded-xl bg-green-300 shadow-md shadow-black/50 hover:bg-green-400 active:shadow-none active:scale-95 active:translate-y-1 transition-transform duration-150 ease-out"
              >
                Login
              </button>
            )}

            <div className="flex flex-col items-center mt-4">
              <p className="">Not a user?</p>
              <Link
                className="text-purple-500"
                to={{ pathname: "/CreateAccount" }}
              >
                Sign Up
              </Link>
            </div>
            <Link
              className="text-purple-500 mb-3"
              to={{ pathname: "/ForgotPassword" }}
            >
              Forgot Your Password?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
