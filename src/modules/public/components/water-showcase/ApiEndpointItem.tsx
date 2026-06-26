import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { apiSnippet, endpoints } from 'modules/public/data/waterShowcaseData';
import { toneByMethod } from './waterShowcaseTones';
import { waterShowcaseStyles } from './waterShowcase.styles';

type ApiEndpointItemProps = {
  endpoint: (typeof endpoints)[number];
};

function ApiEndpointItem({ endpoint }: ApiEndpointItemProps) {
  return (
    <Accordion disableGutters elevation={0} sx={{ bgcolor: 'transparent', color: 'inherit', '&::before': { display: 'none' } }}>
      <AccordionSummary expandIcon={<ExpandMoreRounded sx={{ color: 'text.secondary' }} />}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0, width: '100%' }}>
          <StatusPill label={endpoint.method} tone={toneByMethod[endpoint.method]} />
          <Typography sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontSize: 14, color: 'text.primary' }}>
            {endpoint.path}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            {endpoint.description}
          </Typography>
          {endpoint.auth ? <StatusPill label="Bearer" tone="warning" sx={{ ml: 'auto' }} /> : null}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ borderTop: '1px solid rgba(125, 211, 252, 0.10)' }}>
        <Box component="pre" sx={waterShowcaseStyles.codeBlock}>
          {apiSnippet}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default ApiEndpointItem;
