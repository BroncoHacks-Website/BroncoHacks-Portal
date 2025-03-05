import { SetStateAction, useState } from "react";
import { Link } from "react-router";
import { uri } from "../App";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = async () => {
    try {
      const res = await fetch(uri + "sendPasswordReset?email=" + email);
      const json = await res.json();
      if (json.status != 200) {
        setMessage(json.message);
      } else {
        setMessage(
          json.message +
            ": *note that the email sent will most likely be sent to spam, so check your spam folder"
        );
      }
    } catch {
      alert("An error has occured");
    }
  };
  const changeEmail = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setEmail(event.target.value);
  };
  return (
    <>
      <div className="bg-indigo-300 min-h-[85vh] flex flex-col items-center">
        <div className="w-full flex items-center justify-center pt-14">
          <div
            className={`flex flex-col gap-3 items-center min-h-[50vh]  w-[75vw] sm:w-[55vw] md:w-[45vw] lg:w-[28vw] mx-auto rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden `}
          >
            <h1 className="text-3xl font-bold text-center w-full mt-10 mb-5 md:text-4xl">
              Forgot Your Password?
            </h1>
            <h1 className="text-xl mt-1 text-center mx-3">
              If you already have an account, enter your email below. We'll send
              you an email to reset your password :)
            </h1>

            <label
              htmlFor="input-group-1"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Email
            </label>
            <div className="flex flex-row">
              <div className="relative my-auto">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 16"
                  >
                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                  </svg>
                </div>
                <input
                  onChange={changeEmail}
                  type="text"
                  id="input-group-1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                  placeholder="name@flowbite.com"
                />
              </div>
              <button
                onClick={sendEmail}
                className="h-[6vh] w-[6vh] font-bold text-md text-white/90 rounded-xl bg-green-300 shadow-lg shadow-black/50 hover:bg-green-400 active:shadow-none active:scale-95 active:translate-y-1 transition-transform duration-150 ease-out cursor-pointer my-auto ml-2"
              >
                <img
                  src="send.png"
                  className="h-[2vh] w-[2vh] my-auto mx-auto"
                ></img>
              </button>
            </div>
            <span className="text-red-500 text-sm">{message}</span>
            <h5 className="mt-4 text-xl">or</h5>
            <Link
              className="text-purple-500 mt-7 text-xl mb-8"
              to={{ pathname: "/Login" }}
            >
              Back To Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
