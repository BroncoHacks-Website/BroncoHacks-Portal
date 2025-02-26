import { Link } from "react-router";
import { useState } from "react";


function CreateAccount() {
	const [isFlipped, setIsFlipped] = useState(false)

	const handleFlip = () => {
		setIsFlipped(!isFlipped)
	}

	return (
		<>
			<body className="bg-indigo-300 h-[85vh] flex flex-col items-center justify-center">
				<div className="group h-[625px] w-[250px] md:w-[365px] [perspective:1000px]">
					{/*Actual card that is going to be flipped around*/}
					<div className={`absolute inset-0 w-full h-full [transform-style:preserve-3d] transition-all duration-500 ${isFlipped ? "rotate-y-180" : ""}`}>
						<div className={`flex flex-col gap-4 items-center h-[625px] w-[250px] md:w-[365px] m-auto rounded-xl bg-white shadow-lg shadow-black/75 backface-hidden `}>
							<h1 className="text-3xl font-bold m-10 md:text-5xl">Welcome🐴</h1>
							<div className="flex flex-col gap-3 md:flex-row justify-between w-[90%]">
								<div className="first">
									<p>First Name</p>
									<input type="text" className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%] md:w-[80%]" />
								</div>
								<div className="last">
									<p>Last Name</p>
									<input type="text" className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%] md:w-[80%]" />
								</div>
							</div>
							<div className="flex flex-col gap-3 w-[90%] items-start">
								<p>Email</p>
								<input type="text" className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]" />
								<p>Password</p>
								<input type="password" className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]" />
								<p>Confirm Password</p>
								<input type="password" className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]" />
							</div>
							<button className="h-[60px] w-[140px] md:mt-7 font-bold text-3xl text-white/90 rounded-xl bg-green-300 shadow-lg shadow-black/50 hover:bg-green-400 active:shadow-none active:scale-95 active:translate-y-1 transition-transform duration-150 ease-out" onClick={handleFlip}>Next</button>
							<div className="flex flex-col items-center text-sm">
								<p className="">Already have an Account?</p>
								<Link className="text-purple-500" to={{ pathname: "/Login" }}>Login</Link>
							</div>
						</div>

						<div className={`absolute inset-0 flex flex-col gap-4 items-center h-[625px] w-[250px] md:w-[365px] m-auto rounded-xl bg-white shadow-lg shadow-black/75 rotate-y-180 backface-hidden  `} >
							<h1 className="text-3xl font-bold m-10 md:text-5xl">🐴</h1>
							<div className="flex flex-col gap-3 w-[90%] items-start">
								<p>Discord Name</p>
								<input type="text" className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]" />
								<p>School</p>
								<input type="text" className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]" />
								<p>Miscellaneous</p>
								<input type="text" className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]" />
								<p>Extra</p>
								<input type="text" className="border-b-2 focus:border-indigo-300 focus:outline-none w-[92%]" />
							</div>
							<button className="h-[60px] w-[200px] md:mt-7 font-bold text-2xl text-white/90 rounded-xl bg-green-300 shadow-lg shadow-black/50 hover:bg-green-400 active:shadow-none active:scale-95 active:translate-y-1 transition-transform duration-150 ease-out">Create Account</button>
							<div className="flex flex-col items-center text-sm">
								<button className="text-purple-500" onClick={() => setIsFlipped(false)}>Back</button>
							</div>
						</div>
					</div>
				</div>
			</body>
		</>
	);
}

export default CreateAccount;
