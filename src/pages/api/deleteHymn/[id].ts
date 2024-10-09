import type { APIRoute, APIContext } from 'astro';
import { db, Himnos, Himnario, Suplementario, Jovenes, eq } from 'astro:db';

export const DELETE: APIRoute = async (context: APIContext) => {
  const apiKey = context.request.headers.get('API_KEY');

  if (apiKey !== import.meta.env.API_KEY) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }
  const { id } = context.params;
  const himnoId = Number(id);

  if (!himnoId) {
    return new Response('ID del himno es requerido', { status: 400 });
  }

  try {
    // Eliminar de la tabla Jovenes
    await db.delete(Jovenes).where(eq(Jovenes.himnoId, himnoId));

    // Eliminar de la tabla Suplementario
    await db.delete(Suplementario).where(eq(Suplementario.himnoId, himnoId));

    // Eliminar de la tabla Himnario
    await db.delete(Himnario).where(eq(Himnario.himnoId, himnoId));

    // Finalmente, eliminar de la tabla Himnos
    const deletedHimno = await db
      .delete(Himnos)
      .where(eq(Himnos.id, himnoId))
      .returning();

    if (deletedHimno.length === 0) {
      return new Response('Himno no encontrado', { status: 404 });
    }

    return context.redirect('/HymnManagement');
  } catch (error) {
    console.error('Error al eliminar el himno:', error);
    return new Response('Error al eliminar el himno', { status: 500 });
  }
};
