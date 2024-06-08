"use client";

import * as React from 'react';
import FileUpload from './FileUpload';
import { Box } from '@mui/material';



export default function SiteForm(): React.JSX.Element {
    const [files, setFiles] = React.useState<File[]>([]);

    return(
        <Box sx={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <FileUpload setFiles={setFiles}/>

        </Box>
    )
}