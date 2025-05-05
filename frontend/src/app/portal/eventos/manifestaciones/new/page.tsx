//frontend\src\app\portal\eventos\manifestaciones\new\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ManifestacionForm } from "./ManifestacionForm";
import { createManifestacion, getManifestacion } from "../manifestaciones.api";

interface Props {
  params: {
    id?: string;
  };
}

async function ManifestacionNewPage({ params }: Props) {
  const { id } = await params;
  let manifestacion = null;
  if (id) {
    manifestacion = await getManifestacion(id);
  }
  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Alteración al orden hab." : "Agregar Alteración al orden hab."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ManifestacionForm manifestacion={manifestacion} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ManifestacionNewPage;