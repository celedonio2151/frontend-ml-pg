import { TEXT_SETTING_MAX_LENGTH, type Setting } from 'modules/settings/types/setting.types';

/** Reglas del backend: INTEGER = entero no negativo; TEXT = hasta 500 caracteres. */
export function validateSettingValue(setting: Setting, value: string): string | null {
  if (setting.valueType === 'INTEGER') {
    return /^\d+$/.test(value.trim()) ? null : 'Debe ser un número entero no negativo';
  }
  if (value.length > TEXT_SETTING_MAX_LENGTH) {
    return `Máximo ${TEXT_SETTING_MAX_LENGTH} caracteres`;
  }
  return null;
}
