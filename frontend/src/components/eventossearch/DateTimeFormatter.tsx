"use client";

interface DateTimeFormatterProps {
  dateTime: string | Date | null | undefined; // Aceptar también valores de tipo Date
}

const DateTimeFormatter: React.FC<DateTimeFormatterProps> = ({ dateTime }) => {
  if (!dateTime) return <span>NO ESPECIFICADO</span>;

  const formatDateTime = (dateTime: string | Date): string => {
    const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;

    const formattedDate = date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return `${formattedDate} ${formattedTime}`;
  };

  return <span>{formatDateTime(dateTime)}</span>;
};

export default DateTimeFormatter;