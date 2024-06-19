import * as React from 'react';
import type { Metadata } from 'next';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import LowerCont from '@/components/dashboard/allsites/lower-cont';
import { Box } from '@mui/material';

export const metadata = { title: `Manage Sites | ${config.site.name}` } satisfies Metadata;


export default function Page(): React.JSX.Element {
  return (
    <Box sx={{p:3}}>
      <Typography variant="h2">Manage Sites</Typography>
      <LowerCont/>
    </Box>
  );
}

