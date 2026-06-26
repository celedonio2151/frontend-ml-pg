import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import ApiDocsPreview from 'modules/public/components/water-showcase/ApiDocsPreview';
import BackgroundBubbles from 'modules/public/components/water-showcase/BackgroundBubbles';
import DataPreviewSection from 'modules/public/components/water-showcase/DataPreviewSection';
import FormFeedbackSection from 'modules/public/components/water-showcase/FormFeedbackSection';
import HeroSection from 'modules/public/components/water-showcase/HeroSection';
import InvoiceGrid from 'modules/public/components/water-showcase/InvoiceGrid';
import MetricsOverview from 'modules/public/components/water-showcase/MetricsOverview';
import OperationsOverview from 'modules/public/components/water-showcase/OperationsOverview';
import ShowcaseSidebar from 'modules/public/components/water-showcase/ShowcaseSidebar';
import ShowcaseTopbar from 'modules/public/components/water-showcase/ShowcaseTopbar';
import { waterShowcaseStyles } from 'modules/public/components/water-showcase/waterShowcase.styles';

function WaterSystemShowcasePage() {
  return (
    <Box sx={waterShowcaseStyles.page}>
      <BackgroundBubbles />
      <Box sx={waterShowcaseStyles.gridOverlay} />

      <Box sx={waterShowcaseStyles.content}>
        <Box sx={waterShowcaseStyles.shell}>
          <ShowcaseSidebar />

          <AquaPanel strong sx={waterShowcaseStyles.main}>
            <ShowcaseTopbar />

            <Stack spacing={4} sx={waterShowcaseStyles.sectionStack}>
              <HeroSection />
              <MetricsOverview />
              <OperationsOverview />
              <DataPreviewSection />
              <InvoiceGrid />
              <FormFeedbackSection />
              <ApiDocsPreview />
            </Stack>
          </AquaPanel>
        </Box>
      </Box>
    </Box>
  );
}

export default WaterSystemShowcasePage;
