const HimnarioSelector = ({ tipoHimnario, setTipoHimnario }) => {
  return (
    <div className="mb-6 mt-4">
      <label
        htmlFor="tipoHimnario"
        className="block text-sm font-medium text-white mb-2"
      >
        Selecciona el tipo de himnario:
      </label>
      <select
        id="tipoHimnario"
        value={tipoHimnario}
        onChange={(e) => setTipoHimnario(e.target.value)}
        className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="todos">Todos</option>
        <option value="himnario">Himnario</option>
        <option value="jovenes">Jóvenes</option>
        <option value="suplementario">Suplementario</option>
      </select>
    </div>
  );
};

export default HimnarioSelector;
