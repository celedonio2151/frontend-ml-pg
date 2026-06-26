import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import SectionHeader from 'shared/ui/aqua/SectionHeader';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { endpoints } from 'modules/public/data/waterShowcaseData';
import ApiEndpointItem from './ApiEndpointItem';

function ApiDocsPreview() {
  return (
    <>
      <SectionHeader
        eyebrow="Contratos"
        title="API docs compacta"
        subtitle="Acordeones con metodo, ruta, descripcion, auth y ejemplo de payload."
        action={<StatusPill label="v1.0 online" pulse tone="success" />}
      />

      <AquaPanel liquid sx={{ p: 0 }}>
        <Stack divider={<Divider />}>
          {endpoints.map((endpoint) => (
            <ApiEndpointItem key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
          ))}
        </Stack>
      </AquaPanel>
    </>
  );
}

export default ApiDocsPreview;
