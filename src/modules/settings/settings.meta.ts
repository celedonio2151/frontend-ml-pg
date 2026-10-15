import type { SvgIconComponent } from '@mui/icons-material';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import BadgeRounded from '@mui/icons-material/BadgeRounded';
import EventRepeatRounded from '@mui/icons-material/EventRepeatRounded';
import EventRounded from '@mui/icons-material/EventRounded';
import HomeWorkRounded from '@mui/icons-material/HomeWorkRounded';
import HourglassBottomRounded from '@mui/icons-material/HourglassBottomRounded';
import LayersRounded from '@mui/icons-material/LayersRounded';
import LocationOnRounded from '@mui/icons-material/LocationOnRounded';
import PriceChangeRounded from '@mui/icons-material/PriceChangeRounded';
import QrCode2Rounded from '@mui/icons-material/QrCode2Rounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import ReplayRounded from '@mui/icons-material/ReplayRounded';
import SyncRounded from '@mui/icons-material/SyncRounded';
import TuneRounded from '@mui/icons-material/TuneRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import WaterDropRounded from '@mui/icons-material/WaterDropRounded';

import type { SettingCategoryType } from 'modules/settings/types/setting.types';
import type { AquaTone } from 'shared/ui/aqua/aquaTones';

export type SettingMeta = {
  label: string;
  section: string;
  icon: SvgIconComponent;
  unit?: string;
  placeholder?: string;
};

/** Nombre legible, unidad, ícono y subsección de cada clave documentada. */
export const SETTING_META: Record<string, SettingMeta> = {
  MOROSOS_MONTHS_THRESHOLD: {
    label: 'Meses de deuda para considerar moroso',
    section: 'Morosidad',
    icon: WarningAmberRounded,
    unit: 'meses',
  },
  LAST_OVERDUE_CHECK_DATE: {
    label: 'Última revisión diaria de vencidas',
    section: 'Morosidad',
    icon: EventRounded,
  },
  QR_GENERATING_TIMEOUT_SECONDS: {
    label: 'Tiempo límite generando un QR',
    section: 'Generación de QR',
    icon: HourglassBottomRounded,
    unit: 'seg',
  },
  QR_MAX_ATTEMPTS: {
    label: 'Intentos máximos por ciclo',
    section: 'Generación de QR',
    icon: ReplayRounded,
    unit: 'intentos',
  },
  QR_RETRY_COOLDOWN_SECONDS: {
    label: 'Espera tras agotar los intentos',
    section: 'Generación de QR',
    icon: AccessTimeRounded,
    unit: 'seg',
  },
  QR_MIN_EXPIRATION_DAYS: {
    label: 'Vigencia mínima del QR (factura vencida)',
    section: 'Generación de QR',
    icon: QrCode2Rounded,
    unit: 'días',
  },
  QR_POLL_INTERVAL_MINUTES: {
    label: 'Intervalo de verificación',
    section: 'Verificación con el banco',
    icon: SyncRounded,
    unit: 'min',
  },
  QR_POLL_BATCH_SIZE: {
    label: 'QR verificados por ciclo',
    section: 'Verificación con el banco',
    icon: LayersRounded,
    unit: 'QR',
  },
  QR_POLL_MID_INTERVAL_MINUTES: {
    label: 'Intervalo para QR de 1 a 3 días',
    section: 'Verificación con el banco',
    icon: EventRepeatRounded,
    unit: 'min',
  },
  QR_POLL_OLD_INTERVAL_MINUTES: {
    label: 'Intervalo para QR de más de 3 días',
    section: 'Verificación con el banco',
    icon: EventRepeatRounded,
    unit: 'min',
  },
  COMMUNITY_NAME: {
    label: 'Nombre de la comunidad',
    section: 'Datos de la comunidad',
    icon: HomeWorkRounded,
    placeholder: 'Ej: Comité de Agua Potable ...',
  },
  COMMUNITY_NIT: {
    label: 'NIT',
    section: 'Datos de la comunidad',
    icon: BadgeRounded,
    placeholder: '"0" si no tiene NIT',
  },
  COMMUNITY_ADDRESS: {
    label: 'Dirección',
    section: 'Datos de la comunidad',
    icon: LocationOnRounded,
  },
  RESPONSIBLE_CONSUMPTION_TARGET_M3: {
    label: 'Meta mensual de consumo responsable',
    section: 'Consumo',
    icon: WaterDropRounded,
    unit: 'm³',
  },
};

export const FALLBACK_SECTION = 'Otros';

export const getSettingMeta = (key: string): SettingMeta =>
  SETTING_META[key] ?? { label: key, section: FALLBACK_SECTION, icon: TuneRounded };

export const CATEGORY_META: Record<
  SettingCategoryType,
  { icon: SvgIconComponent; tone: AquaTone; description: string }
> = {
  BILLING: {
    icon: ReceiptLongRounded,
    tone: 'aqua',
    description: 'Morosidad, cobro por QR y verificación con el banco',
  },
  GENERAL: {
    icon: HomeWorkRounded,
    tone: 'purple',
    description: 'Datos de la comunidad y metas de consumo',
  },
  TARIFF: {
    icon: PriceChangeRounded,
    tone: 'success',
    description: 'Parámetros relacionados con el cobro por consumo',
  },
};
