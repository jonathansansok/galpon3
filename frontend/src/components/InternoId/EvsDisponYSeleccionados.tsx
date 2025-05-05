//frontend\src\components\InternoId\EvsDisponYSeleccionados.tsx
import { FaCheckSquare, FaSquare } from "react-icons/fa";

interface EventListProps {
  eventosDisponibles: string[];
  eventosSeleccionados: string[];
  toggleEvento: (evento: string) => void;
  selectAll: boolean;
  toggleSelectAll: () => void;
  eventosHumanizados: { [key: string]: string }; // Añadir el mapeo de títulos humanizados
}

const EventList = ({
  eventosDisponibles,
  eventosSeleccionados,
  toggleEvento,
  selectAll,
  toggleSelectAll,
  eventosHumanizados, // Añadir el mapeo de títulos humanizados
}: EventListProps) => {
  return (
    <div className="mt-4">
      <label>Seleccionar entidades para ver y descargar:</label>
      <div className="flex flex-wrap mt-2 gap-2">
        <button
          type="button"
          className={`custom-button ${
            selectAll ? "bg-red-500 text-white" : "bg-blue-500 text-white"
          }`}
          style={{
            backgroundColor: selectAll ? "#ef4444" : "#3b82f6",
            color: "#ffffff",
          }}
          onClick={toggleSelectAll}
        >
          {selectAll ? "Ninguno" : "Todos"}
        </button>
        {eventosDisponibles.map((evento, index) => (
          <button
            key={`${evento}-${index}`}
            className={`custom-button ${
              eventosSeleccionados.includes(evento)
                ? "custom-button-selected"
                : ""
            }`}
            onClick={() => toggleEvento(evento)}
          >
            {eventosHumanizados[evento] || evento.charAt(0).toUpperCase() + evento.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventList;