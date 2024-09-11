import { db, himnos } from 'astro:db';

// Función para poblar la base de datos con datos iniciales
export default async function seed() {
  await db.insert(himnos).values([
    {
      id: 1,
      titulo: 'Es un gozo inefable',
      letra: `
Encontramos a Cristo el Señor,
Nuestro todo en todo es El;
Oh, que bendicion el invocar
Su glorioso nombre fiel!

Es un gozo inefable y tan glorioso,
Tan glorioso, tan glorioso;
Es un gozo inefable y tan glorioso,
Y jamas se ha dicho la mitad.

Encontramos que Cristo el Señor
El Espiritu ahora es;
El en nuestro espíritu esta ,
Cerca y dulce a la vez!

Encontramos hoy como vivir,
Por Jesús, nuestro Señor;
Al comer, beber y disfrutar
Su Palabra en oracion.

Encontramos la iglesia local,
Y la provision total;
Nada en Babilonia hay que buscar,
Hoy la iglesia es nuestro hogar.

Encontramos que cada reunión
Es de gozo sin igual;
Nuestro espíritu no ha de fallar,
Nuestra vida llena está.`,
    },
  ]);
}
