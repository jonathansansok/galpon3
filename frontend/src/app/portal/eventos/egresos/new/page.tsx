//frontend\src\app\portal\eventos\egersos\new\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EgresoForm } from "./EgresoForm";
import { createEgreso, getEgreso } from "../Egresos.api";

interface Props {
  params: {
    id?: string;
  };
}

async function EgresoNewPage({ params }: Props) {
  const { id } = await params;
  let egreso = null;
  if (id) {
    egreso = await getEgreso(id);
  }
  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Egreso extramuro" : "Agregar Egreso extramuro"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EgresoForm egreso={egreso} />
        </CardContent>
      </Card>
    </div>
  );
}

export default EgresoNewPage;