// frontend/src/app/portal/eventos/impactos/new/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImpactoForm } from "./ImpactoForm";
import { createImpacto, getImpacto } from "../impacto.api";

interface Props {
  params: {
    id?: string;
  };
}

async function ImpactosNewPage({ params }: Props) {
  const { id } = await params;
  let impacto = null;
  if (id) {
    impacto = await getImpacto(id);
  }
  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Impacto Sanitario" : "Agregar Impacto Sanitario"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImpactoForm impacto={impacto} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ImpactosNewPage;