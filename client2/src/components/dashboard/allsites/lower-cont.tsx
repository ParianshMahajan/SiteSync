'use client';
import * as React from 'react';
import { Box } from '@mui/material';
import DisplaySites from './disp-sites';
import SiteInfo from './site-info';


export default function LowerCont(): React.JSX.Element {
  return (  
    <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",mt:4,gap:2,flexDirection:{ xs: 'column', md: 'row' }}}>
        <DisplaySites/>
        <SiteInfo/>
    </Box>

  );
}

