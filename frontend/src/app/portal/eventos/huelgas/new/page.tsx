import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HuelgaForm } from "./HuelgaForm";
import { createHuelga, getHuelga } from "../Huelgas.api";

interface Props {
  params: {
    id?: string;
  };
}

async function HuelgasNewPage({ params }: Props) {
  const { id } = await params;
  let huelgas = null;
  if (id) {
    huelgas = await getHuelga(id);
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar huelga de hambre" : "Agregar huelga de hambre"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HuelgaForm huelgas={huelgas} />
        </CardContent>
      </Card>
    </div>
  );
}

export default HuelgasNewPage;