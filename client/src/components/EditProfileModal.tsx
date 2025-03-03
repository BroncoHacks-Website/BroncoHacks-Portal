import { useState } from "react";
import { HackerModel } from "../models/hacker";
import { uri } from "../App";
import Alert from "./Alert";

interface ModalProps {
  hackerProp: HackerModel;
  onClose: () => void;
}

function EditProfileModal({ hackerProp, onClose }: ModalProps) {
  const token = localStorage.getItem("token");

  const [firstName, setFirstName] = useState<string>(hackerProp.firstName);
  const [lastName, setLastName] = useState<string>(hackerProp.lastName);
  const [school, setSchool] = useState<string>(hackerProp.school);
  const [discord, setDiscord] = useState<string>(hackerProp.discord);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertButtonMsg, setAlertButtonMsg] = useState("");

  const [requestMessage, setRequestMessage] = useState("");

  const update = async () => {
    const payload = {
      firstName: firstName,
      lastName: lastName,
      school: school,
      UUID: hackerProp.UUID,
    };

    if (
      firstName == hackerProp.firstName &&
      lastName == hackerProp.lastName &&
      school == hackerProp.school &&
      discord == hackerProp.discord
    ) {
      return;
    }
    try {
      const res = await fetch(uri + "hacker", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status == 200) {
        setAlertMsg("Profile Updated!");
        setAlertButtonMsg("Ok");
        setShowAlert(true);
      } else {
        setRequestMessage(data.message);
      }
    } catch (error) {
      console.log("Error updating data:", error);
    }
  };

  return (
    <>
      <div className="fixed z-20 w-full h-full flex items-center">
        {/* dark background */}
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* modal content */}
          <div
            className="relative bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* modal header */}
            <div className="flex justify-center justify-between px-4 pt-4 md:p-5 rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-4xl font-semibold text-gray-900">🐴</h3>
            </div>
            {/* modal body */}
            <div className="p-4 sm:p-5 space-y-4">
              <form>
                <div className="">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="text-[5vw] sm:text-md md:text-lg lg:text-xl xl:text-2xl border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="text-[5vw] sm:text-md md:text-lg lg:text-xl xl:text-2xl border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="">School</label>
                  <input
                    type="text"
                    className="text-[5vw] sm:text-md md:text-lg lg:text-xl xl:text-2xl border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter School"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                  />
                </div>
                <div>
                  <label>Discord</label>
                  <input
                    type="text"
                    className="text-[5vw] sm:text-md md:text-lg lg:text-xl xl:text-2xl border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter Discord"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                  />
                </div>
                <span className="text-red-500 text-sm text-center">
                  {requestMessage}
                </span>{" "}
                <div className="flex justify-center">
                  <button
                    data-modal-hide="default-modal"
                    onClick={update}
                    type="button"
                    className="py-2.5 px-5 ms-3 text-[5vw] sm:text-md md:text-lg lg:text-xl xl:text-2xl font-bold text-white focus:outline-none bg-[#97d9c3] shadow-lg rounded-lg border border-gray-200 hover:cursor-pointer hover:cursor-pointer hover:bg-[#72e9d3] focus:z-10 focus:ring-4 focus:ring-gray-100"
                  >
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
      {showAlert && (
        <Alert
          msg={alertMsg}
          function1={() => {
            window.location.reload();
          }}
          message1={alertButtonMsg}
        />
      )}
    </>
  );
}

export default EditProfileModal;
