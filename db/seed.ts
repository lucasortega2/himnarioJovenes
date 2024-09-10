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
    {
      id: 2,
      titulo: 'Oh, ven y bebe',
      letra: `
Bebe! Fluye un río desde el trono del Señor;
Come! El arbol de la vida con sus frutos hoy;
Mira! Aqui no hay sol ni luna o luz artificial,
pues No hay oscuridad!

Oh, ven y bebe,
Hay agua en plenitud;
Dicen la novia
Y el Espíritu;
Oh, ven y bebe,
Hasta tu sed calmar
Con agua de vida eternal.

Cristo el río, Cristo el agua,
fluye en lo interior;
Cristo el arbol, Cristo el fruto es nuestro
gozo hoy;
Cristo el día, Cristo el brillo, Cristo el
resplandor,
Cristo es lo mejor!

Hoy lavamos nuestras ropas para asi comer,
De ese arbol de la vida, Aleluya! Amén!
Cuando ejercitamos nuestro espíritu se ve
Cuán Dulce Cristo es!

Ya tenemos un hogar que brilla más que el sol,
Donde en armonía los hermanos uno son;
Al reunirnos como iglesia se muestra al Señor
En la localidad.`,
    },
  ]);
}
