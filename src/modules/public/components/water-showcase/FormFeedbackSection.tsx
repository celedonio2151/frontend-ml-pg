import Box from '@mui/material/Box';
import SectionHeader from 'shared/ui/aqua/SectionHeader';
import FeedbackTabs from './FeedbackTabs';
import ReadingFormDemo from './ReadingFormDemo';
import { waterShowcaseStyles } from './waterShowcase.styles';

function FormFeedbackSection() {
  return (
    <>
      <SectionHeader
        eyebrow="Inputs"
        title="Formulario base y controles MUI"
        subtitle="Incluye DatePicker de MUI X, selects, switches, checkboxes, radios, slider, feedback y dialogos."
      />

      <Box sx={waterShowcaseStyles.componentGrid}>
        <ReadingFormDemo />
        <FeedbackTabs />
      </Box>
    </>
  );
}

export default FormFeedbackSection;
