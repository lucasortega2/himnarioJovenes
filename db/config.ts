import { defineDb, defineTable, column } from 'astro:db';

const Himnos = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    titulo: column.text({ optional: false }),
    letra: column.text({ optional: false }),
    acorde: column.text({ optional: true }),
  },
});

const Himnario = defineTable({
  columns: {
    himnoId: column.number({
      primaryKey: true,
      references: () => Himnos.columns.id,
    }),
    numero: column.number({ optional: false }),
  },
});

const Suplementario = defineTable({
  columns: {
    himnoId: column.number({
      primaryKey: true,
      references: () => Himnos.columns.id,
    }),
    numero: column.text({ optional: false }),
  },
});

const Jovenes = defineTable({
  columns: {
    himnoId: column.number({ references: () => Himnos.columns.id }),
    numero: column.number({ primaryKey: true, autoIncrement: true }),
  },
});
const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    username: column.text({ unique: true, optional: false }),
    password: column.text(),
  },
});
const Session = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }), // probar poner cable primaria
    userId: column.text({ optional: false, references: () => User.columns.id }),
    expiresAt: column.number({ optional: false }),
  },
});
export default defineDb({
  tables: {
    Himnos,
    Himnario,
    Suplementario,
    Jovenes,
    User,
    Session,
  },
});
