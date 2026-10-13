import type { SortParam } from 'shared/types/api-reponse';

/**
 * Builds URLSearchParams for paginated list endpoints.
 * Serializes sortBy as bracket notation: sortBy[0][whom]=name&sortBy[0][order]=asc
 * and `include` as comma-separated relations: include=reading,meter
 */
export function buildListParams(
  base: Record<string, string>,
  sortBy: SortParam[] = [],
  include: readonly string[] = [],
): URLSearchParams {
  const params = new URLSearchParams(base);
  sortBy.forEach((s, i) => {
    params.append(`sortBy[${i}][whom]`, s.whom);
    params.append(`sortBy[${i}][order]`, s.order);
  });
  if (include.length > 0) params.set('include', include.join(','));
  return params;
}

/** Query string `?include=a,b` para endpoints de detalle (GET /recurso/:id). */
export function includeQuery(include: readonly string[]): string {
  return include.length > 0 ? `?include=${include.join(',')}` : '';
}
