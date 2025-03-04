type MeetTheTeamProfileProps = {
  name: string;
  linkedin: string;
  pfp: string;
};

const MeetTheTeamProfile = ({
  name,
  linkedin,
  pfp,
}: MeetTheTeamProfileProps) => {
  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 rounded-2xl shadow-md w-64">
      <img
        src={pfp}
        alt={`${name}'s profile picture`}
        className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
      />
      <h2 className="mt-3 text-lg font-semibold text-gray-800">{name}</h2>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 text-blue-500 hover:underline"
      >
        LinkedIn
      </a>
    </div>
  );
};

export default MeetTheTeamProfile;
