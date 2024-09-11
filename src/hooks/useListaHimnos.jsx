import { useEffect, useState } from 'react';

const useListaHimnos = () => {
  const [favoritos, setFavoritos] = useState([]);

  // Cargar favoritos desde localStorage al cargar la página
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoritos')) || [];
    setFavoritos(storedFavorites);
  }, []);

  // Almacenar favoritos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const addToFavorites = (himnoId) => {
    if (!favoritos.includes(himnoId)) {
      setFavoritos([...favoritos, himnoId]);
    } else {
      // Si el himno ya está en favoritos, quitarlo de la lista
      setFavoritos(favoritos.filter((id) => id !== himnoId));
    }
  };
  const isFavorite = (himnoId) => favoritos.includes(himnoId);
  return { favoritos, addToFavorites, isFavorite };
};

export default useListaHimnos;
