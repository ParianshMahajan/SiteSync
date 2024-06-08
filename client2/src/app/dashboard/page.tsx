import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { Box, Typography } from '@mui/material';
import SiteForm from '@/components/dashboard/overview/SiteForm';

export const metadata = { title: `Add Site | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Box sx={{padding:"2%"}}>
      <Typography variant='h1'>SiteSync</Typography>

      <Box mt={4}>
        <SiteForm/>
        
      </Box>

    </Box>
  );
}
