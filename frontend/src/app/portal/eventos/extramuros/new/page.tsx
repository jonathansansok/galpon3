// frontend/src/app/portal/eventos/extramuros/new/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtramuroForm } from "./ExtramuroForm";
import { createExtramuro, getExtramuro } from "../Extramuros.api";

interface Props {
  params: {
    id?: string;
  };
}

async function ExtramurosNewPage({ params }: Props) {
  const { id } = await params;
  let extramuro = null;
  if (id) {
    extramuro = await getExtramuro(id);
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar hospital extramuro" : "Agregar hospital extramuro"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExtramuroForm extramuro={extramuro} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ExtramurosNewPage;