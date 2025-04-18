import { SetStateAction, useState } from "react";

import {RootState} from "../../../redux/store";
import {useSelector} from "react-redux";
import { MessengerAPI } from "../../../api/MessengerAPI";

import { iconsRef } from "../../../utils/iconsRef";

import IconButton from '../../icons/IconButton/IconButton'
import './styles.css'


const SearchBar = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [input, setInput] = useState('')

    async function handleSendingRequest() {
        if (!user) return;
        await MessengerAPI.sendChatRequest({ requestedNickname: input, requesterPublicKey: user.publicKey }, user.jwt) === 'success' && setInput('');
    }

    const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setInput(event.target.value);
    };

    return (
            <div className="flex flex-row bg-[#f2f2f2] rounded-md search-container pt-2 pb-2">
                <input
                    value={input}
                    onChange={handleChange}
                    placeholder="Nickname..."
                    className="custom-input"
                    style={{
                        color: "black",
                        backgroundColor: "#f2f2f2",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        paddingTop: '5px',
                        paddingBottom: '5px',
                        outline: "none",
                        marginRight: "8px",
                        width: 180,
                    }}
                />
                <IconButton imgSrc={iconsRef.plus} onClick={handleSendingRequest} />
            </div>
    );
};

// const IconButton = ({ icon, onClick }: { icon: string, onClick: () => void }) => {
//     const size = 35;
//
//     return (
//         <div className="clickable" onClick={onClick}>
//             <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width={size}
//                 height={size}
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="icon"
//             >
//                 <line x1="5" y1="12" x2="19" y2="12"></line>
//                 <line x1="12" y1="5" x2="12" y2="19"></line>
//             </svg>
//         </div>
//     );
// };


export default SearchBar;
