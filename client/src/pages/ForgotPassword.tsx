import { SetStateAction, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { uri } from "../App";

function ForgotPassword() {
  return (
    <>
      <div className="bg-indigo-300 h-[85vh] flex flex-col items-center">
        <div className="w-full h-full flex items-center justify-center">
          <div
            className={`flex flex-col gap-4 items-center h-[70vh] sm:h-[70vh] w-[75vw] sm:w-[55vw] md:w-[45vw] lg:w-[28vw] mx-auto rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden `}
          >
            Re
            <Link className="text-purple-500" to={{ pathname: "/" }}>
              Back To Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
