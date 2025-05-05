import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrevencionForm } from "./PrevencionForm";
import { createPrevencion, getPrevencion } from "../Prevenciones.api";

interface Props {
  params: {
    id?: string;
  };
}

async function PrevencionesNewPage({ params }: Props) {
  const { id } = await params;
  let prevencion = null;
  if (id) {
    prevencion = await getPrevencion(id);
  }
  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Prevención" : "Agregar Prevención"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PrevencionForm prevencion={prevencion} />
        </CardContent>
      </Card>
    </div>
  );
}

export default PrevencionesNewPage;