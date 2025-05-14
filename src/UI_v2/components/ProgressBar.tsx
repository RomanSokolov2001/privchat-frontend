import {Box, LinearProgress, LinearProgressProps} from "@mui/material";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import BigLabel from "./labels/BigLabel";

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    // @ts-ignore
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                {/* @ts-ignore*/}
                <LinearProgress variant="determinate" {...props} sx={{height: '20px', borderRadius: '10px'}} color={'greeny'} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', fontSize: '40px', fontWeight: 'bold' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

export default function ProgressBar() {
    const [progress, setProgress] = useState(10);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            {/* @ts-ignore */}
            <BigLabel label="In Progress" color={'#595959'} />
            <LinearProgressWithLabel value={progress} />
        </Box>
    );
}
