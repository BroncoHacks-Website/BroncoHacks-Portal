import { SetStateAction, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { uri } from "../App";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  useEffect(() => {
    if (!token) {
      alert("Session not found: going to home");
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    }
  });
  const [password, setPassword] = useState("");
  const [passwordDupe, setPasswordDupe] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const changePassword = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setPassword(event.target.value);
  };
  const changePasswordDupe = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setPasswordDupe(event.target.value);
  };

  const request = async () => {
    setMessage("");
    if (password != passwordDupe) {
      setMessage("Passwords do not match");
      return;
    }
    if (password === "" || passwordDupe === "") {
      setMessage("Please update both fields before continuting");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
    } else {
      const body = { password: password };
      setIsLoading(true);
      try {
        const res = await fetch(uri + "resetPassword", {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setIsLoading(false);
        const json = await res.json();
        if (json.status == 200) {
          setMessage("Password Reset!");
        } else {
          alert("Error: " + json.message);
          localStorage.removeItem("token");
          navigate("/");
          window.location.reload();
        }
      } catch {
        setIsLoading(false);
        alert("Session Expired: Going Back to Home");
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      }
    }
  };
  return (
    <>
      <div className="bg-indigo-300 min-h-[85vh] flex flex-col items-center">
        <div className="w-full min-h-full flex items-center justify-center">
          <div
            className={`flex flex-col items-center min-h-[70vh]  w-[75vw] sm:w-[55vw] md:w-[45vw] lg:w-[28vw] mx-auto rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden my-10`}
          >
            <h1 className="mt-10 text-3xl">Reset Password 🐴</h1>
            <label className="mt-15">Password</label>
            <div className="relative ">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"></div>
              <input
                onChange={changePassword}
                type="password"
                id="input-group-1"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
              />
            </div>
            <label className="mt-15">Confirm Password</label>
            <div className="relative-">
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
                onChange={changePasswordDupe}
                type="password"
                id="input-group-2"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
              />
            </div>
            <span className="text-red-500 text-sm ml-3">{message}</span>
            <button
              onClick={request}
              className="h-[5vh] w-[45vw] md:w-[30vw] lg:w-[20vw] font-bold text-xl text-white/90 rounded-xl bg-green-300 shadow-lg shadow-black/50 hover:bg-green-400 active:shadow-none active:scale-95 active:translate-y-1 transition-transform duration-150 ease-out mt-10"
            >
              Change Password
            </button>
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
            <h5 className="mt-4">----------or----------</h5>
            <Link
              className="text-purple-500 mt-7 mb-7"
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

export default ResetPassword;
