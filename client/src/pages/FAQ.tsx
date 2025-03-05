import { useState } from "react";
import Modal from "../components/Modal";

function FAQ() {
  const [showImage1, setShowImage1] = useState<boolean>(false);
  const [showImage2, setShowImage2] = useState<boolean>(false);
  const [showImage3, setShowImage3] = useState<boolean>(false);

  return (
    <>
      <div className="min-h-[85vh] w-[100vw] bg-indigo-300 flex items-center justify-center">
        <div className="flex flex-col min-h-[75vh] w-[65vw] min-h-lg:h-[70vh] lg:w-[75vw] bg-white rounded-2xl shadow-lg shadow-black/75 backface-hidden my-5">
          <div className="text-center">
            <p className="font-bold text-[36px] pt-5">FAQs</p>
          </div>
          <div className="text-[13px] md:text-[14px] lg:text-[18px] px-5 mb-5">
            <p className="font-bold ">
              Q: I don't know anybody to do the hackathon with but I need at
              least 2 members:
            </p>
            <p>
              A: Fill out this{" "}
              <a
                className="text-blue-500 hover:text-blue-300"
                href="https://forms.gle/yhRtWhHncg8cWiqh7"
                target="_blank"
                rel="noopener noreferrer"
              >
                google form
              </a>{" "}
              and we will help you find a team to register with!
            </p>
            <p className="font-bold pt-3">Q: How do I join a team?</p>
            <p>
              A: Have somebody create an account and create a team. In the team
              page, the access code you can use to join a team will be listed
              under the team name.
            </p>
            <p className="font-bold pt-3">
              Q: How do I know if I'm officially registered for the hackathon?
            </p>
            <p>
              A: Once you have created a team, press the "Register Team" button,
              and your application will be reviewed within ~48 hours. Once you
              are approved, you will receive an email, your team page will have
              a status = approved, and your team should be seen{"  "}
              <a
                href="https://www.broncohacks.org/"
                className="text-blue-500 hover:text-blue-300"
              >
                here.
              </a>
            </p>

            <div className="flex justify-center overflow-x-auto scrollbar-hidden">
              <img
                src="faqteampage1.jpg"
                alt="FAQ Team Page 1"
                className="max-w-xs m-2 object-contain overflow-hidden hover:cursor-pointer"
                onClick={() => setShowImage1(!showImage1)}
              />
              <img
                src="registeredteam.png"
                alt="Registration Approval Email"
                className="max-w-xs m-2 object-contain overflow-hidden hover:cursor-pointer"
                onClick={() => setShowImage2(!showImage2)}
              />
              <img
                src="faqteampage2.jpg"
                alt="FAQ Team Page 2"
                className="max-w-xs m-2 object-contain overflow-hidden hover:cursor-pointer"
                onClick={() => setShowImage3(!showImage3)}
              />
            </div>
            <p className="font-bold pt-3 ">
              Q: I have a bug, who should i contact?
            </p>
            <p className="mb-2">
              A: You can email cppbroncohacks@gmail.com with any problems you
              may have. Alternatively, you can message .thedaniel on discord.
            </p>
          </div>
          {showImage1 && (
            <Modal
              onClose={() => setShowImage1(false)}
              caption="Register Team Page"
              src="faqteampage1.jpg"
              alt="Register Team Page"
            />
          )}
          {showImage2 && (
            <Modal
              onClose={() => setShowImage2(false)}
              caption="Registration Approval Email"
              src="registeredteam.png"
              alt="Registration Approval Email"
            />
          )}
          {showImage3 && (
            <Modal
              onClose={() => setShowImage3(false)}
              caption="Approved Team Status"
              src="faqteampage2.jpg"
              alt="FAQ Team Page 2"
            />
          )}
        </div>
      </div>
    </>
  );
}

export default FAQ;
