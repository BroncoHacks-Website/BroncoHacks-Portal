import { Link, useNavigate } from "react-router";
import { SetStateAction, useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { uri } from "../App";

function CreateAccount() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/FindTeam");
    }
  }, [navigate]);

  const schoolList = [
    { value: "Academy of Art University", label: "Academy of Art University" },
    {
      value: "Alliant International University",
      label: "Alliant International University",
    },
    {
      value: "American Film Institute Conservatory",
      label: "American Film Institute Conservatory",
    },
    {
      value: "American Jewish University",
      label: "American Jewish University",
    },
    {
      value: "Antioch University Los Angeles",
      label: "Antioch University Los Angeles",
    },
    {
      value: "Antioch University Santa Barbara",
      label: "Antioch University Santa Barbara",
    },
    {
      value: "ArtCenter College of Design",
      label: "ArtCenter College of Design",
    },
    { value: "Azusa Pacific University", label: "Azusa Pacific University" },
    { value: "Bethesda University", label: "Bethesda University" },
    { value: "Biola University", label: "Biola University" },
    {
      value: "California Baptist University",
      label: "California Baptist University",
    },
    {
      value: "California College of the Arts",
      label: "California College of the Arts",
    },
    {
      value: "California Institute of Integral Studies",
      label: "California Institute of Integral Studies",
    },
    {
      value: "California Institute of Technology",
      label: "California Institute of Technology",
    },
    {
      value: "California Institute of the Arts",
      label: "California Institute of the Arts",
    },
    {
      value: "California Lutheran University",
      label: "California Lutheran University",
    },
    {
      value: "California Polytechnic State University, San Luis Obispo",
      label: "California Polytechnic State University, San Luis Obispo",
    },
    {
      value: "California State Polytechnic University, Humboldt",
      label: "California State Polytechnic University, Humboldt",
    },
    {
      value: "California State Polytechnic University, Pomona",
      label: "California State Polytechnic University, Pomona",
    },
    {
      value: "California State University Channel Islands",
      label: "California State University Channel Islands",
    },
    {
      value: "California State University Maritime Academy",
      label: "California State University Maritime Academy",
    },
    {
      value: "California State University San Marcos",
      label: "California State University San Marcos",
    },
    {
      value: "California State University, Bakersfield",
      label: "California State University, Bakersfield",
    },
    {
      value: "California State University, Chico",
      label: "California State University, Chico",
    },
    {
      value: "California State University, Dominguez Hills",
      label: "California State University, Dominguez Hills",
    },
    {
      value: "California State University, East Bay",
      label: "California State University, East Bay",
    },
    {
      value: "California State University, Fresno",
      label: "California State University, Fresno",
    },
    {
      value: "California State University, Fullerton",
      label: "California State University, Fullerton",
    },
    {
      value: "California State University, Long Beach",
      label: "California State University, Long Beach",
    },
    {
      value: "California State University, Los Angeles",
      label: "California State University, Los Angeles",
    },
    {
      value: "California State University, Monterey Bay",
      label: "California State University, Monterey Bay",
    },
    {
      value: "California State University, Northridge",
      label: "California State University, Northridge",
    },
    {
      value: "California State University, Sacramento",
      label: "California State University, Sacramento",
    },
    {
      value: "California State University, San Bernardino",
      label: "California State University, San Bernardino",
    },
    {
      value: "California State University, Stanislaus",
      label: "California State University, Stanislaus",
    },
    {
      value: "California Western School of Law",
      label: "California Western School of Law",
    },
    { value: "Chapman University", label: "Chapman University" },
    {
      value: "Charles R. Drew University of Medicine and Science",
      label: "Charles R. Drew University of Medicine and Science",
    },
    {
      value: "Claremont Graduate University",
      label: "Claremont Graduate University",
    },
    { value: "Claremont McKenna College", label: "Claremont McKenna College" },
    {
      value: "Concordia University Irvine",
      label: "Concordia University Irvine",
    },
    {
      value: "Dharma Realm Buddhist University",
      label: "Dharma Realm Buddhist University",
    },
    {
      value: "Dominican School of Philosophy & Theology",
      label: "Dominican School of Philosophy & Theology",
    },
    {
      value: "Dominican University of California",
      label: "Dominican University of California",
    },
    {
      value: "Fielding Graduate University",
      label: "Fielding Graduate University",
    },
    { value: "Fresno Pacific University", label: "Fresno Pacific University" },
    { value: "Golden Gate University", label: "Golden Gate University" },
    { value: "Harvey Mudd College", label: "Harvey Mudd College" },
    { value: "Holy Names University", label: "Holy Names University" },
    {
      value: "Hope International University",
      label: "Hope International University",
    },
    { value: "Humphreys University", label: "Humphreys University" },
    {
      value: "Irell and Manella Graduate School of Biological Sciences",
      label: "Irell and Manella Graduate School of Biological Sciences",
    },
    { value: "Jessup University", label: "Jessup University" },

    {
      value: "John Paul the Great Catholic University",
      label: "John Paul the Great Catholic University",
    },
    { value: "Keck Graduate Institute", label: "Keck Graduate Institute" },
    { value: "La Sierra University", label: "La Sierra University" },
    {
      value: "Laguna College of Art and Design",
      label: "Laguna College of Art and Design",
    },
    { value: "Life Pacific University", label: "Life Pacific University" },
    { value: "Loma Linda University", label: "Loma Linda University" },
    {
      value: "Loyola Marymount University",
      label: "Loyola Marymount University",
    },
    {
      value: "Marshall B. Ketchum University",
      label: "Marshall B. Ketchum University",
    },
    { value: "Menlo College", label: "Menlo College" },
    {
      value: "Mount Saint Mary's University",
      label: "Mount Saint Mary's University",
    },
    { value: "National University", label: "National University" },
    { value: "Naval Postgraduate School", label: "Naval Postgraduate School" },
    {
      value: "NewSchool of Architecture and Design",
      label: "NewSchool of Architecture and Design",
    },
    {
      value: "Notre Dame de Namur University",
      label: "Notre Dame de Namur University",
    },
    { value: "Occidental College", label: "Occidental College" },
    {
      value: "Otis College of Art and Design",
      label: "Otis College of Art and Design",
    },
    { value: "Pacific Oaks College", label: "Pacific Oaks College" },
    { value: "Pacific Union College", label: "Pacific Union College" },
    {
      value: "Pacifica Graduate Institute",
      label: "Pacifica Graduate Institute",
    },
    { value: "Palo Alto University", label: "Palo Alto University" },
    {
      value: "Pardee RAND Graduate School",
      label: "Pardee RAND Graduate School",
    },
    { value: "Pepperdine University", label: "Pepperdine University" },
    { value: "Pitzer College", label: "Pitzer College" },
    {
      value: "Point Loma Nazarene University",
      label: "Point Loma Nazarene University",
    },
    { value: "Pomona College", label: "Pomona College" },
    {
      value: "Providence Christian College",
      label: "Providence Christian College",
    },
    {
      value: "Saint Mary's College of California",
      label: "Saint Mary's College of California",
    },
    { value: "Samuel Merritt University", label: "Samuel Merritt University" },
    {
      value: "San Diego Christian College",
      label: "San Diego Christian College",
    },
    {
      value: "San Diego State University",
      label: "San Diego State University",
    },
    {
      value: "San Francisco Conservatory of Music",
      label: "San Francisco Conservatory of Music",
    },
    {
      value: "San Francisco State University",
      label: "San Francisco State University",
    },
    { value: "San José State University", label: "San José State University" },
    { value: "Santa Clara University", label: "Santa Clara University" },
    { value: "Saybrook University", label: "Saybrook University" },
    { value: "Scripps College", label: "Scripps College" },
    { value: "Simpson University", label: "Simpson University" },
    { value: "Sofia University", label: "Sofia University" },
    {
      value: "Soka University of America",
      label: "Soka University of America",
    },
    { value: "Sonoma State University", label: "Sonoma State University" },
    {
      value: "Southern California Institute of Architecture",
      label: "Southern California Institute of Architecture",
    },
    { value: "Southwestern Law School", label: "Southwestern Law School" },
    { value: "Stanford University", label: "Stanford University" },
    {
      value: "The Chicago School of Professional Psychology",
      label: "The Chicago School of Professional Psychology",
    },
    { value: "The Master's University", label: "The Master's University" },
    {
      value: "The University of West Los Angeles",
      label: "The University of West Los Angeles",
    },
    { value: "The Wright Institute", label: "The Wright Institute" },
    { value: "Thomas Aquinas College", label: "Thomas Aquinas College" },
    {
      value: "Thomas Jefferson School of Law",
      label: "Thomas Jefferson School of Law",
    },
    {
      value: "Touro University California",
      label: "Touro University California",
    },
    { value: "United States University", label: "United States University" },
    {
      value: "University of California College of the Law, San Francisco",
      label: "University of California College of the Law, San Francisco",
    },
    {
      value: "University of California, Berkeley",
      label: "University of California, Berkeley",
    },
    {
      value: "University of California, Davis",
      label: "University of California, Davis",
    },
    {
      value: "University of California, Irvine",
      label: "University of California, Irvine",
    },
    {
      value: "University of California, Los Angeles",
      label: "University of California, Los Angeles",
    },
    {
      value: "University of California, Merced",
      label: "University of California, Merced",
    },
    {
      value: "University of California, Riverside",
      label: "University of California, Riverside",
    },
    {
      value: "University of California, San Diego",
      label: "University of California, San Diego",
    },
    {
      value: "University of California, San Francisco",
      label: "University of California, San Francisco",
    },
    {
      value: "University of California, Santa Barbara",
      label: "University of California, Santa Barbara",
    },
    {
      value: "University of California, Santa Cruz",
      label: "University of California, Santa Cruz",
    },
    { value: "University of La Verne", label: "University of La Verne" },
    {
      value: "University of Massachusetts Global",
      label: "University of Massachusetts Global",
    },
    { value: "University of Redlands", label: "University of Redlands" },
    { value: "University of San Diego", label: "University of San Diego" },
    {
      value: "University of San Francisco",
      label: "University of San Francisco",
    },
    {
      value: "University of Silicon Valley",
      label: "University of Silicon Valley",
    },
    {
      value: "University of Southern California",
      label: "University of Southern California",
    },
    {
      value: "University of St. Augustine for Health Sciences",
      label: "University of St. Augustine for Health Sciences",
    },
    { value: "University of the Pacific", label: "University of the Pacific" },
    { value: "University of the West", label: "University of the West" },
    {
      value: "Vanguard University of Southern California",
      label: "Vanguard University of Southern California",
    },
    {
      value: "West Coast University-Los Angeles",
      label: "West Coast University-Los Angeles",
    },
    {
      value: "Western University of Health Sciences",
      label: "Western University of Health Sciences",
    },
    { value: "Westmont College", label: "Westmont College" },
    { value: "Whittier College", label: "Whittier College" },
    { value: "Woodbury University", label: "Woodbury University" },
  ];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [discord, setDiscord] = useState("");
  const [school, setSchool] = useState("");
  const [TOS, setTOS] = useState(false);

  const [firstNameMessage, setFirstNameMessage] = useState("");
  const [lastNameMessage, setLastNameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");
  const [discordMessage, setDiscordMessage] = useState("");
  const [schoolMessage, setSchoolMessage] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [TOSMessage, setTOSMessage] = useState("");

  const [isFlipped, setIsFlipped] = useState(false);
  const [isManuallyEntered, setIsManuallyEntered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  const changeSchoolManual = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSchool(event.target.value);
  };

  const changeSchoolSelect = (
    school: SingleValue<{ value: string; label: string }>
  ) => {
    if (school) {
      setSchool(school.value);
    } else {
      setSchool(""); // Or handle null/empty case
    }
  };

  const changeTOS = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setTOS(event.target.checked);
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
      if (!/^\S+@\S+\.(?!edu$)\S+$/.test(email)) {
        setEmailMessage("*please enter a valid email");
        invalid = true;
      }
      if (password.length < 6) {
        setPasswordMessage("*please set password to at least 6 characters");
        invalid = true;
      }
      if (password !== confirmPassword) {
        setConfirmPasswordMessage("*passwords do not match");
        invalid = true;
      }
      if (email.endsWith(".edu")) {
        setEmailMessage(".edu emails not allowed");
        invalid = true;
      }
      if (invalid) {
        return;
      }
    }
    setIsFlipped(!isFlipped);
  };

  const handleIsManuallyEntered = () => {
    setIsManuallyEntered(!isManuallyEntered);
    setSchool("");
  };

  const createAccount = async () => {
    setRequestMessage("");
    setDiscordMessage("");
    setSchoolMessage("");
    setTOSMessage("");
    // At this point, first page should already be validated so we just need to check discord and school
    let invalid = false;
    if (discord === "") {
      setDiscordMessage("*please enter your discord before continuing");
      invalid = true;
    }
    if (school === "") {
      setSchoolMessage("*please enter your school before continuing");
      invalid = true;
    }
    if (!TOS) {
      setTOSMessage("*required");
      invalid = true;
    }
    if (invalid) {
      return;
    } else {
      setDiscordMessage("");
      setSchoolMessage("");
      setTOSMessage("");
    }
    const reqBody = {
      firstName,
      lastName,
      password,
      email,
      discord,
      school,
    };
    setIsLoading(true);
    const res = await fetch(uri + `hacker`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    const json = await res.json();
    setIsLoading(false);
    if (json.status != 200) {
      setRequestMessage(json.message);
    } else {
      setRequestMessage("");
      localStorage.setItem("token", json.token);
      window.dispatchEvent(new Event("storage"));
      navigate("/EmailConfirmation");
    }
  };

  return (
    <>
      <div className="bg-indigo-300 min-h-[85vh] flex flex-col items-center justify-center">
        {/* White Card */}
        {isFlipped ? (
          <div
            className={`flex flex-col gap-4 items-center h-[80vh] sm:h-[80vh] w-[80vw] sm:w-[55vw] md:w-[45vw] lg:w-[28vw] mx-auto rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden `}
          >
            <h1 className="text-3xl font-bold m-5 sm:m-10 md:text-5xl">🐴</h1>
            <div className="flex flex-col gap-2 w-[90%] items-start">
              <p className="bolded">Discord</p>
              <input
                onChange={changeDiscord}
                value={discord}
                type="text"
                className="border-b-2 focus:border-indigo-300 focus:outline-none w-[95%]"
              />
              <span className="text-red-500 text-xs ml-3">
                {discordMessage}
              </span>
              <p>School</p>
              {isManuallyEntered ? (
                <div className="flex flex-col w-[100%] items-start">
                  <input
                    onChange={changeSchoolManual}
                    value={school}
                    type="text"
                    className="border-b-2 focus:border-indigo-300 focus:outline-none w-[95%]"
                  />
                  <div className="flex flex-row mx-auto mt-2">
                    <p className="text-xs sm:text-sm md:text-md lg:text-lg">
                      Choose from selected list:
                    </p>
                    <button
                      onClick={handleIsManuallyEntered}
                      className="ml-2 text-xs sm:text-sm md:text-md lg:text-lg text-purple-500 underlined cursor-pointer"
                    >
                      Search for School
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="mx-auto">
                    <Select
                      className="w-[65vw] sm:w-[50vw] md:w-[25vw]"
                      options={schoolList}
                      onChange={changeSchoolSelect}
                      defaultValue={{ value: school, label: school }}
                    />
                  </div>
                  <div className="flex flex-row mx-auto mt-3">
                    <p className="text-xs sm:text-sm md:text-md lg:text-lg">
                      Cant find school your school?
                    </p>
                    <button
                      onClick={handleIsManuallyEntered}
                      className="ml-2 text-xs sm:text-sm md:text-md lg:text-lg text-purple-500 underlined cursor-pointer"
                    >
                      Manually Enter It
                    </button>
                  </div>
                </div>
              )}
              <span className="text-red-500 text-xs ml-3">{schoolMessage}</span>
              <div className="flex flex-row">
                <input
                  type="checkbox"
                  checked={TOS}
                  onChange={changeTOS}
                  required
                ></input>
                <p className="ml-5 text-xs">
                  I agree to the collection of my information for registration
                  and communication purposes, and I consent to receiving emails
                  related to the hackathon.
                </p>
              </div>
              <span className="text-red-500 text-xs ml-3 text-center">
                {TOSMessage}
              </span>
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
            <button
              onClick={createAccount}
              className="h-[6vh] sm:h-[5vh] w-[30vw] sm:w-[10vw] md:mt-5 font-bold text-sm text-white/90 rounded-xl bg-green-300 shadow-lg shadow-black/50 hover:bg-green-400 active:shadow-none active:scale-95 active:translate-y-1 transition-transform duration-150 ease-out cursor-pointer"
            >
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
            className={`flex flex-col items-center min-h-[75vh] w-[80vw] sm:w-[55vw] md:w-[45vw] lg:w-[28vw] mx-auto my-5 rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden `}
          >
            <h1 className="text-2xl font-bold m-3 sm:m-10 md:text-2xl xl:text-4xl">
              Create Account
            </h1>

            {/* div holding Create Account fields */}
            <div className="flex flex-col gap-[.125rem] sm:gap-6 w-[70%]">
              <div className="flex flex-col gap-1">
                <p className="font-sm">First Name</p>
                <input
                  onChange={changeFirstName}
                  value={firstName}
                  type="text"
                  className="border-b-2 focus:border-indigo-300 focus:outline-none w-full"
                />
                <span className="text-red-500 text-xs ml-3">
                  {firstNameMessage}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <p>Last Name</p>
                <input
                  onChange={changeLastName}
                  value={lastName}
                  type="text"
                  className="border-b-2 focus:border-indigo-300 focus:outline-none w-full"
                />
                <span className="text-red-500 text-xs ml-3">
                  {lastNameMessage}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <p>
                  Email{" "}
                  <span className="text-xs text-green-300">
                    .edu emails not allowed
                  </span>
                </p>
                <input
                  onChange={changeEmail}
                  value={email}
                  type="text"
                  className="border-b-2 focus:border-indigo-300 focus:outline-none w-full"
                />
                <span className="text-red-500 text-xs ml-3">
                  {emailMessage}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <p>
                  Password{" "}
                  <span className="text-xs text-green-300">
                    *must be at least 6 characters
                  </span>
                </p>
                <input
                  onChange={changePassword}
                  value={password}
                  type="password"
                  className="border-b-2 focus:border-indigo-300 focus:outline-none w-full"
                />
                <span className="text-red-500 text-xs ml-3">
                  {passwordMessage}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <p>Confirm Password</p>
                <input
                  onChange={changeConfirmPassword}
                  value={confirmPassword}
                  type="password"
                  className="border-b-2 focus:border-indigo-300 focus:outline-none w-full"
                />
                <span className="text-red-500 text-xs ml-3">
                  {confirmPasswordMessage}
                </span>
              </div>
            </div>

            <button
              className="h-[5vh] w-1/5 mt-6 font-bold text-md text-white/90 rounded-xl bg-green-300 cursor-pointer shadow-lg shadow-black/50 hover:bg-green-400 active:shadow-none active:scale-95 active:translate-y-1 transition-transform duration-150 ease-out"
              onClick={handleFlip}
            >
              Next
            </button>
            <div className="flex flex-col items-center text mt-6">
              <p className="">Already have an Account?</p>
              <Link
                className="text-purple-500 mb-2"
                to={{ pathname: "/Login" }}
              >
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
