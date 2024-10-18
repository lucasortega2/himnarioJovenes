import { MdiHeartPlusOutline } from './Heart';
import { HugeiconsHeartRemove } from './removeFavs';
import { Pencil } from 'lucide-react';
import ButtonDeleteHymn from './ButtonDeleteHymn';
import ButtonsManagement from './ButtonsManagement';

const HimnoItem = ({
  himno,
  numero,
  isFavorite,
  toggleFavorite,
  isFavoritesPage,
  isManagement = false,
  handleDelete,
}) => {
  return (
    <li className="flex items-center h-[50px] justify-between py-3 px-4 bg-slate-700 bg-opacity-50 rounded-xl hover:bg-opacity-70 transition-all duration-300">
      <a
        href={`/himnos/${himno.id}`}
        className="text-slate-200 hover:text-white transition-colors duration-300 flex-grow"
      >
        <span className="font-medium">{himno.titulo}</span>
        {numero && (
          <span className="ml-2 text-sm text-slate-400">({numero})</span>
        )}
      </a>
      {isManagement ? (
        <ButtonsManagement id={himno.id} onDelete={handleDelete} />
      ) : (
        <button
          onClick={() => toggleFavorite(himno.id)}
          className={`ml-2 p-1 rounded-full hover:bg-slate-600 transition-all duration-300 ${
            isFavoritesPage
              ? 'text-red-500 hover:text-red-700'
              : 'text-slate-300 hover:text-white'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <HugeiconsHeartRemove className="w-6 h-6" />
          ) : (
            <MdiHeartPlusOutline className="w-6 h-6" />
          )}
        </button>
      )}
    </li>
  );
};

export default HimnoItem;
