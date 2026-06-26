import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FileDownloadRounded from '@mui/icons-material/FileDownloadRounded';
import QrCode2Rounded from '@mui/icons-material/QrCode2Rounded';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { invoices } from 'modules/public/data/waterShowcaseData';
import { toneByStatus } from './waterShowcaseTones';
import { waterShowcaseStyles } from './waterShowcase.styles';

function InvoiceGrid() {
  return (
    <Box sx={waterShowcaseStyles.threeColumn}>
      {invoices.map((invoice) => (
        <AquaPanel key={invoice.id} hover liquid>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Factura
                </Typography>
                <Typography sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 800 }}>
                  {invoice.id}
                </Typography>
              </Box>
              <StatusPill label={invoice.status} tone={toneByStatus[invoice.status]} />
            </Stack>
            <Divider />
            <Stack spacing={1}>
              <Typography variant="body2">{invoice.client}</Typography>
              <Typography variant="h5" color="primary.light" sx={{ fontWeight: 900 }}>
                {invoice.amount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {invoice.method} - {invoice.date}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconButton color="primary">
                <QrCode2Rounded />
              </IconButton>
              <IconButton color="primary">
                <FileDownloadRounded />
              </IconButton>
            </Stack>
          </Stack>
        </AquaPanel>
      ))}
    </Box>
  );
}

export default InvoiceGrid;
