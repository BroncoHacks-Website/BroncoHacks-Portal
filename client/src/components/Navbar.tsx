function Navbar() {
  return (
    <div className="flex flex-row justify-between items-center h-[15vh] border-1 shadow-lg py-4 px-8">
      {/* Left Section */}
      <div className="flex flex-row items-center gap-4">
        <img
          src="BroncoHacksSquareLogo.png"
          className="h-[10vh] w-[10vh]"
          alt="BroncoHacks Logo"
        />
        <div className="font-bold text-5xl">BroncoHacks Portal</div>
      </div>

      {/* Right Section */}
      <div className="flex flex-row items-center gap-4">
        <button className="my-auto">Edit Profile</button>
        <a
          href="https://www.broncohacks.org/"
          className="text-white bg-[#035BA5] hover:bg-[#02498A] focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-3xl py-2 px-4"
        >
          Back to Website
        </a>
      </div>
    </div>
  );
}

export default Navbar;
