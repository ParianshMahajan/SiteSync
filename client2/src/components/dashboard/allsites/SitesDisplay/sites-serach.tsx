'use client';

import * as React from 'react';
import type { ErrorResponse } from '@/services/auth';
import type { Site, SuccessResponse } from '@/services/manage-sites';
import { Alert, Box, CircularProgress, Snackbar } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import type { AxiosError, AxiosResponse } from 'axios';

import { useSearch } from '@/hooks/mutations/use-manage-sites';

import Filter from './filter';
import { config } from '@/config';

interface SearchSiteProps {
  setSearchResults: (sites: Site[]) => void;
  setSites: (sites: Site[]) => void;
  filters: { isSearching: boolean; isRunning: boolean; isStopped: boolean };
  setFilters: (filters: { isSearching: boolean; isRunning: boolean; isStopped: boolean }) => void;
}

export function SearchSite({ setSites, filters, setFilters,setSearchResults }: SearchSiteProps): React.JSX.Element {
  const [search, setSearch] = React.useState<string>('');
  const [err, setErr] = React.useState<string>('');

  const onSuccess = (res: AxiosResponse<SuccessResponse>): void => {
    setSearchResults(res.data.sites);
    const pageSize=config.SitesPageSize;
    setSites((res.data.sites).slice(0,pageSize));
  };
  const onError = (error: AxiosError<ErrorResponse>): void => {
    setErr(error.response ? error.message : 'An error occurred');
  };

  const { mutate: searchSite, isPending } = useSearch({ onSuccess, onError });

  const ResetSnackBar = (event?: React.SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }
    setErr('');
  };

  const handleRunning = (): void => {
    setFilters({ ...filters, isRunning: !filters.isRunning, isStopped: false });
  };
  const handleStopped = (): void => {
    setFilters({ ...filters, isStopped: !filters.isStopped, isRunning: false });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value.toLowerCase());
    if (event.target.value !== '') {
      setFilters({ ...filters, isSearching: true });
      searchSite({ query: event.target.value.toLowerCase() });
    } else {
      setFilters({ ...filters, isSearching: false });
    }
  };

  return (
    <Box sx={{ p: '2px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
        <OutlinedInput
          fullWidth
          size="small"
          value={search}
          onChange={handleChange}
          placeholder="Search Site"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              {isPending ? <CircularProgress color="inherit" size={20} /> : null}
            </InputAdornment>
          }
          sx={filters.isSearching ? { width: '90%',transition:"ease-in-out 200ms" } : { width: { xs: '50%', md: '65%' },transition:"ease-in-out 200ms"}}
        />

        <Box sx={filters.isSearching?{display:"none"}:{ width: 'fit-content' }}>
          <Filter title="Running" IsSelect={filters.isRunning} setSelect={handleRunning} disabled={false} />
        </Box>
        <Box sx={filters.isSearching?{display:"none"}:{ width: 'fit-content' }}>
          <Filter title="Down" IsSelect={filters.isStopped} setSelect={handleStopped} disabled={false} />
        </Box>
      </Box>
      <Snackbar open={err !== ''} autoHideDuration={2500} onClose={ResetSnackBar}>
        <Alert onClose={ResetSnackBar} variant="filled" severity="error" sx={{ width: '100%' }}>
          {err}
        </Alert>
      </Snackbar>
    </Box>
  );
}
