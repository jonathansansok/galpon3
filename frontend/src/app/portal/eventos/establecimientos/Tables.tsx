//frontend\src\app\portal\eventos\establecimientos\Tables.tsx
import Table from "@/components/eventossearch/Table";
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
import { Sumario } from "@/types/Sumario";

interface TableProps {
  data: any[];
  columns: { key: string; label: string; render?: (item: any) => JSX.Element }[]; // Agregar soporte para render
  sortColumn: string | number | symbol | null;
  sortDirection: "asc" | "desc";
  onSort: (column: string | number | symbol) => void;
  onRowClick: (id: string) => void;
  onEditClick: (id: string) => void;
  onViewClick: (id: string) => void;
}

export const GenericTable = ({
  data = [],
  columns,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  onEditClick,
  onViewClick,
}: TableProps) => {
  // Modificar las columnas para formatear fechas automáticamente
  const formattedColumns = columns.map((column) => {
    if (["createdAt", "updatedAt", "fechaHora", "fechaHoraCierre"].includes(column.key)) {
      return {
        ...column,
        render: (item: any) => <DateTimeFormatter dateTime={item[column.key]} />, // Usar DateTimeFormatter
      };
    }
    return column;
  });

  return (
    <Table
      data={data}
      columns={formattedColumns} // Usar las columnas formateadas
      sortColumn={sortColumn as keyof Sumario}
      sortDirection={sortDirection}
      onSort={onSort}
      onRowClick={onRowClick}
      onEditClick={onEditClick}
      onViewClick={onViewClick}
    />
  );
};