//frontend\src\app\portal\eventos\Elementos\new\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ElementoForm } from "./ElementoForm";
import { createElemento, getElemento } from "../elementos.api";

interface Props {
  params: {
    id?: string;
  };
}

async function ElementoNewPage({ params }: Props) {
  const { id } = await params;
  let elemento = null;
  if (id) {
    elemento = await getElemento(id);
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
          {id ? "Editar Secuestro de Elementos" : "Agregar Secuestro de Elementos"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ElementoForm elemento={elemento} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ElementoNewPage;