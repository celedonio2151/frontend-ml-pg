import { defineOptions } from 'shared/utils/define-options';

export const TariffTierKind = defineOptions([
  { value: 'FIXED', label: 'Monto fijo' },
  { value: 'PER_M3', label: 'Precio por m³' },
]);
export type TariffTierKindType = (typeof TariffTierKind.values)[number];

export type TariffTier = {
  position: number;
  upToM3: number | null;
  price: number;
  type: TariffTierKindType;
};

export type TariffTierInput = {
  upToM3?: number | null;
  price: number;
  type: TariffTierKindType;
};

export type ReplaceTariffsDto = {
  tiers: TariffTierInput[];
};

export type TariffsList = {
  items: TariffTier[];
};
