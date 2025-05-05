//frontend\src\app\portal\eventos\atentados\new\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AtentadoForm } from "./AtentadoForm";
import { createAtentado, getAtentado } from "../Atentados.api";

interface Props {
  params: {
    id?: string;
  };
}

async function AtentadoNewPage({ params }: Props) {
  const { id } = await params;
  let atentado = null;
  if (id) {
    atentado = await getAtentado(id);
  }
  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Atentado a la seguridad" : "Agregar Atentado a la seguridad"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AtentadoForm atentado={atentado} />
        </CardContent>
      </Card>
    </div>
  );
}

export default AtentadoNewPage;