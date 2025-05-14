import {Alert} from "@mui/material";
import {useEffect, useState} from "react";

interface ErrorAlertProps {
    error: string;
    removeError: () => void;
}

const ErrorAlert = ({error, removeError}: ErrorAlertProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (error) {
            setVisible(true);
            // sleep
            setVisible(false);
            removeError();
        }
    }, [error])

    return (
        <div>
            <Alert severity="error">This is an error Alert.</Alert>
        </div>
    )
}

export default ErrorAlert;
