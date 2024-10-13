import type { APIRoute, APIContext } from 'astro';
import { db, Himnos, Himnario, Suplementario, Jovenes, eq } from 'astro:db';

export const POST: APIRoute = async (context: APIContext) => {
  const apiKey = context.request.headers.get('API_KEY');

  if (apiKey !== import.meta.env.API_KEY) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  const formData = await context.request.json();
  const numero = formData.numero;
  const himnario = formData.himnario;
  const numero2 = formData.numero2;
  const himnario2 = formData.himnario2;
  const titulo = formData.titulo;
  const letra = formData.letra;

  // Validaciones
  if (!himnario || !titulo || !letra) {
    return new Response('Todos los campos principales son requeridos', {
      status: 400,
    });
  }

  try {
    const existingHymn = async (typeHymnal, numero, title) => {
      if (typeHymnal === 'Jovenes') {
        const [exist] = await db
          .select()
          .from(Himnos)
          .where(eq(Himnos.titulo, title));
        return exist;
      }
      if (typeHymnal === 'Himnario') {
        const [exist] = await db
          .select()
          .from(Himnario)
          .where(eq(Himnario.numero, numero));
        return exist;
      }

      if (typeHymnal === 'Suplementario') {
        const [exist] = await db
          .select()
          .from(Suplementario)
          .where(eq(Suplementario.numero, numero));
        return exist;
      }
    };
    const exist = await existingHymn(himnario, numero, titulo);
    const exist2 = await existingHymn(himnario2, numero2, titulo);

    const errors = [];

    if (exist) {
      errors.push(`El himno ${numero} ya existe en ${himnario}`);
    }

    if (exist2) {
      errors.push(`El himno ${numero2} ya existe en ${himnario2}`);
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ message: errors.join(', ') }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
      await insertIntoHymnalTable(Himnario, numero, himno.id);
    } else if (himnario === 'Suplementario') {
      await insertIntoHymnalTable(Suplementario, numero, himno.id);
    } else if (himnario === 'Jovenes') {
      await db.insert(Jovenes).values({
        himnoId: himno.id,
      });
    }

    // Si hay un segundo himnario, insertar también allí
    if (himnario2 && numero2) {
      if (himnario2 === 'Himnario') {
        await insertIntoHymnalTable(Himnario, numero2, himno.id);
      } else if (himnario2 === 'Suplementario') {
        await insertIntoHymnalTable(Suplementario, numero2, himno.id);
      } else if (himnario2 === 'Jovenes') {
        await db.insert(Jovenes).values({
          himnoId: himno.id,
        });
      }
    }

    return new Response(
      JSON.stringify({ message: 'Himno agregado con éxito' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error al agregar el himno' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
