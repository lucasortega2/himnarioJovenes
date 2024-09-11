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
    return himnos.filter((himno) => {
      if (favoritos && !favoritos.includes(himno.id)) return false;

      const match = obtenerIdsYNumeros.find((item) => item.id === himno.id);
      if (!match) return false;

      return (
        himno.titulo.toLowerCase().includes(input.toLowerCase()) ||
        (match.numero &&
          match.numero.toString().toLowerCase().includes(input.toLowerCase()))
      );
    });
  };

  return {
    tipoHimnario,
    setTipoHimnario,
    obtenerIdsYNumeros,
    filtrarHimnos,
  };
}
