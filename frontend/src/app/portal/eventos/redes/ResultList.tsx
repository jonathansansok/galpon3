//frontend\src\app\portal\eventos\redes\ResultList.tsx
import ResultCard from './ResultCard';

interface ResultListProps {
  filteredData: any[];
  prioritizedId: number | null;
  handlePrioritize: (id: number) => void;
}

const ResultList: React.FC<ResultListProps> = ({ filteredData, prioritizedId, handlePrioritize }) => {
  return (
    <>
      {Array.isArray(filteredData) && filteredData.length > 0 ? (
        filteredData.map((interno) => (
          <ResultCard
            key={interno.id}
            interno={interno}
            isPrioritized={prioritizedId === interno.id}
            handlePrioritize={handlePrioritize}
          />
        ))
      ) : (
        <p>No se encontraron resultados</p>
      )}
    </>
  );
};

export default ResultList;