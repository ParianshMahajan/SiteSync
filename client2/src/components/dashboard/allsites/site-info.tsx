'use client';
import * as React from 'react';
import { Box, Button, Divider, Link, Paper, TextField, Typography } from '@mui/material';
import type { Site } from '@/services/manage-sites';
import FileUpload from '../addsite/FileUpload';
import type { FileWithRelativePath } from '../addsite/SiteForm';
import Disabled from '@/components/core/disabled';
import { useSiteAvailable } from '@/hooks/mutations/use-upload';
import { LoadingButton } from '@mui/lab';

interface SiteInfoProps {
    site: Site|undefined;
}

const ensureUrlScheme = (url: string):string => {
  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`;
  }
  return url;
};

export default function SiteInfo({site}:SiteInfoProps): React.JSX.Element {
  const [files, setFiles] = React.useState<FileWithRelativePath[]>([]);
  

  const [fname,setFname]=React.useState("");
  const[siteNameErr,setSiteNameErr]=React.useState(false);

  const onSuccessSiteAvailable = async (): Promise<void> => {
    setSiteNameErr(false);
  };

  const onErrorSiteAvailable = (): void => {
    setSiteNameErr(true);
  };
  const { mutate: siteCheck, isPending:isSiteAvailable } = useSiteAvailable({ onSuccess:onSuccessSiteAvailable, onError:onErrorSiteAvailable });


  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.value.toLowerCase();
    setFname(name);
    siteCheck({ name });
  };


  return (
    <Paper sx={{p:2, width:{ xs:1, md: '40%' },minHeight:"62vh"}} elevation={10}>
        
        {!site?
          (<>
            <Typography variant='h4'>Site Info</Typography>
            <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",width:1,minHeight:"42vh"}}>
              <Typography variant='h5' textAlign="center" >Select a site</Typography>
            </Box>
          </>)
        :
        (
          <>
            <Box sx={{display:"flex",alignItems:"baseline",justifyContent:"flex-start",mb:3}} gap={1}>
              <Typography variant='h4'><Link href={ensureUrlScheme(site.SiteDNS)}target="_blank" color="inherit">{site.fname}</Link></Typography>
              <Typography variant='body1' color={site.Status===0?"var(--mui-palette-error-dark)":"var(--mui-palette-success-dark)"}>{site.Status===0?"Down":"Running"}</Typography>
            </Box>
            
            <FileUpload files={files} setFiles={setFiles} height='22vh'/>
            
            <Box sx={{display:"flex",alignItems:"center",justifyContent:"space-between",mt:2,px:2}}>
              <Typography variant='h6'><Link href={ensureUrlScheme(site.SiteDNS)} target="_blank">{site.SiteDNS}</Link></Typography>
              <Disabled disabled={files.length<=0}>
                <Button  variant='contained'>Re-Deploy</Button>
              </Disabled>
            </Box>
            
            <Divider variant='middle' sx={{my:"25px"}}/>

            <Box sx={{display:"flex",alignItems:"flex-start",justifyContent:"flex-start",px:2,mt:2}} gap={2}>
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
              <LoadingButton loading={isSiteAvailable} disabled={siteNameErr||fname===""} variant="contained" >Rename</LoadingButton>
            </Box>

            <Divider variant='middle' sx={{my:"25px"}}/>

            <Box sx={{display:"flex",alignItems:"center",justifyContent:"flex-start",gap:2,mx:2}}>
              {site.Status===0?<LoadingButton variant="contained"> Start Site </LoadingButton>:<LoadingButton variant="contained"> Down Site </LoadingButton>}
              <LoadingButton variant="contained" sx={{background:"var(--mui-palette-error-main)",'&:hover': { background: 'var(--mui-palette-error-dark)' }}} > Delete Site </LoadingButton>
            </Box>


          </>
        
        )
        }
        

    </Paper>
  );
}