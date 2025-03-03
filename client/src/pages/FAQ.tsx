function FAQ() {
  return (
    <>
      <div className="min-h-[85vh] w-[100vw] bg-indigo-300 flex items-center justify-center">
        <div className="min-h-[75vh] w-[65vw] lg:h-[70vh] lg:w-[75vw] bg-white rounded-2xl shadow-lg shadow-black/75 backface-hidden my-5">
          <div className="text-center">
            <p className="font-bold text-[36px] pt-5">FAQs</p>
          </div>
          <div className="text-[13px] md:text-[14px] lg:text-[18px] px-5">
            <p className="font-bold ">
              Q: I don't know anybody to do the hackathon with but I need at
              least 2 members:
            </p>
            <p>
              A: Fill out this{" "}
              <a
                className="text-blue-500 hover:text-blue-300"
                href="https://forms.gle/yhRtWhHncg8cWiqh7"
                target="_blank"
                rel="noopener noreferrer"
              >
                google form
              </a>{" "}
              and we will help you find a team to register with!
            </p>
            <p className="font-bold pt-3">Q: How do I join a team?</p>
            <p>
              A: Have somebody create an account and create a team. In the team
              page, the access code you can use to join a team will be listed
              under the team name.
            </p>
            <p className="font-bold pt-3">
              Q: How do I know if I'm officially registered for the hackathon?
            </p>
            <p>
              A: Once you have created a team, press the "Submit Application
              button" your application will be reviewed ~48 hours. Once you were
              approved, you will recieve and email, your team page will have a
              status = approved, and you team should be seen here:
              [broncohacks.org]
            </p>
            <p className="font-bold pt-3">
              Q: I have a bug, who should i contact?
            </p>
            <p>
              A: you can email cppbroncohacks@gmail.com with any problems you
              may have. Alternatively, you can message .thedaniel on discord.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default FAQ;
