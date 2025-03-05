import { useState } from "react";

interface ToolTipProps {
  message: string;
}

function Tooltip({message}: ToolTipProps) {

  const [isVisible, setIsVisible] = useState<boolean>(false);

  return(
    <>
      <div className="relative group inline-block">
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5" 
          stroke="currentColor"
          className="size-8 rounded-full hover:bg-gray-200 cursor-pointer"
          onClick={() => setIsVisible(!isVisible)}>
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
        <div 
          id="tooltip-animation" 
          className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-[200px] xl:max-w-xs p-2 text-xs text-white bg-gray-900 rounded-lg shadow-md opacity-0 ${isVisible ? "opacity-100" : "opacity-0"} group-hover:opacity-100 transition-opacity`}>
          {message}
        </div>
      </div>
    </>
  )
}

export default Tooltip;