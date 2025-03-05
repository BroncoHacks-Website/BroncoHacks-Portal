import MeetTheTeamProfile from "../components/MeetTheTeam";

const teamMembers = [
  {
    name: "Nick Amancio",
    linkedin: "https://www.linkedin.com/in/nicholas-amancio/",
    pfp: "NickA.jpg",
  },
  {
    name: "Caleb Chung",
    linkedin: "https://www.linkedin.com/in/caleb-k-chung-3774852a9/",
    pfp: "CalebC.jpg",
  },
  {
    name: "Cesar Henry de Paula",
    linkedin: "https://www.linkedin.com/in/cesarhenrydepaula",
    pfp: "CesarDP.jpg",
  },
  {
    name: "Jade Nguyen",
    linkedin: "https://www.linkedin.com/in/jade-nguyen-52a591239/",
    pfp: "JadeN.png",
  },
  {
    name: "Daniel Pasion",
    linkedin: "https://www.linkedin.com/in/danielpasion/",
    pfp: "DanielP.png",
  },
  {
    name: "Tony Tong",
    linkedin: "https://www.linkedin.com/in/tony-tong-699631240/",
    pfp: "TonyT.jpeg",
  },
  {
    name: "Justin Nguyen",
    linkedin: "https://www.linkedin.com/in/justin-mn/",
    pfp: "JustinN.jpeg",
  },
  {
    name: "Tommy Phao",
    linkedin: "https://www.linkedin.com/in/thomasphao/",
    pfp: "TommyP.jpeg",
  },
  {
    name: "Jayden Nguyen",
    linkedin: "https://www.linkedin.com/in/jaydenvinhnguyen/",
    pfp: "JaydenN.jpeg",
  },
];

export const Devs = () => {
  return (
    <div className="min-h-[85vh] w-[100vw] bg-indigo-300 flex items-center justify-center">
      <div className="min-h-[75vh] w-[65vw] min-h-lg:h-[70vh] lg:w-[75vw] bg-white rounded-2xl shadow-lg shadow-black/75 backface-hidden my-5">
        <h1 className=" mt-4 text-center text-[2rem] sm:text-[2.5rem] md:text-[4rem] font-bold">Meet the Developers!</h1>
        <div className="flex justify-center items-center flex-wrap gap-8 p-8">
          {teamMembers.map((member, index) => (
            <MeetTheTeamProfile
              key={index}
              name={member.name}
              linkedin={member.linkedin}
              pfp={member.pfp}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Devs;
