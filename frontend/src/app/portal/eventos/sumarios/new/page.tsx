import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SumarioForm } from "./SumarioForm";
import { createSumario, getSumario } from "../Sumarios.api";

interface Props {
  params: {
    id?: string;
  };
}

async function SumariosNewPage({ params }: Props) {
  const { id } = await params;
  let sumario = null;
  if (id) {
    sumario = await getSumario(id);
  }
  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {params.id ? "Editar Sumario" : "Agregar Sumario"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SumarioForm sumario={sumario} />
        </CardContent>
      </Card>
    </div>
  );
}

export default SumariosNewPage;