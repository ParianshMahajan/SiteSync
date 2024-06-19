import * as React from 'react';
import Box from '@mui/material/Box';
import Particles from './particle-bg/Particles';
import { Typography } from '@mui/material';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  const url="/assets/CCS_LOGO.png";

  return (
    <>
    <Particles />
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: { xs: 'column', lg: 'row' },
        minHeight: '100%',
        position: 'relative',
        zIndex: 300,
      }}
    >


      <Box sx={{width:{xs:"100%",md:"40%"}, zIndex:23,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <Box alt="logo" component="img" src={url} width="70%" />
        <Typography variant="h1" fontWeight={500} sx={{mt:4,fontSize:{xs:"50px",lg:"80px"}}} letterSpacing={4} color="#5B5B5D">SITE SYNC</Typography>
      </Box>




      <Box width="20%" >
        {children}
      </Box>




    </Box>
    </>
  );
}
