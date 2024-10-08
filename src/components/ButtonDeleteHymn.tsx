// components/ButtonDeleteHymn.tsx
import { Trash2 } from 'lucide-react';
import React from 'react';

interface ButtonDeleteHymnProps {
  id: number;
  onDelete: (id: number) => void;
}

const ButtonDeleteHymn: React.FC<ButtonDeleteHymnProps> = ({
  id,
  onDelete,
}) => {
  const deleteHymn = () => {
    if (confirm('¿Estás seguro de que quieres eliminar este himno?')) {
      fetch(`/api/deleteHymn/${id}`, {
        headers: {
          API_KEY: import.meta.env.PUBLIC_API_KEY,
        },
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            onDelete(id);
          } else {
            throw new Error('Error al eliminar el himno');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Error al eliminar el himno');
        });
    }
  };

  return (
    <button
      onClick={deleteHymn}
      className="delete-hymn-btn text-red-400 hover:text-red-300"
    >
      <Trash2 />
    </button>
  );
};

export default ButtonDeleteHymn;
