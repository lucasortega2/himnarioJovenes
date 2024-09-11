import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { db, eq, User } from 'astro:db';
import { lucia } from '@/auth';

export async function POST(context): Promise<Response> {
  try {
    // Parsear los datos del formulario
    const formData = await context.request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    // Validar los datos del formulario
    if (!username || !password) {
      return new Response('Username and Password are required', {
        status: 400,
      });
    }
    if (typeof username !== 'string' || username.length < 4) {
      return new Response('Username must be at least 4 characters long', {
        status: 400,
      });
    }
    if (typeof password !== 'string' || password.length < 4) {
      return new Response('Password must be at least 4 characters long', {
        status: 400,
      });
    }

    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await db
      .select()
      .from(User)
      .where(eq(User.username, username))
      .get();

    if (existingUser) {
      // Devolver una respuesta JSON con el mensaje de error
      return new Response(
        JSON.stringify({ message: 'Username is already taken' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Insertar el nuevo usuario en la base de datos
    const userId = generateId(15);
    const hashedPassword = await new Argon2id().hash(password);
    await db.insert(User).values([
      {
        id: userId,
        username,
        password: hashedPassword,
      },
    ]);

    // Generar una nueva sesión
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    // Respuesta exitosa
    return new Response(
      JSON.stringify({ success: true, message: 'Sign up successful' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error en el registro:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An error occurred during sign up',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
