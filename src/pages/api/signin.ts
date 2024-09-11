import { lucia } from '@/auth';
import { db, eq, User } from 'astro:db';
import { Argon2id } from 'oslo/password';
export async function POST(context): Promise<Response> {
  const formData = await context.request.formData();
  const username = formData.get('username');
  const password = formData.get('password');

  //validar datos

  if (typeof username !== 'string') {
    return new Response('Invalid username', { status: 400 });
  }
  if (typeof password !== 'string') {
    return new Response('Invalid username', { status: 400 });
  }
  //search the user
  const foundUser = (
    await db.select().from(User).where(eq(User.username, username))
  ).at(0);

  // if user not found

  if (!foundUser) {
    return new Response(
      JSON.stringify({ error: 'Incorrect username or password' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
  //validar password

  const validPassword = await new Argon2id().verify(
    foundUser.password,
    password,
  );
  if (!validPassword) {
    return new Response(
      JSON.stringify({ error: 'Incorrect username or password' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  // user can log in

  const session = await lucia.createSession(foundUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return new Response(
    JSON.stringify({ success: true, message: 'Login successful' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
