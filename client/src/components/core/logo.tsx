'use client';

import * as React from 'react';
import Box from '@mui/material/Box';


const HEIGHT = 60;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({ height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  const url="/assets/ccs-logo.svg";

  return <Box alt="logo" component="img" height={height} src={url} width={width} />;
}


