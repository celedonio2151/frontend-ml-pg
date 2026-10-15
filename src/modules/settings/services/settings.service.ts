import type {
  Setting,
  SettingsList,
  SettingsListParams,
  UpdateSettingDto,
} from 'modules/settings/types/setting.types';
import { httpClient } from 'shared/lib/http-client';
import { buildListParams } from 'shared/utils/buildListParams';

const SETTINGS_ENDPOINT = '/settings';

function buildSettingsListParams(params: SettingsListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) base.q = params.q;
  if (params.category) base.category = params.category;

  return buildListParams(base, params.sortBy);
}

export const settingsService = {
  /** Lista completa (no paginada), ordenada por categoría y luego por clave. */
  findAll: (params?: SettingsListParams) => {
    const query = buildSettingsListParams(params).toString();
    return httpClient.get<SettingsList>(
      query ? `${SETTINGS_ENDPOINT}?${query}` : SETTINGS_ENDPOINT,
    );
  },

  findOne: (key: string) =>
    httpClient.get<Setting>(`${SETTINGS_ENDPOINT}/${encodeURIComponent(key)}`),

  /** Solo ADMIN. El cambio aplica en la siguiente operación que lea el setting. */
  update: (key: string, payload: UpdateSettingDto) =>
    httpClient.patch<Setting>(`${SETTINGS_ENDPOINT}/${encodeURIComponent(key)}`, payload),
} as const;
