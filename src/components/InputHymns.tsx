const InputHymns = ({ input, handleInput }) => {
  return (
    <div className="mb-8">
      <input
        onChange={handleInput}
        value={input}
        placeholder="Busca tu himno"
        type="text"
        className="w-full p-4 rounded-full bg-slate-200 text-slate-800 border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent duration-300 placeholder-slate-500 transition-transform transform hover:scale-105 focus:scale-105"
      />
    </div>
  );
};

export default InputHymns;
