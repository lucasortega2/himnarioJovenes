import type { APIRoute, APIContext } from 'astro';
import { db, Himnos, Himnario, Suplementario, Jovenes, eq } from 'astro:db';

export const POST: APIRoute = async (context: APIContext) => {
  const formData = await context.request.formData();
  const { id } = context.params;
  const formatId = Number(id);
  const numero = formData.get('numero');
  const himnario = formData.get('himnario');
  const numero2 = formData.get('numero2');
  const himnario2 = formData.get('himnario2');
  const titulo = formData.get('titulo');
  const letra = formData.get('letra');

  // Validaciones
  if (!himnario || !titulo || !letra) {
    return new Response('Todos los campos principales son requeridos', {
      status: 400,
    });
  }

  try {
    // Actualizar el himno principal
    await db
      .update(Himnos)
      .set({
        titulo: titulo.toString(),
        letra: letra.toString(),
      })
      .where(eq(Himnos.id, formatId));

    // Función para actualizar o insertar en la tabla correspondiente
    async function updateOrInsertIntoHymnalTable(table, numero, himnoId) {
      if (numero && numero !== 'Auto') {
        const existingEntry = await db
          .select()
          .from(table)
          .where(eq(table.himnoId, himnoId));
        if (existingEntry.length > 0) {
          // Actualiza si ya existe
          await db
            .update(table)
            .set({ numero })
            .where(eq(table.himnoId, himnoId));
        } else {
          // Inserta si no existe
          await db.insert(table).values({
            himnoId,
            numero,
          });
        }
      }
    }

    // Actualizar/insertar en la tabla del primer himnario
    if (himnario === 'Himnario') {
      await updateOrInsertIntoHymnalTable(Himnario, numero, formatId);
    } else if (himnario === 'Suplementario') {
      await updateOrInsertIntoHymnalTable(Suplementario, numero, formatId);
    } else if (himnario === 'Jovenes') {
      const existingEntry = await db
        .select()
        .from(Jovenes)
        .where(eq(Jovenes.himnoId, formatId));
      if (existingEntry.length > 0) {
        await db
          .update(Jovenes)
          .set({ himnoId: formatId })
          .where(eq(Jovenes.himnoId, formatId));
      } else {
        await db.insert(Jovenes).values({
          himnoId: formatId,
        });
      }
    }

    // Si hay un segundo himnario, actualizar/insertar también allí
    if (himnario2 && numero2 && himnario2 !== 'Seleccionar') {
      if (himnario2 === 'Himnario') {
        await updateOrInsertIntoHymnalTable(Himnario, numero2, formatId);
      } else if (himnario2 === 'Suplementario') {
        await updateOrInsertIntoHymnalTable(Suplementario, numero2, formatId);
      } else if (himnario2 === 'Jovenes') {
        const existingEntry2 = await db
          .select()
          .from(Jovenes)
          .where(eq(Jovenes.himnoId, formatId));
        if (existingEntry2.length > 0) {
          await db
            .update(Jovenes)
            .set({ himnoId: formatId })
            .where(eq(Jovenes.himnoId, formatId));
        } else {
          await db.insert(Jovenes).values({
            himnoId: formatId,
          });
        }
      }
    }

    return context.redirect('/HymnManagement');
  } catch (error) {
    console.error('Error al actualizar el himno:', error);
    return new Response('Error al actualizar el himno', { status: 500 });
  }
};
