import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import WaterDropRounded from '@mui/icons-material/WaterDropRounded';
import MetricCard from 'shared/ui/aqua/MetricCard';
import type { MetricTone } from 'shared/ui/aqua/MetricCard';
import { metrics } from 'modules/public/data/waterShowcaseData';
import { waterShowcaseStyles } from './waterShowcase.styles';
import Box from '@mui/material/Box';

const metricIcons = [
  <WaterDropRounded key="meters" fontSize="small" />,
  <ReceiptLongRounded key="invoices" fontSize="small" />,
  <CheckCircleRounded key="income" fontSize="small" />,
  <WarningAmberRounded key="alerts" fontSize="small" />,
] as const;

function MetricsOverview() {
  return (
    <Box sx={waterShowcaseStyles.responsiveCards}>
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.label}
          change={metric.change}
          icon={metricIcons[index]}
          label={metric.label}
          tone={metric.tone as MetricTone}
          value={metric.value}
          waterLevel={metric.waterLevel}
        />
      ))}
    </Box>
  );
}

export default MetricsOverview;
