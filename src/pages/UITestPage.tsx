import {useState} from "react";
import ModalWindow from "../UI_material/ModalWindow";

const UITestPage = () => {
    const [isModalWindowOpen, setModalWindowOpen] = useState(false);

    const handleOpen = () => setModalWindowOpen(true);
    const handleClose = () => setModalWindowOpen(false);
    return (
        <div>
            <ModalWindow isOpen={isModalWindowOpen} handleOpen={handleOpen} handleClose={handleClose}/>
        </div>
    )
}

export default UITestPage
