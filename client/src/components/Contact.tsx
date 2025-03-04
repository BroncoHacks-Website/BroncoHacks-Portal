interface PartialHackerModel {
  UUID: string;
  email: string;
  firstName: string;
  lastName: string;
  school: string;
  discord: string;
}

const Contact = ({
  hacker,
  onClose,
}: {
  hacker: PartialHackerModel | null;
  onClose: () => void;
}) => {
  if (!hacker) return null; // Prevents errors if hacker is null

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/50 bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg min-w-[70vw] md:min-w-[35vw] min-h-[22vh] md:min-h-[25vh] flex flex-col items-center">
        <h1 className="text-[3rem]">Contact</h1>
        <h1 className="text-[1rem] md:text-[1.5rem]">Email: {hacker.email}</h1>
        <h1 className="text-[1rem] md:text-[1.5rem]">
          Discord: {hacker.discord}
        </h1>
        <h1 className="text-[1rem] md:text-[1.5rem]">
          School: {hacker.school}
        </h1>
        <div className="flex justify-end align-end ">
          <button
            className=" text-[#F8FAFC] bg-[#1E293B] hover:bg-[#64748B] focus:outline-none focus:ring-4 focus:ring-[#0EA5E9] font-bold rounded-lg text-sm sm:text-xl w-[40vw] md:w-[10vw] h-[5vh] sm:px-1 relative overflow-hidden anmat-th-bttn-gng"
            onClick={() => onClose()}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
