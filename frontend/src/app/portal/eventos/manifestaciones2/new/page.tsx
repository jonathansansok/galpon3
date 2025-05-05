//frontend\src\app\portal\eventos\manifestaciones2\new\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Manifestacion2Form } from "./Manifestacion2Form";
import { createManifestacion2, getManifestacion2 } from "../manifestaciones2.api";

interface Props {
  params: {
    id?: string;
  };
}

async function ManifestacionNewPage({ params }: Props) {
 
  const { id } = await params;
  let manifestacion2 = null;
  if (id) {
    manifestacion2 = await getManifestacion2(id);
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Alteración al orden sec. común." : "Agregar Alteración al orden sec. común."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Manifestacion2Form manifestacion2={manifestacion2} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ManifestacionNewPage;