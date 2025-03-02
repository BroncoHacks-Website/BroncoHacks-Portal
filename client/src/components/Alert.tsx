import { useState } from "react";
import "../index.css"

function Alert ({msg, function1, message1, function2, message2} : { msg: string; function1: () => void; message1: string; function2?: () => void; message2?: string }) {

    const [open, setOpen] = useState(true)

    const handleTheButton1 = () => {
        function1()
        setOpen(false)

    }
    const handleTheButton2 = () => {
        if (function2)
            function2()
        setOpen(false)
    }

    if (!open) return null
    

    return (
        <>
            <div className="z-1000 absolute inset-0 flex items-center justify-center w-[100vw] h-[100vh] bg-black/50 pt-10">
                <div className="relative p-6 bg-white rounded-lg w-[40vw] h-[12vh] md:h-[20vh] flex flex-col justify-between shadow-xl before:absolute before:inset-0 before:-m-1 before:rounded-lg before:bg-gradient-to-r before:from-green-500 before:to-indigo-400
                before:-z-10 before:content-[''] before:mask before:mask-outset-2 before:mask-rounded-lg ">
                    <h1>{msg}</h1>
                    <div className={`flex ${function2 ? 'justify-around':'justify-center'}`}>
                        <button className="relative overflow-hidden bg-blue-400 rounded-[20px] h-[3vh] w-[10vw] anmat-th-bttn-gng" onClick={handleTheButton1}>{message1}</button>
                        {function2 && (
                            <button className="relative overflow-hidden bg-blue-400 rounded-[20px] h-[3vh] w-[10vw] anmat-th-bttn-gng" onClick={handleTheButton2}>{message2}</button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Alert