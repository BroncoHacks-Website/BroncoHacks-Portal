import { Link, useNavigate } from "react-router";
import { SetStateAction, useEffect, useState } from "react";

function CreateAccount() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/FindTeam");
    }
  }, [navigate]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [discord, setDiscord] = useState("");
  const [school, setSchool] = useState("");

  const [firstNameMessage, setFirstNameMessage] = useState("");
  const [lastNameMessage, setLastNameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");
  const [discordMessage, setDiscordMessage] = useState("");
  const [schoolMessage, setSchoolMessage] = useState("");

  const [isFlipped, setIsFlipped] = useState(false);

  const changeFirstName = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setFirstName(event.target.value);
  };

  const changeLastName = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setLastName(event.target.value);
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

  const changeConfirmPassword = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setConfirmPassword(event.target.value);
  };

  const changeDiscord = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setDiscord(event.target.value);
  };

  const changeSchool = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSchool(event.target.value);
  };

  const handleFlip = () => {
    // First Page Logic
    if (!isFlipped) {
      setFirstNameMessage("");
      setLastNameMessage("");
      setEmailMessage("");
      setPasswordMessage("");
      setConfirmPasswordMessage("");

      let invalid = false;

      if (firstName === "") {
        setFirstNameMessage("*enter first name before continuing");
        invalid = true;
      }
      if (lastName === "") {
        setLastNameMessage("*enter last name before continuing");
        invalid = true;
      }
      if (email === "") {
        setEmailMessage("*enter email name before continuing");
        invalid = true;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailMessage("*please enter a valid email");
        invalid = true;
      }
      if (password.length < 5) {
        setPasswordMessage("*please set a password longer than 5 characters");
        invalid = true;
      }
      if (password !== confirmPassword) {
        setConfirmPasswordMessage("*passwords do not match");
        invalid = true;
      }
      if (invalid) {
        return;
      }
    }
    setIsFlipped(!isFlipped);
  };

  return (
    <>
      <div className="bg-indigo-300 h-[85vh] flex flex-col items-center justify-center">
        {/* White Card */}
        {isFlipped ? (
          <div
            className={`flex flex-col gap-4 items-center h-[80vh] sm:h-[60vh] w-[80vw] sm:w-[55vw] md:w-[45vw] lg:w-[28vw] mx-auto rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden `}
          >
            <h1 className="text-3xl font-bold m-5 sm:m-10 md:text-5xl">🐴</h1>
            <div className="flex flex-col gap-3 w-[90%] items-start">
              <p>Discord Name (if none put N/A)</p>
              <input
                type="text"
                className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
              />
              <p>School</p>
              <input
                type="text"
                className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
              />
              <div className="flex flex-row">
                <input type="checkbox" required></input>
                <p className="ml-5">
                  I agree to the Terms of Service, including the collection of
                  my information for registration and communication purposes,
                  and I consent to receiving emails related to the hackathon.
                </p>
              </div>
            </div>
            <button className="h-[8vh] sm:h-[5vh] w-[30vw] sm:w-[10vw] md:mt-7 font-bold text-sm text-white/90 rounded-xl bg-green-300 shadow-lg shadow-black/50 hover:bg-green-400 active:shadow-none active:scale-95 active:translate-y-1 transition-transform duration-150 ease-out cursor-pointer">
              Create Account
            </button>
            <div className="flex flex-col items-center text-sm">
              <button
                className="text-purple-500 cursor-point"
                onClick={() => setIsFlipped(false)}
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center h-[80vh] sm:h-[60vh] w-[80vw] sm:w-[55vw] md:w-[45vw] lg:w-[28vw] mx-auto rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden `}
          >
            <h1 className="text-2xl font-bold m-3 sm:m-10 md:text-4xl">
              Create Account🐴
            </h1>
            <div className="flex flex-col gap-0 sm:gap-1 justify-between w-[90%]">
              <p>First Name</p>
              <input
                onChange={changeFirstName}
                type="text"
                className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
              />
              <span className="text-red-500 text-xs ml-3">
                {firstNameMessage}
              </span>
              <p>Last Name</p>
              <input
                onChange={changeLastName}
                type="text"
                className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
              />
              <span className="text-red-500 text-xs ml-3">
                {lastNameMessage}
              </span>
              <p>Email</p>
              <input
                onChange={changeEmail}
                type="text"
                className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
              />
              <span className="text-red-500 text-xs ml-3">{emailMessage}</span>
              <p>
                Password{" "}
                <span className="text-xs">*must be at least 6 characters</span>
              </p>
              <input
                onChange={changePassword}
                type="password"
                className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
              />
              <span className="text-red-500 text-xs ml-3">
                {passwordMessage}
              </span>
              <p>Confirm Password</p>
              <input
                onChange={changeConfirmPassword}
                type="password"
                className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]"
              />
              <span className="text-red-500 text-xs ml-3">
                {confirmPasswordMessage}
              </span>
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
        )}
      </div>
    </>
  );
}

export default CreateAccount;
