//frontend\src\app\portal\eventos\redes\ResultCard.tsx
import Image from 'next/image';

interface ResultCardProps {
  interno: any;
  isPrioritized: boolean;
  handlePrioritize: (id: number) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ interno, isPrioritized, handlePrioritize }) => {
  return (
    <div
      className={`p-4 mb-4 rounded-lg shadow-lg ${isPrioritized ? 'bg-cyan-700 text-black' : 'bg-green-100 hover:bg-green-200'}`}
    >
      <div className="flex items-center">
        <Image
          src={interno.imagen ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${interno.imagen}` : '/images/silueta.png'}
          alt="Imagen del interno"
          width={64}
          height={64}
          className="rounded-md mr-4"
        />
        <div>
          <p className="text-lg font-bold">{interno.nombres} {interno.apellido} - LPU: {interno.lpu} - Sit. proc. {interno.sitProc}</p>
          <p>LPU Prov: {interno.lpuProv}</p>
          <p>DNI: {interno.numeroDni}</p>
        </div>
      </div>
      <p>Historial:</p>
      {interno.historial?.split('\n').map((entry: string, index: number) => (
        <p key={index} className="bg-blue-100 p-2 py-0 my-2 rounded-lg">{entry}</p>
      ))}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 mt-4"
        onClick={() => handlePrioritize(interno.id)}
      >
        Dar prioridad de red
      </button>
    </div>
  );
};

export default ResultCard;