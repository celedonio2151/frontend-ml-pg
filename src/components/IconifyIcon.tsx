import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import { Icon } from '@iconify/react';
import type { IconProps } from '@iconify/react';

interface IconifyProps extends BoxProps {
  icon: IconProps['icon'];
}

const IconifyIcon = ({ icon, ...rest }: IconifyProps) => {
  return <Box component={Icon} icon={icon} {...rest} />;
};

export default IconifyIcon;
