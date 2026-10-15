import type { ReplaceTariffsDto, TariffsList } from 'modules/tariffs/types/tariff.types';
import { httpClient } from 'shared/lib/http-client';

const TARIFFS_ENDPOINT = '/tariffs';

export const tariffService = {
  findAll: () => httpClient.get<TariffsList>(TARIFFS_ENDPOINT),

  /** Reemplaza atómicamente todos los tramos; el orden del arreglo define la posición. */
  replaceAll: (payload: ReplaceTariffsDto) =>
    httpClient.put<TariffsList>(TARIFFS_ENDPOINT, payload),
} as const;
