import { useState, useMemo } from 'react';

export function useHimnos(himnos, jovenes, himnario, suplementario) {
  const [tipoHimnario, setTipoHimnario] = useState('todos');

  const obtenerIdsYNumeros = useMemo(() => {
    const idSets = {
      jovenes: jovenes.map((item) => ({
        id: item.himnoId,
        numero: `J${item.numero}`,
      })),
      suplementario: suplementario.map((item) => ({
        id: item.himnoId,
        numero: `S${item.numero}`,
      })),
      himnario: himnario.map((item) => ({
        id: item.himnoId,
        numero: `H${item.numero}`,
      })),
      todos: himnos.map((item) => {
        // Aquí NO reordenes, simplemente mapea en el mismo orden
        const numeros = [];

        const jovenNumber = jovenes.find((j) => j.himnoId === item.id)?.numero;
        const himnarioNumber = himnario.find(
          (h) => h.himnoId === item.id,
        )?.numero;
        const suplementarioNumber = suplementario.find(
          (s) => s.himnoId === item.id,
        )?.numero;

        if (jovenNumber) numeros.push(`J${jovenNumber}`);
        if (himnarioNumber) numeros.push(`H${himnarioNumber}`);
        if (suplementarioNumber) numeros.push(`S${suplementarioNumber}`);

        return {
          id: item.id,
          numero: numeros.length > 0 ? numeros.join(', ') : null,
        };
      }),
    };

    return idSets[tipoHimnario];
  }, [tipoHimnario, jovenes, himnario, suplementario, himnos]);

  const filtrarHimnos = (input, favoritos = null) => {
    // Ahora usarás directamente "obtenerIdsYNumeros"
    const listado = obtenerIdsYNumeros; // Este ya es el array filtrado por 'tipoHimnario'

    return listado
      .map((item) => {
        const himnoCompleto = himnos.find((h) => h.id === item.id);
        if (!himnoCompleto) return null;

        if (favoritos && !favoritos.includes(himnoCompleto.id)) return null;

        const tituloMatch = himnoCompleto.titulo
          .toLowerCase()
          .includes(input.toLowerCase());
        const numeroMatch =
          item.numero &&
          item.numero.toLowerCase().includes(input.toLowerCase());

        return tituloMatch || numeroMatch ? himnoCompleto : null;
      })
      .filter(Boolean);
  };

  return {
    tipoHimnario,
    setTipoHimnario,
    obtenerIdsYNumeros, // <- Este es tu array final
    filtrarHimnos,
  };
}
