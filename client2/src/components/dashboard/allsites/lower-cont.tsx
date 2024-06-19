'use client';
import * as React from 'react';
import { Box } from '@mui/material';
import DisplaySites from './SitesDisplay/disp-sites';
import type { Site } from '@/services/manage-sites';
import SiteInfo from './SitesInfo/site-info';
import { useRouter } from 'next/navigation';


export default function LowerCont(): React.JSX.Element {
    const [site,setSite]=React.useState<Site|undefined>(undefined);
    const router = useRouter();
    const refreshComponents=():void=>{
      router.refresh();
    }


  return (  
    <Box sx={{display:"flex",alignItems:"stretch",justifyContent:"center",mt:4,gap:2,flexDirection:{ xs: 'column', md: 'row' }}}>
        <DisplaySites setSite={setSite}/>
        <SiteInfo site={site} refreshComponents={refreshComponents}/>
    </Box>

  );
}

