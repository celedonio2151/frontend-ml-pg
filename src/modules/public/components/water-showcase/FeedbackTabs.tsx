import { useState, type SyntheticEvent } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import { apiSnippet } from 'modules/public/data/waterShowcaseData';
import ColorSwatch from './ColorSwatch';
import { waterShowcaseStyles } from './waterShowcase.styles';

function FeedbackTabs() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, value: number) => {
    setTab(value);
  };

  return (
    <AquaPanel liquid>
      <Stack spacing={2.5}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Feedback y navegacion local
        </Typography>
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable">
          <Tab label="Estados" />
          <Tab label="Tokens" />
          <Tab label="API" />
        </Tabs>
        {tab === 0 ? (
          <Stack spacing={1.5}>
            <Alert severity="success">Lectura registrada y factura generada correctamente.</Alert>
            <Alert severity="warning">El medidor #1002 esta cerca del maximo permitido.</Alert>
            <Alert severity="error">Hay 7 usuarios con mora critica.</Alert>
          </Stack>
        ) : null}
        {tab === 1 ? (
          <Box sx={waterShowcaseStyles.threeColumn}>
            <ColorSwatch label="Primary" color={theme.palette.primary.main} />
            <ColorSwatch label="Secondary" color={theme.palette.secondary.main} />
            <ColorSwatch label="Paper" color={theme.palette.background.paper} />
          </Box>
        ) : null}
        {tab === 2 ? (
          <Box component="pre" sx={waterShowcaseStyles.codeBlock}>
            {apiSnippet}
          </Box>
        ) : null}
      </Stack>
    </AquaPanel>
  );
}

export default FeedbackTabs;
