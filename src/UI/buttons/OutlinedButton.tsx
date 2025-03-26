import { useState } from 'react';

interface ButtonProps {
    text: string;
    onClick: (e: React.FormEvent) => void;
    color?: string;
}

const OutlinedButton = ({ text = '', onClick = () => console.log(""), color = '#4f4f4f' }: ButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // Function to darken a color
    const darkenColor = (hex: string, percent: number) => {
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);

        r = Math.max(0, Math.min(255, r - (r * percent) / 100));
        g = Math.max(0, Math.min(255, g - (g * percent) / 100));
        b = Math.max(0, Math.min(255, b - (b * percent) / 100));

        return `rgb(${r}, ${g}, ${b})`;
    };

    const buttonStyles = {
        base: {
            width: '100%',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'solid 1px',
            backgroundColor: 'transparent',
            color: 'black',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: 'scale(1)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            fontFamily: "Roboto",
            fontWeight: '500',
            alignSelf: 'center',
            justifySelf: 'center'
        },
        hover: {
            backgroundColor: darkenColor(color, 20), // Darkens only the background
        },
        clicked: {
            transform: 'scale(0.95)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }
    };

    return (
        <button
            type="button"
            style={{
                ...buttonStyles.base,
                ...(false ? buttonStyles.hover : {}),
                ...(isClicked ? buttonStyles.clicked : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={() => setIsClicked(true)}
            onMouseUp={() => setIsClicked(false)}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default OutlinedButton;
