interface ModalProps {
  onClose: () => void;
  caption: string;
  src: string;
  alt: string;
}

function Modal({onClose, caption, src, alt}: ModalProps) {

  return (
    <>
      <div 
        className="fixed z-20 w-full h-full flex items-center">
        {/* dark background */}
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center"
          onClick={onClose}>
          {/* Content */}
          <div 
            className="flex flex-col relative bg-white rounded-lg shadow-lg md:w-xl lg:w-2xl xl:w-5xl"
            onClick={(e) => e.stopPropagation()}>
            {/* head */}
            <h1 className="flex justify-center font-bold p-2 ">{caption}</h1>
            {/* body/image */}
            <img 
              src={src} 
              alt={alt} 
              className="m-2"/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal;