import { Pencil } from 'lucide-react';
import ButtonDeleteHymn from './ButtonDeleteHymn';
interface ButtonDeleteHymnProps {
  id: number;
  onDelete: (id: number) => void;
}
const ButtonsManagement: React.FC<ButtonDeleteHymnProps> = ({
  id,
  onDelete,
}) => {
  return (
    <div className="flex shrink-0">
      <a
        href={`/editHymn/${id}`}
        className="text-blue-400 hover:text-blue-300 mr-2"
      >
        <Pencil />
      </a>
      <ButtonDeleteHymn id={id} onDelete={onDelete} />
    </div>
  );
};

export default ButtonsManagement;
