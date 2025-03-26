import React, { useState } from 'react';
import CustomIcon from '../icons/CustomIcon';

interface ButtonProps {
    icon: string
    onClick: (e: React.FormEvent) => void
}

const ButtonIcon = ({ icon, onClick = () => console.log("") }: ButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    return (
        <button
            type="button"
            style={{
                ...buttonStyles.base,
                ...(isHovered ? buttonStyles.hover : {}),
                ...(isClicked ? buttonStyles.clicked : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={() => setIsClicked(true)}
            onMouseUp={() => setIsClicked(false)}
            onClick={onClick}
        >

            <img
        src={icon}
        width={30}
        height={30}
        />
        </button>
    );
};

export default ButtonIcon

const buttonStyles = {
    base: {
        padding: '7px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#333333',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        fontFamily: "Roboto",
        fontWeight: '500',
        alignSelf: 'center',
        justifySelf: 'center',

    },
    hover: {
        backgroundColor: '#383838'
    },
    clicked: {
        transform: 'scale(0.95)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }
};

