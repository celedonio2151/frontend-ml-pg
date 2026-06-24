/**
 * Se asegura de que la opción seleccionada actualmente exista en la lista de opciones.
 * Si no existe (porque la lista está paginada o cargando), la inserta al principio.
 * Esto evita que los Select de MUI se vean vacíos o den error de "Out of range".
 */
export const ensureCurrentOption = <T extends { id: string }>(items: T[], currentItem: T | null | undefined): T[] => {
  if (!currentItem) return items;

  const exists = items.some((item) => item.id === currentItem.id);

  if (exists) return items;

  // Si no existe, la añadimos al principio de la lista
  return [currentItem, ...items];
};
