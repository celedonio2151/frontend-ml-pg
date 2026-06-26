import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FilterAltRounded from '@mui/icons-material/FilterAltRounded';
import SectionHeader from 'shared/ui/aqua/SectionHeader';
import { meters } from 'modules/public/data/waterShowcaseData';
import MeterPreviewCard from './MeterPreviewCard';
import UsersPreviewTable from './UsersPreviewTable';
import { waterShowcaseStyles } from './waterShowcase.styles';

function DataPreviewSection() {
  return (
    <>
      <SectionHeader
        eyebrow="Componentes de datos"
        title="Tablas, cards y estados"
        subtitle="Piezas que cubren usuarios, medidores, lecturas y facturacion."
        action={
          <Button variant="contained" startIcon={<FilterAltRounded />}>
            Filtros
          </Button>
        }
      />

      <Box sx={waterShowcaseStyles.twoColumn}>
        <UsersPreviewTable />

        <Stack spacing={2}>
          {meters.map((meter) => (
            <MeterPreviewCard key={meter.id} meter={meter} />
          ))}
        </Stack>
      </Box>
    </>
  );
}

export default DataPreviewSection;
