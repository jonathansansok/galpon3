import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiesgoForm } from "./RiesgoForm";
import { createRiesgo, getRiesgo } from "../Riesgos.api";
interface Props {
  params: {
    id?: string;
  };
}

async function RiesgosNewPage({ params }: Props) {
  const { id } = await params;
  let riesgo = null;
  if (id) {
    riesgo = await getRiesgo(id);
  }
  return (
 
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Eval. S.I.G.P.P.L.A.R." : "Agregar Eval. S.I.G.P.P.L.A.R."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RiesgoForm riesgo={riesgo} />
        </CardContent>
      </Card>
    </div>

  );
}

export default RiesgosNewPage;