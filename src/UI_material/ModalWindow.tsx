import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ButtonIcon from "../UI/buttons/ButtonIcon";
import {iconsRef} from "../utils/iconsRef";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    borderRadius: 1,
    boxShadow: 24,
    paddingTop: '2px',
    paddingBottom: '2px',
};

export default function ModalWindow({isOpen, handleOpen, handleClose, title}:{isOpen:boolean, handleOpen:()=>void, handleClose:()=>void, title?: string}) {


    const Header = () =>
        <div className={"w-full h-[50px] items-center justify-between flex flex-row"}>
            <div>
                <p>Title</p>
            </div>
            <ButtonIcon icon={iconsRef.cross} onClick={function(e: React.FormEvent<Element>): void {
                throw new Error('Function not implemented.');
            } }/>
        </div>

    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={isOpen}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isOpen}>
                    <Box sx={style}>
                        <Header />
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Text in a modal
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
