'use client';
import * as React from 'react';
import { Paper, Typography } from '@mui/material';
import type { Site } from '@/services/manage-sites';
import FileUpload from '../addsite/FileUpload';

interface SiteInfoProps {
    site: Site|undefined;
}

export default function SiteInfo({site}:SiteInfoProps): React.JSX.Element {
  const [files, setFiles] = React.useState<File[]>([]);
  
  return (
    <Paper sx={{p:2, width:{ xs:1, md: '40%' },minHeight:"60vh"}} elevation={10}>
        <Typography variant='h5' sx={{mb:2}}>Site Info</Typography>
        <FileUpload files={files} setFiles={setFiles} height='28vh'/>
    </Paper>
  );
}