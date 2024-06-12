'use client';

import * as React from 'react';
import type { ErrorResponse } from '@/services/auth';
import type { SuccessResponse } from '@/services/upload';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, CircularProgress, FormGroup, LinearProgress, Link, Paper, Snackbar, TextField, Typography } from '@mui/material';
import type { AxiosError, AxiosResponse } from 'axios';
import JSZip from 'jszip';

import { useSiteAvailable, useUpload } from '@/hooks/mutations/use-upload';
import CheckboxSelect from '@/components/core/checkbox-select';
import Disabled from '@/components/core/disabled';

import FileUpload from './FileUpload';


const ensureUrlScheme = (url: string):string => {
  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`;
  }
  return url;
};



export default function SiteForm(): React.JSX.Element {
  const [files, setFiles] = React.useState<File[]>([]);

  const [data, setData] = React.useState({
    fname: '',
    framework: false,
  });

  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [siteName, setSiteName] = React.useState('');

  const [success, setSuccess] = React.useState(false);

  const [dispError, setDispError] = React.useState({
    fname: false,
    deploy: '',
  });


  
  const frameworkHandler = (IsSelect: boolean): void => {
    setData({ ...data, framework: IsSelect });
  };

    
  const onSuccessSiteAvailable = async (): Promise<void> => {
    setDispError({ ...dispError, fname: false });
  };

  const onErrorSiteAvailable = (): void => {
    setDispError({ ...dispError, fname: true });
  };
  const { mutate: siteCheck, isPending:isSiteAvailable } = useSiteAvailable({ onSuccess:onSuccessSiteAvailable, onError:onErrorSiteAvailable });


  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData({ ...data, [e.target.name]: e.target.value.toLowerCase() });
    const name = e.target.value.toLowerCase();
    siteCheck({ name });
  };

  let totalSize = 0;

  const zipFolder = async (): Promise<Blob> => {
    const zip = new JSZip();
    const selectedDirectory = files[0].webkitRelativePath.split('/')[0];

    for (const file of files) {
      const filePath = file.webkitRelativePath;
      if (filePath.startsWith(`${selectedDirectory}/`)) {
        zip.file(filePath.substring(selectedDirectory.length + 1), file);
        totalSize += file.size;
      }
    }
    return await zip.generateAsync({ type: 'blob' });
  };



  
  const onSuccess = async (res: AxiosResponse<SuccessResponse>): Promise<void> => {
    setUploadProgress(0);
    setSiteName(res.data.site);
    setSuccess(true);
  };

  const onError = (error: AxiosError<ErrorResponse>): void => {
    setDispError({ ...dispError, deploy: error.message });
  };
  const { mutate: deploySite, isPending } = useUpload({ onSuccess, onError });


  const ResetSnackBar = (event?: React.SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }
    setDispError({ ...dispError, deploy: '' });
    setSuccess(false);
  };


  const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const zipFile = (await zipFolder()) as File;
    const formData = new FormData();
    formData.append('file', zipFile);

    formData.append('data', JSON.stringify(data));
    deploySite({ formData, totalSize, setUploadProgress });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Box width={1}>
        <FileUpload files={files} setFiles={setFiles}  height='40vh'/>
      </Box>

      <Paper sx={{ px: 4, pt: 4, pb: 6, width: 1 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Deploy Site
        </Typography>
        <form onSubmit={SubmitHandler}>
          <Disabled disabled={files.length <= 0}>
            <FormGroup sx={{ width: '70%',display:"inline" }}>
              <TextField
                label="Site-Name"
                onChange={onChangeHandler}
                size="small"
                variant="outlined"
                name="fname"
                value={data.fname}
                type="text"
                helperText={dispError.fname ? 'Already Taken' : ''}
                error={dispError.fname}
              />
            </FormGroup>
            <CircularProgress size={25} sx={{ mt:"5px",ml:2,visibility: isSiteAvailable ? 'visible' : 'hidden' }} />
            
            <FormGroup
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 2,
                flexDirection: 'row',
                mt: 2,
              }}
            >
              <CheckboxSelect
                title="Framework"
                IsSelect={data.framework}
                setSelect={frameworkHandler}
                disabled={false}
              />

              <Disabled disabled={dispError.fname || isSiteAvailable || data.fname==="" || files.length <= 0 }>
                <LoadingButton sx={{ width: '200%' }} loading={isPending} variant="contained" type="submit">
                  Deploy
                </LoadingButton>
              </Disabled>
            </FormGroup>
            {uploadProgress > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  width: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  ml: '5px',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ textAlign: 'right', width: '85%', mt: 2 }}
                >{`${uploadProgress.toFixed(1)}%`}</Typography>
                <LinearProgress sx={{ mt: '2px', width: '85%' }} variant="determinate" value={uploadProgress} />
              </Box>
            )}
            {success ? (
              <Typography variant="body1" sx={{ mt: 3,ml:1 }}>
                <Link href={ensureUrlScheme(siteName)} target="_blank" >
                  {siteName}
                </Link>
              </Typography>
            ) : null}
          </Disabled>
        </form>
      </Paper>

      <Snackbar open={dispError.deploy !== '' || success} autoHideDuration={2500} onClose={ResetSnackBar}>
        <Alert onClose={ResetSnackBar} variant="filled" severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {success ? 'Site Deployed Successfully' : dispError.deploy}
        </Alert>
      </Snackbar>
    </Box>
  );
}
