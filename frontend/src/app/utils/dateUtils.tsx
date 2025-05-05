// frontend/src/utils/dateUtils.ts
// frontend/src/utils/dateUtils.ts
export const formatDateTime = (dateTime: string): string => {
    if (!dateTime) return "NO ESPECIFICADO";
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return "FECHA INVÁLIDA"; // Manejar fechas inválidas
    const formattedDate = date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    return `${formattedDate} ${formattedTime}  `;
  };
  
  // frontend/src/components/eventossearch/EventosSearch.tsx
