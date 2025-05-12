//frontend\src\app\portal\eventos\presupuestos\new\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PresupuestoForm } from "./PresupuestoForm";
import { createPresupuesto, getPresupuesto } from "../Presupuestos.api";

interface Props {
  params: {
    id?: string;
  };
}

async function PresupuestosNewPage({ params }: Props) {
  const { id } = params;
  let presupuesto = null;

  if (id) {
    presupuesto = await getPresupuesto(id);
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Presupuesto" : "Agregar Presupuesto"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PresupuestoForm presupuesto={presupuesto} />
        </CardContent>
      </Card>
    </div>
  );
}

export default PresupuestosNewPage;