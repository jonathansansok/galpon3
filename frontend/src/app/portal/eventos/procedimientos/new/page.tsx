//frontend\src\app\portal\eventos\procedimientos\new\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcedimientoForm } from "./ProcedimientoForm";
import { createProcedimiento, getProcedimiento } from "../Procedimientos.api";

interface Props {
  params: {
    id?: string;
  };
}

async function ProcedimientosNewPage({ params }: Props) {
  const { id } = await params;
  let procedimiento = null;
  if (id) {
    procedimiento = await getProcedimiento(id);
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Procedimiento de registro" : "Agregar Procedimiento de registro"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProcedimientoForm procedimiento={procedimiento} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ProcedimientosNewPage;