import { useEffect, useState } from 'react';

interface FormAddHymnProps {
  himno?: {
    id?: string;
    titulo: string;
    letra: string;
  };
  numeroJovenes?: {
    numero: string;
  };
  numeroHimnario?: {
    numero: string;
  };
  numeroSuplementario?: {
    numero: string;
  };
}

const FormAddHymn: React.FC<FormAddHymnProps> = ({
  himno,
  numeroJovenes,
  numeroHimnario,
  numeroSuplementario,
}) => {
  const [numero, setNumero] = useState<string>('');
  const [numero2, setNumero2] = useState<string>('');
  const [himnario, setHimnario] = useState<string>('Seleccionar');
  const [himnario2, setHimnario2] = useState<string>('Seleccionar');
  const [titulo, setTitulo] = useState<string>('');
  const [letra, setLetra] = useState<string>('');

  useEffect(() => {
    if (himno) {
      setTitulo(himno.titulo);
      setLetra(himno.letra);
      if (numeroJovenes) {
        setNumero(numeroJovenes.numero);
        setHimnario('Jovenes');
      } else if (numeroHimnario) {
        setNumero(numeroHimnario.numero);
        setHimnario('Himnario');
      }
      if (numeroSuplementario) {
        setNumero2(numeroSuplementario.numero);
        setHimnario2('Suplementario');
      }
    }
  }, [himno, numeroJovenes, numeroHimnario, numeroSuplementario]);

  const isYoung = himnario === 'Jovenes';
  useEffect(() => {
    if (isYoung) {
      setNumero('auto');
    }
  }, [himnario]);

  const isMainFieldsFilled =
    numero !== '' &&
    himnario.trim() !== '' &&
    himnario.trim() !== 'Seleccionar';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = himno ? `/api/editHymn/${himno.id}` : '/api/addHymn/addHymn';

    const formData = new FormData();
    formData.append('numero', numero);
    formData.append('numero2', numero2);
    formData.append('himnario', himnario);
    formData.append('himnario2', himnario2);
    formData.append('titulo', titulo);
    formData.append('letra', letra);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('Himno agregado/editado con éxito');
      } else {
        console.error('Error al procesar el himno');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form content here */}
    </form>
  );
};

export default FormAddHymn;
