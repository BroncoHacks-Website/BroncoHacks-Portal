import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { uri } from "../App";
import { HackerModel } from "../models/hacker";
import PinInput from "react-pin-input";

function EmailConfirmation() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [hacker, setHacker] = useState<HackerModel>();

  const [codeMessage, setCodeMessage] = useState("");
  const [isFinallyConfirmed, setIsFinallyConfirmed] = useState(false);

  //Authentication
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        navigate("/");
        return;
      }

      // Initial Token Request
      try {
        const res = await fetch(uri + "whoami", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (!json.UUID) {
          alert("Session Expired, Logging Out");
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        // Fetch User Info
        try {
          const hackerRes = await fetch(uri + `hacker?UUID=${json.UUID}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const hackerJSON = await hackerRes.json();
          if (hackerJSON["status"] != 200) {
            alert("Session Expired, Logging Out");
            localStorage.removeItem("token");
            navigate("/");
          } else {
            setHacker(hackerJSON.hacker);
            if (hackerJSON.hacker["isConfirmed"] == true) {
              navigate("/FindTeam");
            }
          }
        } catch {
          alert("Session Expired, Logging Out");
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch {
        alert("Session Expired, Logging Out");
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate, token]);

  const checkLength = (value: string, index: number) => {
    if (value.length < 6 && index) {
      setCodeMessage("");
    }
  };

  const sendNewCode = async () => {
    try {
      const res = await fetch(uri + `code`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (json.status == 200) {
        alert("New Code was sent to: " + hacker?.email);
        window.location.reload();
      } else {
        alert("Session has expired: logging out");
      }
    } catch {
      alert("Session has expired: logging out");
    }
  };
  const confirmAccount = async (value: string) => {
    setCodeMessage("");
    try {
      const res = await fetch(uri + `code`, {
        method: "POST",

        body: JSON.stringify({ UUID: hacker?.UUID, confirmationNumber: value }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();

      if (json.status == 200) {
        setCodeMessage("Account is now confirmed: redirecting to app");
        setIsFinallyConfirmed(true);
        await new Promise((r) => setTimeout(r, 1000));
        navigate("/FindTeam");
      } else {
        setCodeMessage("Incorrect Code");
      }
    } catch {
      alert("An Error has Occured");
    }
  };

  return (
    <>
      {hacker && (
        <div className="bg-indigo-300 h-[85vh] flex flex-col items-center">
          <div className="w-full h-full flex items-center justify-center">
            <div
              className={`flex flex-col items-center h-[70vh] sm:h-[60vh] w-[75vw] sm:w-[60vw] md:w-[50vw] lg:w-[35vw] mx-auto rounded-xl bg-white shadow-lg shadow-black/75 `}
            >
              <img className="h-[20vh]" src="email.webp"></img>
              <h1 className="text-center text-2xl">Confirmation Email Sent!</h1>
              <h2 className="text-center mb-5 mx-2">
                A 6 digit code has been sent to{" "}
                <i className="text-blue-300">{hacker.email}</i>. Please enter
                the code to confirm your account (could potentially be in spam)
              </h2>
              <PinInput
                length={6}
                initialValue=""
                type="numeric"
                inputMode="number"
                inputStyle={{
                  borderColor: "black",
                  height: "2.5em",
                  width: "2.5em",
                }}
                focus={true}
                inputFocusStyle={{ borderColor: "blue" }}
                onChange={checkLength}
                onComplete={confirmAccount}
                autoSelect={true}
                regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
              />
              {isFinallyConfirmed && (
                <div role="status" className="mt-2">
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
              <span className="text-red-500 text-sm mt-2 text-center">
                {codeMessage}
              </span>
              <h3 className="mt-5">Didn't Recieve a Code?</h3>
              <h4
                className="text-purple-500 text-xs cursor-pointer"
                onClick={sendNewCode}
              >
                <u>Send a new Code</u>
              </h4>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmailConfirmation;
