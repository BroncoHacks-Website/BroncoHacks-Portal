import { useState } from "react";

const TeamMember = ({
        nm, 
        idnum
    }: {
        nm: string;
        idnum: number;
    }) => {
    
    const [memberName, setMemberName] = useState(nm);
    const [id, setID] = useState(idnum);
    
    const toggleOptions = () => {

    }

    if (memberName == "") {
        return(
            <div id='team-member' className="w-[100%] h-[8.5%] max-h-[8.5%] flex flex-row items-center mb-3">
                <p className="ml-4 font-bold text-xl">Member:</p>
            </div>
        )
    } else {
        return (
            <div id='team-member' className="w-[100%] h-[10%] max-h-[8.5%] flex flex-row items-center mb-3">
                <p className="ml-4 font-bold text-xl">Member: {memberName}</p>
                <button className='w-[10%] h-[80%] border border-black ml-3 mr-2 bg-[#83dac0] text-white text-lg rounded-lg shadow-sm hover:bg-[#2fb38b] font-medium overflow-hidden' id='view-profile'>View Profile</button>
                <button className='w-[10%] h-[80%] border border-black ml-2 mr-2 bg-[#83dac0] text-white text-lg rounded-lg shadow-sm hover:bg-[#2fb38b] font-medium overflow-hidden' id='make-owner'>Make Owner</button>
                <button className='w-[10%] h-[80%] border border-black ml-2 mr-2 bg-[#83dac0] text-white text-lg rounded-lg shadow-sm hover:bg-[#2fb38b] font-medium overflow-hidden' id='kick-member'>Kick Member</button>
                <button className=' invisible w-[15%] h-[80%] border border-black ml-2 mr-2 bg-[#83dac0] text-white text-lg rounded-lg shadow-sm hover:bg-[#2fb38b]' id='member-opt' onClick={toggleOptions}>Options</button>
                <div className='invisible' id='options-dropdown'>
                    <button className='opt-btn'>View Profile</button>
                    <button className='opt-btn'>Make Owner</button>
                    <button className='opt-btn'>Kick Member</button>
                </div>
            </div>
        )
    }
}

function ManageTeam() {

    const [teamName, setTeamName] = useState("Quandavius Winglebinglers")
    const [accessCode, setAccessCode] = useState("jAF75F1")
    const [owner, setOwner] = useState("JJ Redick")
    const [mem0, setMem0] = useState("LeBron James")
    const [mem1, setMem1] = useState("Luka Doncic")
    const [mem2, setMem2] = useState("Austin Reaves")

    return(<>
        <div className="h-[85vh] bg-[#C7D1EB] flex items-center justify-center">
            <div id="" className="h-[60vh] w-[77vw] pl-8 pt-4 pb-4 pr-4 bg-white rounded-4xl flex flex-col shadow-xl align-middle">
                <h1 className="self-center relative font-bold text-4xl">{teamName}</h1>
                <p className="self-center relative font-bold text-2xl">Access Code: {accessCode}</p>
                <div className="p-4 text-2xl text-[#83dac0] font-bold mb-3">Owner: {owner}</div>
                <TeamMember nm={mem0} idnum={0} />
                <TeamMember nm={mem1} idnum={1} />
                <TeamMember nm={mem2} idnum={2} />
                <button id="delete-btn" className="w-[23%] h-[8%] bg-[#EA5945] rounded-lg self-end mt-auto mb-4 mr-4 border border-black overflow-hidden text-white font-bold text-xl">Delete Team</button>
            </div>
        </div>
    </>)
}

export default ManageTeam;