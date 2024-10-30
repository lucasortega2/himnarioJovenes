import type { APIContext, APIRoute } from 'astro';
import { db, Himnario, Himnos, Jovenes, Suplementario } from 'astro:db';

export const GET: APIRoute = async (context: APIContext) => {
  try {
    const hymns = await db.select().from(Himnos);
    const himnario = await db.select().from(Himnario).orderBy(Himnario.numero);
    const jovenes = await db.select().from(Jovenes).orderBy(Jovenes.numero);
    console.log(jovenes);

    const suplementario = await db
      .select()
      .from(Suplementario)
      .orderBy(Suplementario.numero);

    return new Response(
      JSON.stringify({ hymns, himnario, jovenes, suplementario }),
      {
        status: 200,
        headers: {
          'content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener himnos' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
