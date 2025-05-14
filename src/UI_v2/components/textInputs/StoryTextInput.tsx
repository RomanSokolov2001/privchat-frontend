import {TextField} from "@mui/material";

const StoryTextInput = ({value, onChange}:{value: string, onChange:  any}) => {
    return (
        <TextField
            id="outlined-textarea"
            label="Paste the text here. Maximum 1000 characters"
            placeholder="Placeholder"
            onChange={onChange}
            sx={{width: '100%'}}
            multiline
        />
    )
}

export default StoryTextInput;
