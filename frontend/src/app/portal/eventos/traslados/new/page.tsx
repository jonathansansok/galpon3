import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrasladoForm } from "./TrasladoForm";
import { createTraslado, getTraslado } from "../Traslados.api";

interface Props {
  params: {
    id?: string;
  };
}

async function TrasladosNewPage({ params }: Props) {
  const { id } = await params;
  let traslado = null;
  if (id) {
    traslado = await getTraslado(id);
  }
  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {params.id ? "Editar Traslado" : "Agregar Traslado"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TrasladoForm traslado={traslado} />
        </CardContent>
      </Card>
    </div>
  );
}

export default TrasladosNewPage;