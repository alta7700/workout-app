import React, {useEffect, useRef} from 'react';

const ModalWindow = ({children, closeModal}) => {

    const formRef = useRef()

    useEffect(() => {
        const closeOnEsc = (e) => e.key === "Escape" && closeModal()
        document.addEventListener('keydown', closeOnEsc, {once: true, passive: true})
    }, [])

    return (
        <div
            ref={formRef}
            style={{
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(126, 126, 126, 0.49)",
                backdropFilter: "blur(3px)",
                overflowY: "scroll"
            }}
            onClick={(e) => e.target === formRef.current && closeModal()}
        >
            {children}
        </div>
    );
};

export default ModalWindow;