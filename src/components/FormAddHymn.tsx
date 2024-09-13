import { useEffect, useState } from 'react';

interface FormAddHymnProps {
  himno?: {
    id?: number;
    titulo?: string;
    letra?: string;
    acorde?: string | null;
  };
  numeroJovenes?: {
    himnoId?: number;
    numero?: number;
  };
  numeroHimnario?: {
    himnoId?: number;
    numero?: number;
  };
  numeroSuplementario?: {
    himnoId?: number;
    numero?: number;
  };
}

const FormAddHymn: React.FC<FormAddHymnProps> = ({
  himno,
  numeroJovenes,
  numeroHimnario,
  numeroSuplementario,
}) => {
  const [numero, setNumero] = useState<string | number>('');

  const [numero2, setNumero2] = useState<string | number | undefined>(
    undefined,
  );

  const [himnario, setHimnario] = useState('seleccionar');
  const [himnario2, setHimnario2] = useState('seleccionar');
  const [titulo, setTitulo] = useState('');
  const [letra, setLetra] = useState('');

  const isMainFieldsFilled = numero !== '' && himnario !== '';

  useEffect(() => {
    if (himno) {
      setTitulo(himno.titulo || '');
      setLetra(himno.letra || '');
      if (numeroJovenes) {
        setNumero(numeroJovenes.numero);
        setHimnario('Jovenes');
      } else if (numeroHimnario) {
        setNumero(numeroHimnario.numero);
        setHimnario('Himnario');
      }
      if (numeroSuplementario) {
        setNumero2(numeroSuplementario.numero);
        setHimnario2('Suplementario');
      }
    }
  }, [himno, numeroJovenes, numeroHimnario, numeroSuplementario]);
  const isYoung = himnario === 'Jovenes';
  useEffect(() => {
    if (isYoung) {
      setNumero('auto');
    }
  }, [himnario]);

  return (
    <form
      method="post"
      action={`${himno ? `/api/editHymn/${himno.id}/` : '/api/addHymn/addHymn'}`}
      className="space-y-4"
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <label
            htmlFor="numero"
            className="block text-sm font-medium text-white"
          >
            Número
          </label>
          <input
            type="text"
            id="numero"
            name="numero"
            required
            readOnly={isYoung}
            className={`mt-1 block w-full px-3 py-2  border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
              isYoung
                ? 'bg-slate-600 cursor-not-allowed opacity-50'
                : 'bg-slate-700'
            }`}
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label id="himnario" className="block text-sm font-medium text-white">
            Tipo de Himnario
          </label>
          <select
            name="himnario"
            id="himnario"
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            value={himnario}
            onChange={(e) => setHimnario(e.target.value)}
          >
            <option value="seleccionar">seleccioná un himnario</option>
            <option value="Himnario">Himnario</option>
            <option value="Suplementario">Suplementario</option>
            <option value="Jovenes">Jóvenes</option>
          </select>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label
            htmlFor="numero2"
            className="block text-sm font-medium text-white"
          >
            Número (Opcional)
          </label>
          <input
            type="text"
            id="numero2"
            name="numero2"
            className={`mt-1 block w-full px-3 py-2  border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
              !isMainFieldsFilled || isYoung
                ? 'bg-slate-600 cursor-not-allowed opacity-50'
                : 'bg-slate-700'
            }`}
            value={numero2}
            onChange={(e) => setNumero2(e.target.value)}
            disabled={isYoung || !isMainFieldsFilled}
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="himnario2"
            className="block text-sm font-medium text-white"
          >
            Tipo de Himnario (Opcional)
          </label>
          <select
            name="himnario2"
            id="himnario2"
            className={`mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
              !isMainFieldsFilled || isYoung
                ? 'bg-slate-600 cursor-not-allowed opacity-50'
                : 'bg-slate-700'
            }`}
            value={himnario2}
            onChange={(e) => setHimnario2(e.target.value)}
            disabled={isYoung || !isMainFieldsFilled}
          >
            <option value="seleccionar">seleccioná un himnario</option>
            <option value="Himnario">Himnario</option>
            <option value="Suplementario">Suplementario</option>
          </select>
        </div>
      </div>
      <div>
        <label
          htmlFor="titulo"
          className="block text-sm font-medium text-white"
        >
          Título
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          required
          className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="letra" className="block text-sm font-medium text-white">
          Letra
        </label>
        <textarea
          id="letra"
          name="letra"
          rows={8}
          required
          className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          value={letra}
          onChange={(e) => setLetra(e.target.value)}
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Agregar Himno
      </button>
    </form>
  );
};

export default FormAddHymn;
