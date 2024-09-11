// components/HymnManagement.tsx
import React, { useState } from 'react';
import ButtonDeleteHymn from './ButtonDeleteHymn';

interface Hymn {
  id: number;
  titulo: string;
}

interface HymnManagementProps {
  initialHimnos: Hymn[];
}

const HymnManagement: React.FC<HymnManagementProps> = ({ initialHimnos }) => {
  const [himnos, setHimnos] = useState(initialHimnos);

  const handleDelete = (deletedId: number) => {
    setHimnos(himnos.filter((himno) => himno.id !== deletedId));
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        Editar o Eliminar Himnos
      </h2>
      <ul className="space-y-4">
        {himnos.map((himno) => (
          <li
            key={himno.id}
            className="flex items-center justify-between py-3 px-4 bg-slate-700 bg-opacity-50 rounded-xl hover:bg-opacity-70 transition-all duration-300"
          >
            <a href={`/himnos/${himno.id}`}>
              <span className="text-slate-200">{himno.titulo}</span>
            </a>
            <div>
              <a
                href={`/editHymn/${himno.id}`}
                className="text-blue-400 hover:text-blue-300 mr-2"
              >
                Editar
              </a>
              <ButtonDeleteHymn id={himno.id} onDelete={handleDelete} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HymnManagement;
