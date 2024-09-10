import { defineDb, defineTable, column } from 'astro:db';

// Definición de la tabla
const himnos = defineTable({
  columns: {
    id: column.number({ primaryKey: true }), // Clave primaria
    titulo: column.text(), // Título del himno
    letra: column.text(), // Letra del himno
    acordes: column.text({ optional: true }), // Acordes del himno (opcional)
  },
});

// Definición de la base de datos
export default defineDb({
  tables: {
    himnos,
  },
});
