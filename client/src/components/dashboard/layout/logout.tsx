import * as React from "react";
import { useUser } from "@/hooks/use-user";
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth/client";
import { logger } from "@/lib/default-logger";
import { Button } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";

export default function Logout():React.JSX.Element {
    const { checkSession } = useUser();

    const router = useRouter();
  
    const handleSignOut = React.useCallback(async (): Promise<void> => {
      try {
        const { error } = await authClient.signOut();
  
        if (error) {
          logger.error('Sign out error', error);
          return;
        }
  
        // Refresh the auth state
        await checkSession?.();
  
        // UserProvider, for this case, will not refresh the router and we need to do it manually
        router.refresh();
        // After refresh, AuthGuard will handle the redirect
      } catch (err) {
        logger.error('Sign out error', err);
      }
    }, [checkSession, router]);

    return (
        <Button variant="contained" startIcon={<LogoutOutlined/>} onClick={handleSignOut}>Logout</Button>
    )
}