import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import {Alert} from "@mui/material";

const AnimatedAlert = ({ isVisible = true, message = "This is a success alert", type = 'success'}: any) => {
    const styles = useSpring({
        from: {
            opacity: 0,
            transform: 'translateY(6%)'
        },
        to: {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0%)' : 'translateY(6%)'
        },
        config: {
            tension: 280,
            friction: 20
        }
    });

    if (!isVisible) return null;

    return (
        // @ts-ignore
        <animated.div
            style={styles}
            className="w-full max-w-md mx-auto p-4 bg-green-100 rounded-lg shadow-md flex items-center"
        >
            <Alert variant="filled" severity={type}>
                {message}
            </Alert>

        </animated.div>
    );
};

export default AnimatedAlert;
