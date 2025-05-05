// frontend/src/app/portal/eventos/agresiones/new/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgresionForm } from "./AgresionForm";
import { getAgresion } from "../agresiones.api";

interface Props {
  params: {
    id?: string;
  };
}

async function AgresionNewPage({ params }: Props) {
  const { id } = await params;
  let Agresion = null;
  if (id) {
    Agresion = await getAgresion(id);
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
          {id ? "Editar: Agresion al pers. penit." : "Crear: Agresion al pers. penit."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AgresionForm Agresion={Agresion} />
        </CardContent>
      </Card>
    </div>
  );
}

export default AgresionNewPage;