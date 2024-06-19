import * as React from 'react';
import Box from '@mui/material/Box';


interface DisabledProps {
  children: React.ReactNode;
  disabled?: boolean;
}

export default function Disabled({ children,disabled }: DisabledProps): React.JSX.Element {
  return (
      <Box
        sx={{
          opacity: disabled ? 0.25 : 1,
          pointerEvents: disabled ? "none" : "initial"    
        }}
      >
              {children}
      </Box>
  );
}
