

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function Modal({ isOpen, onClose}: ModalProps) {
  if(!isOpen) return null;



  return(
    <>
      <div className="fixed z-20 w-full h-full flex items-center">
        {/* dark background */}
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center" onClick={onClose}>
          {/* modal content */}
          <div className="relative bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            {/* modal header */}
            <div className="flex justify-center justify-between px-4 pt-4 md:p-5 rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-4xl font-semibold text-gray-900">
                  🐴
                </h3>
            </div>
            {/* modal body */}
            <div className="p-4 sm:p-5 space-y-4">
              <form>
                <div className="">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    className="sm:text-xl border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter First Name"
                    />
                </div>
                <div>
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    className="border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter Last Name"
                    />
                </div>
                <div>
                  <label>School</label>
                  <input 
                    type="text" 
                    className="border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter School"
                    />
                </div>
                <div>
                  <label>Discord</label>
                  <input 
                    type="text" 
                    className="border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter Discord"
                    />
                </div>
                <div>
                  <label>Password</label>
                  <input 
                    type="text" 
                    className="border-b-2 focus:border-indigo-300 focus:outline-none w-[95%] mb-3"
                    placeholder="Enter Password"
                    />
                </div>

                <div className="flex justify-center">
                  <button 
                  data-modal-hide="default-modal" 
                  type="button" 
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-white focus:outline-none bg-[#97d9c3] shadow-lg rounded-lg border border-gray-200 hover:cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                  Save
                  </button>
                </div>
              </form>

            </div>
            {/* modal footer */}
            {/* <div className="flex justify-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              
            </div> */}
        </div>
        </div>
      </div>
    </>
  )
}

export default Modal;