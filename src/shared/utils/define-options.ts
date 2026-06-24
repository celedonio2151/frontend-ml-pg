import { z } from 'zod';

export function defineOptions<const T extends readonly { value: string; label: string }[]>(options: T) {
  // Extrae los valores de tipo de las opciones para usarlos en el tipo genérico y en el esquema de validación
  type Value = T[number]['value'];
  type Label = T[number]['label'];

  // Asegura que el array no esté vacío y que cada opción tenga un valor único
  const values = options.map((option) => option.value) as [Value, ...Value[]];

  // Crea un mapa de valor a etiqueta para facilitar la obtención de la etiqueta a partir del valor
  const labelMap = Object.fromEntries(options.map((option) => [option.value, option.label])) as Record<Value, string>;
  const valueMap = Object.fromEntries(options.map((option) => [option.value, option.value])) as {
    [Key in Value]: Key;
  };

  // Función para obtener la etiqueta a partir del valor, con un fallback si el valor no existe
  const getLabel = (value?: Value | null, fallback = '—') => {
    if (!value) return fallback;

    return labelMap[value] ?? fallback;
  };

  // Versión segura de getLabel que garantiza que el valor sea del tipo correcto, con un fallback si el valor no existe o no es del tipo correcto
  const getLabelSafe = (value?: string | null, fallback = '—'): Label | string => {
    if (!value) return fallback;

    return labelMap[value as Value] ?? fallback;
  };

  // Crea un esquema de validación de Zod que solo permita los valores definidos en las opciones
  const schema = z.enum(values);

  return {
    options,
    values,
    valueMap,
    labelMap,
    getLabel,
    getLabelSafe,
    schema,
  };
}
