'use client';
import { Paper } from '@mui/material';
import * as React from 'react';
import { SearchSite } from './sites-serach';
import type { Site } from '@/services/manage-sites';
import SitesTable from './sites-table';

interface DisplaySitesProps {
    siteId: string | undefined;
    reset: boolean;
    setReset: (flag: boolean) => void;
    setSite: (site: Site) => void;
}

export default function DisplaySites({setSite,siteId,reset,setReset}:DisplaySitesProps): React.JSX.Element {
    const [sites, setSites] = React.useState<Site[]>([]);
    const [searchResults, setSearchResults] = React.useState<Site[]>([]);

    const [filters, setFilters] = React.useState({
        isSearching: false,
        isRunning: false,
        isStopped: false,
    });

  return (
    <Paper sx={{p:2,width:{ xs:1, md: '60%' }}} elevation={0} >
        <SearchSite setSites={setSites} setSearchResults={setSearchResults} filters={filters} setFilters={setFilters} />  
        <SitesTable sites={sites} siteId={siteId} reset={reset} setReset={setReset} filters={filters} searchResults={searchResults} setSites={setSites} setSite={setSite} />
    </Paper>
  );
}