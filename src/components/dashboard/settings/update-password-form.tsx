'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import type { AxiosError, AxiosResponse } from 'axios';
import type { ErrorResponse } from '@/services/auth';
import { useUpdatePassword } from '@/hooks/mutations/use-manage-sites';
import { Alert, FormGroup, Snackbar, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import type { SuccessResponse } from '@/services/manage-sites';

export function UpdatePasswordForm(): React.JSX.Element {

  
  const [data, setData] = React.useState({
    password: '',
    confirmPassword: '',
  })
  const [err,setErr]=React.useState({
    password:"",
    confirmPassword:""
  });
  

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData({...data,password:e.target.value});
    if (e.target.value.length < 8) {
      setErr({...err,password:"Password must be at least 8 characters long"});
    } else {
      setErr({...err,password:""});
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData({...data,confirmPassword:e.target.value});
    if (e.target.value !== data.password) {
      setErr({...err,confirmPassword:"Passwords do not match"});
    } else {
      setErr({...err,confirmPassword:""});
    }
  }
  
  

  const [result,setResult]=React.useState({
    success:false,
    error:""
  });
  

  const ResetSnackBar = (event?: React.SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }
    setResult({success:false,error:""});
  };


  const onSuccess=(res:AxiosResponse<SuccessResponse>):void=>{
    setResult({success:true,error:""});
    localStorage.setItem('custom-auth-token', res.data.access);
    setTimeout(()=>{
      setData({password:"",confirmPassword:""});
    },1500);
  }
  const onError=(error:AxiosError<ErrorResponse>):void=>{
    setResult({success:false,error:error?.response?.data?.message ||"An error occured"});
  }

  const {mutate:UpdatePassword,isPending}=useUpdatePassword({onSuccess,onError});

  const handleSubmit=(e:React.FormEvent<HTMLFormElement>):void=>{
    e.preventDefault();
    UpdatePassword({
      password:data.password,
    });
  }


  return (
    <>
    <form
      onSubmit={handleSubmit}
      >
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormGroup>
              <TextField label="Password" name="password" type="password" 
                error={err.password!==""} value={data.password} onChange={handlePasswordChange} helperText={err.password}
              />

            </FormGroup>
            <FormGroup>
              <TextField label="Confirm password" name="confirmPassword" type="password" error={err.confirmPassword!==""} value={data.confirmPassword} onChange={handleConfirmPasswordChange} helperText={err.confirmPassword} />
            </FormGroup>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <LoadingButton loading={isPending} disabled={err.confirmPassword!==""||err.password!==""||data.password!==data.confirmPassword||data.password===""} type='submit' variant="contained">Update</LoadingButton>
        </CardActions>
      </Card>
    </form>
    
    <Snackbar open={result.error!==""||result.success} autoHideDuration={2500} onClose={ResetSnackBar}>
        <Alert onClose={ResetSnackBar} variant="filled" severity={result.success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {result.success ? "Password Updated Successfully": result.error}
        </Alert>
      </Snackbar>
    </>
  );
}
