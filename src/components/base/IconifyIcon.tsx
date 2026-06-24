import type { IconProps } from '@iconify/react';
import { Icon } from '@iconify/react';
import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';

interface IconifyProps extends BoxProps {
  icon: IconProps['icon'];
}

const IconifyIcon = ({ icon, ...rest }: IconifyProps) => {
  return <Box component={Icon} icon={icon} {...rest} />;
};

export default IconifyIcon;
