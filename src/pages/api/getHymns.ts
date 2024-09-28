import type { APIContext, APIRoute } from 'astro';
import { db, Himnario, Himnos, Jovenes, Suplementario } from 'astro:db';

export const GET: APIRoute = async (context: APIContext) => {
  try {
    const hymns = await db.select().from(Himnos);
    const himnario = await db.select().from(Himnario);
    const jovenes = await db.select().from(Jovenes);
    const suplementario = await db.select().from(Suplementario);

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
