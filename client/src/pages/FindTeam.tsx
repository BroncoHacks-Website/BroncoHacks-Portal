function FindTeam() {
  return (
    <>
      <div className="bg-[#c3d3eb] h-[85vh] flex flex-col">
        <div className="grid lg:grid-cols-2 md:grid-cols-1 xs:mx-4 gap-4 mx-auto mt-10 text-2xl">
          {/* create your team tab */}
          <div className="bg-white px-30 py-8 rounded-2xl border-lg shadow-lg mx-10 text-center">
            <img
              src="horse.png"
              alt="single user default image"
              className="h-[40vh] w-[40vh] mx-auto scale-50"
            />
            <div className="flex items-center justify-center font-black text-4xl">
              <h1>Create Your Team</h1>
            </div>
            <form action="">
              <div className="flex items-center justify-center font-black my-6 text-xl">
                <label htmlFor="">Enter your Team Name: </label>
                <input type="text" className="border-b-1 ml-2 pl-2" />
              </div>
              <div className="flex items-center justify-center my-5">
                <input
                  type="submit"
                  value="Create New Team"
                  className="bg-[#97d9c3] py-3 px-9 rounded-xl text-white font-bold shadow-lg hover:cursor-pointer"
                />
                <br />
                <br />
              </div>
            </form>
          </div>

          {/* join team via code tab */}
          <div className="bg-white px-30 py-8 rounded-2xl border-lg shadow-lg mx-10 text-center">
            <img
              src="group.png"
              alt="single user default image"
              className="h-[40vh] w-[40vh] mx-auto"
            />
            <div className="flex items-center justify-center font-black text-4xl">
              <h1>Join Team via Code</h1>
            </div>
            <form action="">
              <div className="flex items-center justify-center font-black my-6 text-xl">
                <label htmlFor="">Enter Code: </label>
                <input type="text" className="border-b-1 ml-2 pl-2" />
              </div>
              <div className="flex items-center justify-center my-5">
                <input
                  type="submit"
                  value="Join"
                  className="bg-[#97d9c3] py-3 px-9 rounded-xl text-white font-bold shadow-lg hover:cursor-pointer"
                />
                <br />
                <br />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default FindTeam;
