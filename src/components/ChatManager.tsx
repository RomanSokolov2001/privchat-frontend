import {useMessenger} from "../context/MessengerContext";
import {useUser} from "../context/UserContext";
import {getOpponentNickname} from "../utils/functions";
import {iconsRef} from "../utils/iconsRef";
import Icon from "./Icon";
import IconButtonFilled from "../ui/icons/IconButtonFilled/IconButtonFilled";
import IconButton from "../ui/icons/IconButton/IconButton";
import ModalWindow from "../ui/ModalWindow/ModalWindow";
import {useState} from "react";
import ModalWindowFilled from "../ui/ModalWindow/ModalWindowFilled";
import SetTimer from "./SetTimer";
import AnimatedButton from "./Button";
import DropdownMenu from "../ui/DropdownMenu";
import {FormControl, FormHelperText, MenuItem, Select, SelectChangeEvent} from "@mui/material";

interface ChatManagerProps {
};

interface TimeOption {
    display: string,
    s: number;
}

const ChatManager = ({}: ChatManagerProps) => {
    const [currentAction, setCurrentAction] = useState('');
    const {currentChat, isMobile} = useMessenger();
    const {user} = useUser()
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTimer, setSelectedTimer] = useState<string>('')

    const timeOptions: TimeOption[] = [
        { display: '5 seconds', s: 5 },
        {  display: '15 seconds', s: 15 },
        {  display: '1 minute', s: 60 },
        {  display: '5 minute', s: 300 },
        {  display: '30 minutes', s: 1800 },
        {  display: '1 hour', s: 3600 }
    ];

    function handleClose() {
        setIsOpen((prev) => !prev);
        setCurrentAction('');
    }

    const handleChange = (event: SelectChangeEvent) => {
        setCurrentAction('')
        setSelectedTimer(event.target.value);
    };

    const ConfirmElemnt = () => {
        if (currentAction) {return (
            <div className={'w-full flex flex-col justify-end h-[200px] overflow-hidden'}>
                <a className='text-xl font-semibold pl-4 pr-4'>{`Are you sure want to ${currentAction} chat?`}</a>
                {<div className="flex items-center flex-row justify-between w-full p-2 gap-4">
                    <AnimatedButton text={"Yes"} onClick={() => {
                    }} color={'#a32f2f'}/>
                    <AnimatedButton text={"Cancel"} onClick={() => {
                    }} color={'#bababa'}/>
                </div>}
            </div>
        )}
        else if (selectedTimer) {return (
            <div className={'w-full flex flex-col justify-end h-[200px] overflow-hidden'}>
                <a className='text-xl font-semibold pl-4 pr-4'>{`Set ${selectedTimer} delete timer?`}</a>
                {<div className="flex items-center flex-row justify-between w-full p-2 gap-4">
                    <AnimatedButton text={"Yes"} onClick={() => {
                    }} color={'#a32f2f'}/>
                    <AnimatedButton text={"Cancel"} onClick={() => {
                    }} color={'#bababa'}/>
                </div>}
            </div>
        )}
        return <></>
    }

    if (currentChat) return (
        <div className="p-1 bg-white flex justify-center align-center items-center w-full">
            <a className={`${isMobile ? 'text-xl' : 'text-2xl'} ml-2`}>
                Chat with:
                <a className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold ml-2`}>
                    {getOpponentNickname(user, currentChat)}</a>
            </a>
            <IconButtonFilled imgSrc={iconsRef.settings} onClick={() => setIsOpen(true)}/>
            <IconButton imgSrc={iconsRef.cross}/>
            {isOpen &&
                <ModalWindowFilled isVisible={isOpen} toggleVisible={handleClose} text={"Fuck"}
                                   header={"Chat Settings"}>
                    <div className='flex items-start justify-center flex-col p-2 gap-3 pl-5 pr-5 w-[350px] h-[360px]'>
                        <div className='flex items-center flex-row justify-between w-full'>
                            <a className='text-xl font-[400]'>Clear chat: </a>
                            <IconButton imgSrc={iconsRef.brush} onClick={() => setCurrentAction('delete')}/>
                        </div>
                        <div className='flex items-center flex-row justify-between w-full'>
                            <a className='text-xl font-[400]'>Delete chat: </a>
                            <IconButton imgSrc={iconsRef.bin} onClick={() => setCurrentAction('clear')}/>
                        </div>
                        <div className='flex items-center flex-row justify-between w-full'>
                            <a className='text-xl font-[400]'>Set Timer</a>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    value={selectedTimer}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="None">
                                        <em>None</em>
                                    </MenuItem>
                                    {timeOptions.map((option: TimeOption) => <MenuItem value={option.display}>{option.display}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </div>

                            <ConfirmElemnt/>

                    </div>


                </ModalWindowFilled>
            }
        </div>
    )
    return <></>
}

export default ChatManager;
