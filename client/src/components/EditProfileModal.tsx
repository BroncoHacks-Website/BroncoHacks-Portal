import { SetStateAction, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { HackerModel } from "../models/hacker";
import { uri } from "../App";

interface ModalProps {
  hackerProp: HackerModel,
  onClose: () => void;
}

function EditProfileModal({ hackerProp, onClose}: ModalProps) {
  const navigate = useNavigate();
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [school, setSchool] = useState<string>("");
  const [discord, setDiscord] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  console.log(hackerProp);

  useEffect(() => {
    window.addEventListener("storage", () => {
      if (localStorage.getItem("token")) {
        setIsLoggedIn(true);
        setToken(localStorage.getItem("token"));
      } else {
        setIsLoggedIn(false);
        setToken(null);
      }
    });

  }, []);

  // useEffect(() => {
  //     // Initial Token Request
  //   const fetchHacker = async () => {

  //     try {
  //       const res = await fetch(uri + "whoami", {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       const json = await res.json();

  //       try {
  //         const hackerRes = await fetch(uri + `hacker?UUID=${json.UUID}`, {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });
  //         const hackerJSON = await hackerRes.json();
  //         console.log(hackerJSON.hacker);
  //         setFirstName(hackerJSON.hacker["firstName"]);
  //         setLastName(hackerJSON.hacker["lastName"]);
  //         setSchool(hackerJSON.hacker["school"]);
  //         setDiscord(hackerJSON.hacker["discord"]);
  //         setPassword(hackerJSON.hacker["password"]);
  //       } catch {

  //       };
  //     } catch {

  //     };
  //   }

  //   fetchHacker();
  //   });
    
  // }, []
  // 
  const update = async () => {

    const payload = {
      firstName: firstName,
      lastName: lastName,
      school: school,
      discord: discord,
      password: password,
    }
    try {
      const res = await fetch(uri + "hacker", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.status == 200) {
        alert("Successfully updated information");
      }

    } catch(error) {
      console.log("Error updating data:", error);
    }
  }
  // const res = await fetch(uri + "logout", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });

  return(
    <>
      <div className="fixed z-20 w-full h-full flex items-center">
        {/* dark background */}
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center" onClick={onClose}>
          {/* modal content */}
          <div className="relative bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            {/* modal header */}
            <div className="flex justify-center justify-between px-4 pt-4 md:p-5 rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-4xl font-semibold text-gray-900">
                  🐴
                </h3>
            </div>
            {/* modal body */}
            <div className="p-4 sm:p-5 space-y-4">
              <form>
                <div className="">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    className="sm:text-xl border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    className="border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                  <label>School</label>
                  <input 
                    type="text" 
                    className="border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter School"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    />
                </div>
                <div>
                  <label>Discord</label>
                  <input 
                    type="text" 
                    className="border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter Discord"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    />
                </div>
                <div>
                  <label>Password</label>
                  <input 
                    type="text" 
                    className="border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex justify-center">
                  <button 
                  data-modal-hide="default-modal" 
                  onClick={update}
                  type="button" 
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-white focus:outline-none bg-[#97d9c3] shadow-lg rounded-lg border border-gray-200 hover:cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                  Save
                  </button>
                </div>
              </form>

            </div>
            {/* modal footer */}
            {/* <div className="flex justify-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              
            </div> */}
        </div>
        </div>
      </div>
    </>
  )
}

export default EditProfileModal;