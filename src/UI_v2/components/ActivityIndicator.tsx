import React, {useState} from "react";
import {Box, CircularProgress} from "@mui/material";
import BigLabel from "./labels/BigLabel";

export default function ActivityIndicator({isLoading}: {isLoading: boolean}) {

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* @ts-ignore */}
            <BigLabel label={isLoading ? 'In Progress' : 'Done}'} color={'#595959'}/>
            {/* @ts-ignore*/}
            {isLoading && <CircularProgress size={60}/>}
        </Box>
    );
}
