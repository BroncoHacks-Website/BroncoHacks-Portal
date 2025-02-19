function Navbar() {
  return (
    <>
      <div className="flex flex-row h-[15vh] border-1 py-4">
        <img
          src="BroncoHacksSquareLogo.png"
          className="h-[10vh] w-[10vh]"
        ></img>
        <div className="bolded text-5xl my-auto">BroncoHacks Portal</div>
        <button className="my-auto">Edit Profile</button>
        <a className="my-auto text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-2xl rounded-full text-sm text-center">
          Back to Webiste
        </a>
      </div>
    </>
  );
}

export default Navbar;
