'use client';

import * as React from 'react';
import type { ErrorResponse } from '@/services/auth';
import type { Site } from '@/services/manage-sites';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Divider, Link, Paper, Snackbar, TextField, Typography } from '@mui/material';
import type { AxiosError } from 'axios';

import { useRenameSite, useUpdateSite } from '@/hooks/mutations/use-site';
import { useSiteAvailable } from '@/hooks/mutations/use-upload';

import ReplaceFiles from './replace-files';

interface SiteInfoProps {
  site: Site | undefined;
  refreshComponents: () => void;
}

const ensureUrlScheme = (url: string): string => {
  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`;
  }
  return url;
};

export default function SiteInfo({ site,refreshComponents }: SiteInfoProps): React.JSX.Element {
  const [fname, setFname] = React.useState('');
  const [siteNameErr, setSiteNameErr] = React.useState(false);

  const onSuccessSiteAvailable = async (): Promise<void> => {
    setSiteNameErr(false);
  };

  const onErrorSiteAvailable = (): void => {
    setSiteNameErr(true);
  };
  const { mutate: siteCheck, isPending: isSiteAvailable } = useSiteAvailable({
    onSuccess: onSuccessSiteAvailable,
    onError: onErrorSiteAvailable,
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.value.toLowerCase();
    setFname(name);
    siteCheck({ name });
  };

  const [status, setStatus] = React.useState(0);
  const [success, setSuccess] = React.useState('');
  const [err, setErr] = React.useState('');

  const ResetSnackBar = (event?: React.SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }
    setErr('');
    setSuccess('');
  };

  // Rename Site

  const onSuccessRenameSite = async (): Promise<void> => {
    setSuccess('Site Renamed Successfully');
    refreshComponents();
  };

  const onErrorRenameSite = (error: AxiosError<ErrorResponse>): void => {
    setErr(error.message);
  };
  const { mutate: RenameSite, isPending: isRenameSite } = useRenameSite({
    onSuccess: onSuccessRenameSite,
    onError: onErrorRenameSite,
  });

  const handleRenameSite = (): void => {
    RenameSite({ id: site?._id, fname });
  };

  // Update Site
  const onSuccessUpdateSite = async (): Promise<void> => {
    let action = '';
    if (status === 1) action = 'Started';
    else if (status === 0) action = 'Downed';
    else action = 'Deleted';
    setSuccess(`Site ${action} Successfully`);
    refreshComponents();
  };

  const onErrorUpdateSite = (error: AxiosError<ErrorResponse>): void => {
    setErr(String(error.response?.data?.message) || error.message);
  };
  const { mutate: UpdateSite, isPending: isUpdateSite } = useUpdateSite({
    onSuccess: onSuccessUpdateSite,
    onError: onErrorUpdateSite,
  });

  const handleUpdateSite = (stat:number): void => {
    UpdateSite({ id: site?._id, status:stat });
  };

  return (
    <Paper sx={{ p: 2, width: { xs: 1, md: '40%' }, minHeight: '62vh' }} elevation={0}>
      {!site ? (
        <>
          <Typography variant="h4">Site Info</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 1, minHeight: '42vh' }}>
            <Typography variant="h5" textAlign="center">
              Select a site
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-start', mb: 3 }} gap={1}>
            <Typography variant="h4">
              <Link href={ensureUrlScheme(site.SiteDNS)} target="_blank" color="inherit">
                {site.fname}
              </Link>
            </Typography>
            <Typography
              variant="h6"
              fontWeight={700}
              color={site.Status === 0 ? 'var(--mui-palette-error-dark)' : 'var(--mui-palette-primary-main)'}
            >
              {site.Status === 0 ? 'Down' : 'Running'}
            </Typography>
          </Box>

          <ReplaceFiles site={site} />

          <Divider variant="middle" sx={{ my: '25px' }} />

          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', px: 2, mt: 2 }} gap={2}>
            <TextField
              label="Rename-Site"
              onChange={onChangeHandler}
              size="small"
              variant="outlined"
              name="fname"
              value={fname}
              type="text"
              helperText={siteNameErr ? 'Already Taken' : ''}
              error={siteNameErr}
            />
            <LoadingButton
              loading={isSiteAvailable || isRenameSite}
              disabled={siteNameErr || fname === ''}
              variant="contained"
              onClick={handleRenameSite}
            >
              Rename
            </LoadingButton>
          </Box>

          <Divider variant="middle" sx={{ my: '25px' }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2, mx: 2 }}>
            {site.Status === 0 ? (
              <LoadingButton
                variant="contained"
                loading={isUpdateSite ? status === 1 : false}
                onClick={() => {
                  handleUpdateSite(1);
                  setStatus(1);
                }}
              >
                Start Site
              </LoadingButton>
            ) : (
              <LoadingButton
                variant="contained"
                loading={isUpdateSite ? status === 0 : false}
                onClick={() => {
                  handleUpdateSite(0);
                  setStatus(0);
                }}
              >
                Down Site
              </LoadingButton>
            )}

            <LoadingButton
              variant="contained"
              sx={{
                background: '#ff0000',
                color:"#ffffff",
                '&:hover': { background: '#520000' },
              }}
              loading={isUpdateSite ? status === -1 : false}
              onClick={() => {
                handleUpdateSite(-1);
                setStatus(-1);
              }}
            >
              Delete Site
            </LoadingButton>
          </Box>
        </>
      )}

      <Snackbar open={err !== '' || success !== ''} autoHideDuration={2500} onClose={ResetSnackBar}>
        <Alert onClose={ResetSnackBar} variant="filled" severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {success ? success : err}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
