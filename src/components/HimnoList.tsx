import HimnoItem from './HimnoItem';
import HimnarioSelector from './HimnarioSelector';
import InputHymns from './InputHymns';
import { useHimnos } from '../hooks/useHimnos';
import { useFavorites } from '../hooks/useFavorites';
import useInput from '@/hooks/useInput';

const HimnoList = ({
  himnos,
  jovenes,
  himnario,
  suplementario,
  isFavoritesPage = false,
}) => {
  const { tipoHimnario, setTipoHimnario, obtenerIdsYNumeros, filtrarHimnos } =
    useHimnos(himnos, jovenes, himnario, suplementario);
  const { favoritos, toggleFavorite, isFavorite } = useFavorites();
  const { input, handleInput } = useInput();

  const filteredHimnos = filtrarHimnos(
    input,
    isFavoritesPage ? favoritos : null,
  );
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isFavoritesPage ? 'Himnos Favoritos' : 'Listado de Himnos'}
        </h2>

        <InputHymns input={input} handleInput={handleInput} />

        <HimnarioSelector
          tipoHimnario={tipoHimnario}
          setTipoHimnario={setTipoHimnario}
        />

        {filteredHimnos.length > 0 ? (
          <ul className="space-y-3">
            {filteredHimnos.map((himno) => {
              const match = obtenerIdsYNumeros.find(
                (item) => item.id === himno.id,
              );
              const numero = match ? match.numero : null;

              return (
                <HimnoItem
                  key={himno.id}
                  himno={himno}
                  numero={numero}
                  isFavorite={isFavorite(himno.id)}
                  toggleFavorite={toggleFavorite}
                  isFavoritesPage={isFavoritesPage}
                />
              );
            })}
          </ul>
        ) : (
          <div className="text-center text-slate-200 mt-4">
            <p className="text-lg">
              {isFavoritesPage
                ? 'Aún no tienes himnos favoritos'
                : 'No se encontraron himnos'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HimnoList;
