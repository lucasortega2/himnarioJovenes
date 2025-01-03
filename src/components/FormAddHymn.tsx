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
    numero?: string;
  };
}

const FormAddHymn: React.FC<FormAddHymnProps> = ({
  himno,
  numeroJovenes,
  numeroHimnario,
  numeroSuplementario,
}) => {
  const [numero, setNumero] = useState<string | number>('');
  const [numero2, setNumero2] = useState<string | number>('');
  const [himnario, setHimnario] = useState('seleccionar');
  const [himnario2, setHimnario2] = useState('seleccionar');
  const [titulo, setTitulo] = useState('');
  const [letra, setLetra] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const isMainFieldsFilled = numero !== '' && himnario !== '';

  useEffect(() => {
    if (himno) {
      setTitulo(himno.titulo || '');
      setLetra(himno.letra || '');

      // Fill the first set of inputs if available
      if (numeroJovenes) {
        setNumero(numeroJovenes.numero?.toString() || '');
        setHimnario('Jovenes');
      } else if (numeroHimnario) {
        setNumero(numeroHimnario.numero?.toString() || '');
        setHimnario('Himnario');
      } else if (numeroSuplementario) {
        setNumero(numeroSuplementario.numero?.toString() || '');
        setHimnario('Suplementario');
      }

      // Fill the second set of inputs if there's additional data
      if (numeroJovenes && (numeroHimnario || numeroSuplementario)) {
        if (numeroHimnario) {
          setNumero2(numeroHimnario.numero?.toString() || '');
          setHimnario2('Himnario');
        } else if (numeroSuplementario) {
          setNumero2(numeroSuplementario.numero?.toString() || '');
          setHimnario2('Suplementario');
        }
      } else if (numeroHimnario && numeroSuplementario) {
        setNumero2(numeroSuplementario.numero?.toString() || '');
        setHimnario2('Suplementario');
      }
    }
  }, [himno, numeroJovenes, numeroHimnario, numeroSuplementario]);
  const isYoung = himnario === 'Jovenes';

  useEffect(() => {
    if (isYoung) {
      setNumero('auto');
      setNumero2('');
      setHimnario2('seleccionar');
    }
  }, [himnario]);
  const himnarioOptions = ['Jovenes', 'Himnario', 'Suplementario'];
  const availableHimnarios = himnarioOptions.filter(
    (option) => option !== himnario,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    setResponse(null); // Resetea el estado de error antes de hacer la petición

    try {
      const response = await fetch(
        `${himno ? `/api/editHymn/${himno.id}/` : '/api/addHymn/addHymn'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            API_KEY: import.meta.env.PUBLIC_API_KEY,
          },
          body: JSON.stringify({
            numero,
            numero2,
            himnario,
            himnario2,
            titulo,
            letra,
          }),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        setError(true);
        setResponse(result.message || 'Error al agregar el himno'); // Establece el error si la respuesta no es exitosa
      } else {
        setError(false);
        setResponse(result.message);
        // setTimeout(() => {
        //   window.location.href = '/HymnManagement';
        // }, 600);
      }
    } catch (error) {
      setResponse('Error de servidor. Inténtalo más tarde.'); // Muestra error genérico si ocurre un fallo
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {response && (
        <div
          className={`text-sm font-medium ${error ? 'text-red-500' : 'text-green-400'} bg-opacity-100 bg-transparent`}
        >
          {response}
        </div>
      )}
      <div className="flex gap-4">
        <div className="flex-1">
          <label
            htmlFor="numero"
            className="block text-sm font-medium text-white  "
          >
            Número
          </label>
          <input
            type="text"
            id="numero"
            name="numero"
            required
            readOnly={isYoung}
            className={`h-10  mt-1 block w-full px-3 py-2  border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
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
            className="h-10 mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            value={himnario}
            onChange={(e) => setHimnario(e.target.value)}
          >
            <option value="seleccionar">Seleccioná un himnario</option>
            {himnarioOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-4 items-end">
        <div className="flex-1 ">
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
            className={`h-10 mt-1 block w-full px-3 py-2  border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
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
            className={`h-10 mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent ${
              !isMainFieldsFilled || isYoung
                ? 'bg-slate-600 cursor-not-allowed opacity-50'
                : 'bg-slate-700'
            }`}
            value={himnario2}
            onChange={(e) => setHimnario2(e.target.value)}
            disabled={isYoung || !isMainFieldsFilled}
          >
            <option value="seleccionar">seleccioná un himnario</option>
            {availableHimnarios.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
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
        {himno ? 'Editar himno' : 'Agregar himno'}
      </button>
    </form>
  );
};

export default FormAddHymn;
