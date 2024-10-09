import type { APIContext, APIRoute } from 'astro';
import { db, Himnario, Himnos, Jovenes, Suplementario } from 'astro:db';

export const GET: APIRoute = async (context: APIContext) => {
  const apiKey = context.request.headers.get('API_KEY');

  if (apiKey !== import.meta.env.API_KEY) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

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
