import type { SortParam } from 'shared/types/api-reponse';
import { defineOptions } from 'shared/utils/define-options';

export const SettingCategory = defineOptions([
  { value: 'BILLING', label: 'Facturación' },
  { value: 'GENERAL', label: 'General' },
  { value: 'TARIFF', label: 'Tarifas' },
] as const);
export type SettingCategoryType = (typeof SettingCategory.values)[number];

/** `value` siempre llega como texto; `valueType` indica qué input mostrar. */
export type SettingValueType = 'INTEGER' | 'TEXT';

export type Setting = {
  id: string;
  createdAt: string;
  updatedAt: string;
  settingKey: string;
  value: string;
  description: string;
  category: SettingCategoryType;
  valueType: SettingValueType;
  /** Lo gestiona el sistema: se muestra pero no se puede editar (PATCH responde 403). */
  readOnly: boolean;
};

export type SettingsList = {
  items: Setting[];
};

export type SettingsListParams = {
  q?: string;
  category?: SettingCategoryType;
  sortBy?: SortParam[];
};

export type UpdateSettingDto = {
  value: string;
};

export const TEXT_SETTING_MAX_LENGTH = 500;
