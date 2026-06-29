export type Person = {
  age: number;
  firstName: string;
  lastName: string;
  progress: number;
  status: 'complicated' | 'relationship' | 'single';
  subRows?: Person[];
  visits: number;
};

const firstNames = ['Ana', 'Carlos', 'Daniela', 'Elena', 'Juan', 'Luis', 'Maria', 'Pedro', 'Rosa', 'Valeria'];
const lastNames = ['Fernandez', 'Garcia', 'Gomez', 'Lopez', 'Martinez', 'Mendoza', 'Perez', 'Rojas', 'Ruiz', 'Vargas'];
const statuses: Person['status'][] = ['single', 'relationship', 'complicated'];

const range = (length: number) => Array.from({ length }, (_, index) => index);

const newPerson = (index: number): Person => ({
  age: 18 + (index % 52),
  firstName: firstNames[index % firstNames.length],
  lastName: lastNames[(index * 7) % lastNames.length],
  progress: (index * 13) % 101,
  status: statuses[index % statuses.length],
  visits: 80 + ((index * 37) % 3400),
});

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0, offset = 0): Person[] => {
    const length = lens[depth] ?? 0;

    return range(length).map((index): Person => ({
      ...newPerson(offset + index),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1, offset + index * 10) : undefined,
    }));
  };

  return makeDataLevel();
}
