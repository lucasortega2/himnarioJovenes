import type { APIContext, APIRoute } from 'astro';
import { db, Himnos } from 'astro:db';

export const GET: APIRoute = async (context: APIContext) => {
  try {
    const hymns = await db.select().from(Himnos);
    return new Response(JSON.stringify(hymns), {
      status: 200,
      headers: {
        'content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener himnos' }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
};
