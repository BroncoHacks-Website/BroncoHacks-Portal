import { useState } from "react";

function CreateAccount() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <>
      <div className="bg-indigo-300 h-[85vh] flex flex-col items-center justify-center">
        <div className="group h-[625px] w-[250px] md:w-[365px] [perspective:1000px]"></div>
      </div>
    </>
  );
}

export default CreateAccount;
