import * as React from 'react';
import type { ErrorResponse } from '@/services/auth';
import type { Site, SuccessResponse } from '@/services/manage-sites';
import {
  Box,
  CircularProgress,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { AxiosError, AxiosResponse } from 'axios';

import { useFetchSites } from '@/hooks/mutations/use-manage-sites';
import { config } from '@/config';

interface SiteTableProps {
  sites: Site[];
  searchResults: Site[];
  setSites: (sites: Site[]) => void;
  setSite: (site: Site) => void;
  filters: { isSearching: boolean; isRunning: boolean; isStopped: boolean };
}

const ensureUrlScheme = (url: string): string => {
  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`;
  }
  return url;
};

export default function SitesTable({ sites, filters, setSite,setSites,searchResults }: SiteTableProps): React.JSX.Element {
  const [pagination, setPagination] = React.useState({ page: 1, totalPages: 1 });
  const [err, setErr] = React.useState('');

  const onSuccess = (res: AxiosResponse<SuccessResponse>): void => {
    setPagination({ ...pagination, totalPages: res.data.totalPages });
    setSites(res.data.sites);
  };

  const onError = (error: AxiosError<ErrorResponse>): void => {
    setErr(error.message || 'An error occured');
  };

  const { mutate: fetchSites, isPending } = useFetchSites({ onSuccess, onError });

  const loadPage = (): void => {
    if(filters.isSearching) return;
    setSites([]);
    fetchSites({ page: pagination.page, filters });
  };

  React.useEffect(() => {
    loadPage();
    if(filters.isSearching && searchResults.length>0){
      setPagination({ ...pagination, totalPages: Math.ceil(searchResults.length / config.SitesPageSize) });
      setSites(searchResults.slice((pagination.page - 1) * config.SitesPageSize, pagination.page * config.SitesPageSize));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps -- pagination.page and filters are the only dependencies
  }, [pagination.page, filters]);

  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number): void => {
    if(page===pagination.page) return;
    setPagination({ ...pagination, page });
  };


  const handleRowClick = (site: Site): void => {
    setSite(site);
  }

  return (
    <Box sx={{ mt: 3,height:"87%"}}>
      <Table sx={{minHeight:"45vh",borderRadius:"10px",border: '5px solid #202427',}} >
        <TableHead sx={{borderRadius:"10px"}}>
          <TableRow sx={{borderRadius:"10px"}} >
            <TableCell sx={{ width: '65%' }}>
              <Typography variant="h5">SiteName</Typography>
            </TableCell>
            <TableCell sx={{ width: '35%' }}>
              <Typography variant="h5">Status</Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        {isPending ? (
          <TableCell colSpan={2} height={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',height:1}}>
            <CircularProgress size={20} />
          </Box>
        </TableCell>
        ) : err ? (
          <TableCell colSpan={2} height={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height:1 }}>
            <Typography color="var(--mui-palette-error-main)" textAlign='center' variant="h6">
              {err}
            </Typography>
          </Box>
              </TableCell>
        ) : (

          
          <TableBody>
          {sites.length === 0 && !isPending && !err ? (
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="h6" textAlign='center'>No sites found</Typography>
              </TableCell>
            </TableRow>
          ) : null}

          {sites.map((site: Site) => {
            const siteUrl = ensureUrlScheme(site.SiteDNS);
            return (
              // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- onClick expects void
              <TableRow sx={{cursor:"pointer"}} hover key={site._id} onClick={()=>handleRowClick(site)} >
                <TableCell>
                  <Typography variant="h6">
                    <Link underline="hover" color="inherit" href={siteUrl} target="_blank">
                      {site.SiteDNS}
                    </Link>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight={600}
              color={site.Status === 0 ? 'var(--mui-palette-error-dark)' : 'var(--mui-palette-primary-dark)'}>{site.Status === 0 ? 'Down' : 'Running'}</Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        )}
      </Table>

        <Box sx={{mt:6, display: 'flex', alignItems: 'center', justifyContent: 'center',bottom:0}}>

              <Pagination count={pagination.totalPages} onChange={handleChangePage} variant="outlined" color="primary" />

        </Box>
    </Box>
  );
}
