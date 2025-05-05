//frontend\src\app\portal\eventos\preingresos\new\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PreingresoForm } from "./PreingresoForm";
import { createPreingreso, getPreingreso } from "../Preingresos.api";

interface Props {
  params: {
    id?: string;
  };
}

async function PreingresosNewPage({ params }: Props) {
  const { id } = await params;
  let preingreso = null;
  if (id) {
    preingreso = await getPreingreso(id);
  }
  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Informe de Preingreso" : "Generar Informe de  Preingreso"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PreingresoForm preingreso={preingreso} />
        </CardContent>
      </Card>
    </div>
  );
}

export default PreingresosNewPage;