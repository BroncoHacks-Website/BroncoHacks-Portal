function Team() {
  return (
    <>
      <div className="bg-[#c3d3eb] h-[85vh] flex flex-col sm:flex-row justify-center">
        {/* create your team tab */}
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center">
          <div className="bg-white h-[35vh] w-[80vw] md:h-[45vh] md:w-[40vw] rounded-2xl border-lg shadow-lg mx-auto text-center">
            <img
              src="horse.png"
              alt="single user default image"
              className="h-[15vh] w-[15vh] mx-auto scale-50"
            />
            <div className="flex items-center justify-center font-black text-3xl">
              <h1>Create a Team</h1>
            </div>

            <div className="flex items-center justify-center font-black pt-2">
              <label className="">Select a Team Name: </label>
              <input type="text" className="border-b-1 ml-2 pl-2" />
            </div>
            <div className="flex items-center justify-center my-2">
              <input
                type="submit"
                value="Create New Team"
                className="bg-[#97d9c3] h-[5vh] w-[40vw] rounded-xl text-white font-bold shadow-lg hover:cursor-pointer"
              />
              <br />
              <br />
            </div>
          </div>
          <div className="md:hidden">---------------or---------------</div>
          {/* join team via code tab */}
          <div className="bg-white h-[35vh] w-[80vw] md:h-[60vh] md:w-[40vw] rounded-2xl border-lg shadow-lg mx-auto text-center">
            <img
              src="group.png"
              alt="single user default image"
              className="h-[15vh] w-[15vh] mx-auto"
            />
            <div className="flex items-center justify-center font-black text-3xl">
              <h1>Join Team via Code</h1>
            </div>

            <label htmlFor="">Enter Code: </label>
            <input type="text" className="border-b-1 ml-2 pl-2" />

            <div className="flex items-center justify-center my-5">
              <input
                type="submit"
                value="Join"
                className="bg-[#97d9c3] h-[5vh] w-[40vw] rounded-xl text-white font-bold shadow-lg hover:cursor-pointer"
              />
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Team;
