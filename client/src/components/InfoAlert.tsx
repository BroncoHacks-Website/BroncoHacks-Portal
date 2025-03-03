import { useState } from "react";

function InfoAlert() {

  const [visibility, setVisibility] = useState<boolean>(true);

  return(
    <>
      {visibility && <div className="fixed z-10 flex items-center mx-auto left-1/4 transform -translate-x-1/6 top-6 p-4 mb-4 text-md text-blue-800 border border-blue-300 rounded-lg bg-blue-50">
        <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <div className="mr-2">
          <span className=""></span> You must have a team of at least 2 members to register. If you do not have a preformed team, you can fill <a href="https://docs.google.com/forms/d/e/1FAIpQLScEzsWew9cDBWoENUKWM_dbxpJR-F18RTxr43qXwaNpkACS2w/viewform" className="font-semibold underline hover:no-underline">this form</a> where we will find you a team!
        </div>
        <button type="button" onClick={() => setVisibility(false)} className="ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8" aria-label="Close">
          <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
      </div>}
    </>
  )
}

export default InfoAlert;