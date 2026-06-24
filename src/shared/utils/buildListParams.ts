import type { SortParam } from 'shared/types/api-reponse';

/**
 * Builds URLSearchParams for paginated list endpoints.
 * Serializes sortBy as bracket notation: sortBy[0][whom]=name&sortBy[0][order]=asc
 */
export function buildListParams(
  base: Record<string, string>,
  sortBy: SortParam[] = [],
): URLSearchParams {
  const params = new URLSearchParams(base);
  sortBy.forEach((s, i) => {
    params.append(`sortBy[${i}][whom]`, s.whom);
    params.append(`sortBy[${i}][order]`, s.order);
  });
  return params;
}
