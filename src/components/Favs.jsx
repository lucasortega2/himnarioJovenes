import HimnoList from './HimnoList';

const Favs = ({ himnos, jovenes, himnario, suplementario }) => {
  return (
    <HimnoList
      himnos={himnos}
      jovenes={jovenes}
      himnario={himnario}
      suplementario={suplementario}
      isFavoritesPage={true}
    />
  );
};

export default Favs;
