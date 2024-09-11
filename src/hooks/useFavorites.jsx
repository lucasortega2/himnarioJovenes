import { useState, useEffect, useCallback } from 'react';

export function useFavorites() {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoritos')) || [];
    setFavoritos(storedFavorites);
  }, []);

  const toggleFavorite = useCallback((himnoId) => {
    setFavoritos((prevFavoritos) => {
      const updatedFavorites = prevFavoritos.includes(himnoId)
        ? prevFavoritos.filter((id) => id !== himnoId)
        : [...prevFavoritos, himnoId];
      localStorage.setItem('favoritos', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (himnoId) => favoritos.includes(himnoId),
    [favoritos],
  );

  return { favoritos, toggleFavorite, isFavorite };
}
