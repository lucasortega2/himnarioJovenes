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
  const { id } = context.params;

  const formatId = Number(id);

  const numero = formData.numero;
  const formatNumero = Number(numero);
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
    // Obtener el himno actual para comparar
    const [currentHymn] = await db
      .select()
      .from(Himnos)
      .where(eq(Himnos.id, formatId));

    // Obtener el número actual del himno desde las tablas correspondientes
    const [currentHymnario] = await db
      .select()
      .from(Himnario)
      .where(eq(Himnario.himnoId, formatId));

    const [currentSuplementario] = await db
      .select()
      .from(Suplementario)
      .where(eq(Suplementario.himnoId, formatId));

    const [currentJovenes] = await db
      .select()
      .from(Jovenes)
      .where(eq(Jovenes.himnoId, formatId));
    // Validar que el himno no exista en los otros himnarios, excluyendo el actual

    const existingHymn = async (typeHymnal, numero, title) => {
      let query;
      if (typeHymnal === 'Jovenes') {
        query = db.select().from(Himnos).where(eq(Himnos.titulo, title));
      } else if (typeHymnal === 'Himnario') {
        query = db.select().from(Himnario).where(eq(Himnario.numero, numero));
      } else if (typeHymnal === 'Suplementario') {
        query = db
          .select()
          .from(Suplementario)
          .where(eq(Suplementario.numero, numero));
      }
      const [exist] = await query;
      return exist;
    };

    const errors = [];

    // Verificar si el título ha cambiado
    if (titulo !== currentHymn.titulo && himnario === 'Jovenes') {
      const exist = await existingHymn('Jovenes', null, titulo);
      if (exist) {
        errors.push(
          `El himno con el título '${titulo}' ya existe en 'Jovenes'`,
        );
      }
    }

    // Verificar el número del himnario
    const formatCurrentHymnarioNumber = currentHymnario?.numero;
    if (
      himnario === 'Himnario' &&
      formatNumero !== formatCurrentHymnarioNumber
    ) {
      const exist = await existingHymn(himnario, numero, null);

      if (exist) {
        errors.push(`El himno ${numero} ya existe en 'Himnario'`);
      }
    }
    //sup no tiene format number porque es un string
    const formatCurrentSuplementarioNumber = currentSuplementario?.numero;
    // Verificar el número del suplementario
    if (
      himnario === 'Suplementario' &&
      numero !== formatCurrentSuplementarioNumber
    ) {
      const exist = await existingHymn(himnario, numero, null);
      if (exist) {
        errors.push(`El himno ${numero} ya existe en 'Suplementario'`);
      }
    }

    // Verificar el número de jóvenes, nunca entra aca en el form del himnario ya que no se puede cambiar el numero y siempre va a ser diferente porque es auto
    if (himnario === 'Jovenes' && numero !== currentJovenes?.numero) {
      const exist = await existingHymn(himnario, numero, null);
      if (exist) {
        errors.push(`El himno ${numero} ya existe en 'Jovenes'`);
      }
    }
    if (himnario2) {
      if (himnario2 === 'Himnario' && numero2 !== currentHymnario?.numero) {
        const exist = await existingHymn(himnario2, numero2, null);
        if (exist) {
          errors.push(`El himno ${numero2} ya existe en 'Himnario'`);
        }
      } else if (
        himnario2 === 'Suplementario' &&
        numero2 !== currentSuplementario?.numero
      ) {
        const exist = await existingHymn(himnario2, numero2, null);
        if (exist) {
          errors.push(`El himno ${numero2} ya existe en 'Suplementario'`);
        }
      } else if (
        himnario2 === 'Jovenes' &&
        numero2 !== currentJovenes?.numero
      ) {
        const exist = await existingHymn(himnario2, numero2, null);
        if (exist) {
          errors.push(`El himno ${numero2} ya existe en 'Jovenes'`);
        }
      }
    }
    if (errors.length > 0) {
      return new Response(JSON.stringify({ message: errors.join(', ') }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const typeHimnals = {
      Himnario,
      Jovenes,
      Suplementario,
    };

    async function deleteTypeHymnalFromDb(type, id) {
      const table = typeHimnals[type];

      try {
        await db.delete(table).where(eq(table.himnoId, id));
      } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (currentHymnario && himnario !== 'Himnario') {
      await deleteTypeHymnalFromDb('Himnario', formatId);
    }

    if (currentSuplementario && himnario !== 'Suplementario') {
      await deleteTypeHymnalFromDb('Suplementario', formatId);
    }

    if (currentJovenes && himnario !== 'Jovenes') {
      await deleteTypeHymnalFromDb('Jovenes', formatId);
    }
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
    if (himnario2 && numero2) {
      if (himnario2 === 'Himnario') {
        await updateOrInsertIntoHymnalTable(Himnario, numero2, formatId);
      } else if (himnario2 === 'Suplementario') {
        await updateOrInsertIntoHymnalTable(Suplementario, numero2, formatId);
      } else if (himnario2 === 'Jovenes') {
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
    }

    return new Response(
      JSON.stringify({ message: 'Himno actualizado con éxito' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error al actualizar el himno' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
