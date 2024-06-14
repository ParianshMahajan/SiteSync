'use client';

import * as React from 'react';
import type { Site } from '@/services/manage-sites';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, LinearProgress, Link, Snackbar, Typography } from '@mui/material';
import JSZip from 'jszip';



import FileUpload from '../../addsite/FileUpload';
import type { FileWithRelativePath } from '../../addsite/SiteForm';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@/services/auth';
import { useReplaceFiles } from '@/hooks/mutations/use-upload';

interface SiteInfoProps {
  site: Site | undefined;
}

const ensureUrlScheme = (url: string): string => {
  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`;
  }
  return url;
};


export default function ReplaceFiles({ site }: SiteInfoProps): React.JSX.Element {
  const [files, setFiles] = React.useState<FileWithRelativePath[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [success, setSuccess] = React.useState(false);
  const [err, setErr] = React.useState('');

  const ResetSnackBar = (event?: React.SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }
    setErr('');
    setSuccess(false);
  };

  let totalSize = 0;

  const zipFolder = async (): Promise<Blob> => {
    const zip = new JSZip();
    const selectedDirectory = files[0].relativePath.split('/')[0];

    for (const file of files) {
      const filePath = file.relativePath;
      if (filePath.startsWith(`${selectedDirectory}/`)) {
        zip.file(filePath.substring(selectedDirectory.length + 1), file.file);
        totalSize += file.file.size;
      }
    }
    return await zip.generateAsync({ type: 'blob' });
  };



  
  const onSuccess = async (): Promise<void> => {
    setUploadProgress(0);
    setSuccess(true);
  };

  const onError = (error: AxiosError<ErrorResponse>): void => {
    setErr(error.message)
  };
  const { mutate: reDeploySite, isPending } = useReplaceFiles({ onSuccess, onError });



  const SubmitHandler = async (): Promise<void> => {

    const zipFile = (await zipFolder()) as File;
    const formData = new FormData();
    formData.append('file', zipFile);

    reDeploySite({ formData, totalSize, setUploadProgress });
  };


  return (
    <>
      <FileUpload files={files} setFiles={setFiles} height="22vh" />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, px: 2 }}>
        <Typography variant="h6">
          <Link href={ensureUrlScheme(site?.SiteDNS ?? '')} target="_blank">
            {site?.SiteDNS}
          </Link>
        </Typography>
        <LoadingButton onClick={SubmitHandler} loading={isPending} disabled={files.length<=0} variant="contained">Re-Deploy</LoadingButton>
      </Box>

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

      <Snackbar open={err !== '' || success} autoHideDuration={2500} onClose={ResetSnackBar}>
        <Alert onClose={ResetSnackBar} variant="filled" severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {success ? 'Site Deployed Successfully' : err}
        </Alert>
      </Snackbar>
    </>
  );
}
