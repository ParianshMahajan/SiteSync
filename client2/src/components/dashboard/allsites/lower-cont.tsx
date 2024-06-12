'use client';
import * as React from 'react';
import { Box } from '@mui/material';
import DisplaySites from './disp-sites';
import SiteInfo from './site-info';
import type { Site } from '@/services/manage-sites';


export default function LowerCont(): React.JSX.Element {
    const [site,setSite]=React.useState<Site|undefined>(undefined);
  return (  
    <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",mt:4,gap:2,flexDirection:{ xs: 'column', md: 'row' }}}>
        <DisplaySites setSite={setSite}/>
        <SiteInfo site={site}/>
    </Box>

  );
}

