import {Button} from "@mui/material";

interface FilledButtonProps {
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
}


export default function FilledButton({
                                         label = "Button",
                                         onClick = () => {},
                                         disabled = false
                                     }: FilledButtonProps) {
    return (
        <Button
            disabled={disabled}
            onClick={onClick}
            variant="contained"
            size="large"
            sx={{borderRadius: "50px", paddingX: "30px"}}
            color="primary"
        >
            {label}
        </Button>
    );
}
