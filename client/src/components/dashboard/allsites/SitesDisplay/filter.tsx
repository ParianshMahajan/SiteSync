import * as React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface CheckProps {
  title: string;
  disabled: boolean;
  IsSelect: boolean;
  setSelect: (IsSelect: boolean) => void;
}

export default function Filter({ title, IsSelect, disabled, setSelect }: CheckProps): React.JSX.Element {
  function handleClick(): void {
    setSelect(!IsSelect);
  }

  return (
    <Paper elevation={0} >
      <Button
        variant={IsSelect ?'contained':"outlined"}
        sx={{transition:"ease-in-out 150ms",width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"center",px:"10px",py:"8px",gap:"7px"}}
        onClick={() => {
          handleClick();
        }}
        disabled={disabled}
      >
        <Typography variant="h6" sx={{fontSize:{md:15,xs:12}}}>{title}</Typography>
        <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:{md:20,xs:12}}}>
          {IsSelect ? <CheckBoxIcon fontSize='small' /> : <CheckBoxOutlineBlankIcon fontSize='small' />}
        </Box>
      </Button>
    </Paper>
  );
}
