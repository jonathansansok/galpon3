//frontend\src\components\eventossearch\EventosSearch.tsx
import React, { useState } from "react";
import EditButton from "@/components/ui/buttons/EditButton";
import DownloadButton from "@/components/words/DownloadButton";
import DateRangeFilter from "@/components/ui/FechasFilter/DateRangeFilter";
import { parseISO, isWithinInterval } from "date-fns";
import { formatDateTime } from "@/app/utils/dateUtils";
import { camposPorEvento } from "@/app/utils/eventFields"; // Importar camposPorEvento

interface Evento {
  tipo: string;
  [key: string]: any;
}

interface EventDetailProps {
  evento: Evento;
  eventosHumanizados: { [key: string]: string }; // Añadir el mapeo de títulos humanizados
}

const EventDetail: React.FC<EventDetailProps> = ({ evento, eventosHumanizados }) => {
  const campos = camposPorEvento[evento.tipo] || [];
  const url = `/portal/eventos/${evento.tipo}/${evento.id}/edit`;

  const renderField = (label: string, value: any) => {
    if (value === null || value === undefined) return null;

    return (
      <p key={label}>
        <strong>{label}:</strong> {value.toString()}
      </p>
    );
  };

  return (
    <li className="mb-4 border-b-2 border-blue-500 pb-2 break-words overflow-hidden">
      <EditButton url={url} />
      {campos.map((campo: string) => renderField(campo, evento[campo]))}
    </li>
  );
};

interface EventosSearchProps {
  eventos: Evento[];
  ingreso: any;
  eventosHumanizados: { [key: string]: string }; // Añadir el mapeo de títulos humanizados
}

const EventosSearch: React.FC<EventosSearchProps> = ({ eventos, ingreso, eventosHumanizados }) => {
  const [filteredEventos, setFilteredEventos] = useState(eventos);

  const handleFilter = (
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => {
    if (startDate && endDate) {
      const filtered = eventos.filter((evento) => {
        const eventDate = parseISO(evento.fechaHora);
        return isWithinInterval(eventDate, { start: startDate, end: endDate });
      });
      setFilteredEventos(filtered);
    } else {
      setFilteredEventos(eventos);
    }
  };

  const groupedEventos = filteredEventos.reduce((acc, evento) => {
    if (!acc[evento.tipo]) {
      acc[evento.tipo] = [];
    }
    acc[evento.tipo].push(evento);
    return acc;
  }, {} as { [key: string]: Evento[] });

  const renderEventos = () => {
    return Object.keys(groupedEventos).map((tipo) => (
      <div key={tipo}>
        <h2 className="text-2xl font-bold mb-4 text-white bg-blue-500 shadow-lg p-2 rounded">
          {eventosHumanizados[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1)}
        </h2>
        <ul>
          {groupedEventos[tipo].map((evento, index) => (
            <EventDetail
              key={`${evento.tipo}-${evento.id}-${index}`}
              evento={evento}
              eventosHumanizados={eventosHumanizados} // Pasar el mapeo de títulos humanizados
            />
          ))}
        </ul>
      </div>
    ));
  };

  const formatEventDates = (eventos: Evento[]) => {
    return eventos.map((evento) => {
      const formattedEvento = { ...evento };
      // Eliminar el formateo de fechas
      return formattedEvento;
    });
  };

  const title = `Historial de ${ingreso.apellido}, ${ingreso.nombres} L.P.U (${ingreso.lpu}) DNI (${ingreso.dni}) L.P.U Prov (${ingreso.lpuProv}) Establecimiento (${ingreso.establecimiento}) Módulo - U.R. (${ingreso.modulo_ur}) Pabellón (${ingreso.pabellon})`;

  return (
    <>
      <DateRangeFilter onFilter={handleFilter} />
      <DownloadButton
  content={formatEventDates(filteredEventos)}
  title={title}
  eventosHumanizados={eventosHumanizados} // Pasar el mapeo humanizado
/>
      {renderEventos()}
    </>
  );
};

export default EventosSearch;