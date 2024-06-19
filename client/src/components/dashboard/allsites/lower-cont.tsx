'use client';
import * as React from 'react';
import { Box } from '@mui/material';
import DisplaySites from './SitesDisplay/disp-sites';
import type { Site } from '@/services/manage-sites';
import SiteInfo from './SitesInfo/site-info';


export default function LowerCont(): React.JSX.Element {
    const [site,setSite]=React.useState<Site|undefined>(undefined);
    const [reset,setReset]=React.useState(false);
    const refreshComponents=():void=>{
      setReset(true);
    }


  return (  
    <Box sx={{display:"flex",alignItems:"stretch",justifyContent:"center",mt:4,gap:2,flexDirection:{ xs: 'column', md: 'row' }}}>
        <DisplaySites siteId={site?._id} reset={reset} setReset={setReset} setSite={setSite}/>
        <SiteInfo site={site} refreshComponents={refreshComponents}/>
    </Box>

  );
}

