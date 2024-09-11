import type { APIRoute, APIContext } from 'astro';
import { db, Himnos, Himnario, Suplementario, Jovenes } from 'astro:db';

export const POST: APIRoute = async (context: APIContext) => {
  const formData = await context.request.formData();
  const numero = formData.get('numero');
  const formatNumero = Number(numero);
  const himnario = formData.get('himnario');
  const numero2 = formData.get('numero2');
  const formatNumero2 = Number(numero2);
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
    // Insertar el himno principal
    const [himno] = await db
      .insert(Himnos)
      .values({
        titulo: titulo.toString(),
        letra: letra.toString(),
      })
      .returning();

    // Función para insertar en la tabla correspondiente
    async function insertIntoHymnalTable(table, numero, himnoId) {
      if (numero && numero !== 'Auto') {
        await db.insert(table).values({
          himnoId,
          numero,
        });
      }
    }

    // Insertar en la tabla del primer himnario
    if (himnario === 'Himnario') {
      await insertIntoHymnalTable(Himnario, formatNumero, himno.id);
    } else if (himnario === 'Suplementario') {
      await insertIntoHymnalTable(Suplementario, formatNumero, himno.id);
    } else if (himnario === 'Jovenes') {
      await db.insert(Jovenes).values({
        himnoId: himno.id,
      });
    }

    // Si hay un segundo himnario, insertar también allí
    if (himnario2 && numero2) {
      if (himnario2 === 'Himnario') {
        await insertIntoHymnalTable(Himnario, formatNumero2, himno.id);
      } else if (himnario2 === 'Suplementario') {
        await insertIntoHymnalTable(Suplementario, formatNumero2, himno.id);
      } else if (himnario2 === 'Jovenes') {
        await db.insert(Jovenes).values({
          himnoId: himno.id,
        });
      }
    }

    return context.redirect('/HymnManagement');
  } catch (error) {
    console.error('Error al agregar el himno:', error);
    return new Response('Error al agregar el himno', { status: 500 });
  }
};
