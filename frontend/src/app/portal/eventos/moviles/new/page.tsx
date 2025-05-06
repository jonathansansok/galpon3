import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovilForm } from "./MovilForm";
import { createMovil, getMovil } from "../Moviles.api";

interface Props {
  params: {
    id?: string;
  };
}

async function MovilesNewPage({ params }: Props) {
  const { id } = await params;
  let movil = null;
  if (id) {
    movil = await getMovil(id);
  }
  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {params.id ? "Editar Móvil" : "Agregar Móvil"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MovilForm movil={movil} />
        </CardContent>
      </Card>
    </div>
  );
}

export default MovilesNewPage;