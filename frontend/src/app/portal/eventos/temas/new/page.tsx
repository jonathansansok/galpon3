//frontend\src\app\portal\eventos\temas\new\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemaForm } from "./TemaForm";
import { createTema, getTema } from "../Temas.api";

interface Props {
  params: {
    id?: string;
  };
}

async function TemasNewPage({ params }: Props) {
  const { id } = await params;
  let tema = null;
  if (id) {
    tema = await getTema(id);
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
          <TemaForm tema={tema} />
        </CardContent>
      </Card>
    </div>
  );
}

export default TemasNewPage;