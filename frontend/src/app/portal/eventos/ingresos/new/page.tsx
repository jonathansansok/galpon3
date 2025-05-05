//frontend\src\app\portal\eventos\ingresos\new\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IngresoForm } from "./IngresoForm";
import { createIngreso, getIngreso } from "../ingresos.api";

interface Props {
  params: {
    id?: string;
  };
}

async function IngresoesNewPage({ params }: Props) {
  const { id } = await params;
  let ingreso = null;
  if (id) {
    ingreso = await getIngreso(id);
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Interno" : "Agregar Interno"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IngresoForm ingreso={ingreso} />
        </CardContent>
      </Card>
    </div>
  );
}

export default IngresoesNewPage;