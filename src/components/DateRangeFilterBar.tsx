import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

type DateRangeFilterBarProps = {
  dateFrom: string;
  dateTo: string;
  label?: string;
  onChange: (range: { dateFrom: string; dateTo: string }) => void;
};

/** Barra de rango de fechas (YYYY-MM-DD) para filtros server-side de tablas. */
export default function DateRangeFilterBar({
  dateFrom,
  dateTo,
  label = 'Rango de Fechas:',
  onChange,
}: DateRangeFilterBarProps) {
  const toValue = (value: dayjs.Dayjs | null) =>
    value?.isValid() ? value.format('YYYY-MM-DD') : '';

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 120 }}>
        {label}
      </Typography>
      <DatePicker
        label="Desde"
        onChange={(value) => onChange({ dateFrom: toValue(value), dateTo })}
        value={dateFrom ? dayjs(dateFrom) : null}
        slotProps={{ textField: { size: 'small' } }}
      />
      <DatePicker
        label="Hasta"
        onChange={(value) => onChange({ dateFrom, dateTo: toValue(value) })}
        value={dateTo ? dayjs(dateTo) : null}
        slotProps={{ textField: { size: 'small' } }}
      />
      {(dateFrom || dateTo) && (
        <Button size="small" variant="text" onClick={() => onChange({ dateFrom: '', dateTo: '' })}>
          Limpiar
        </Button>
      )}
    </Stack>
  );
}
