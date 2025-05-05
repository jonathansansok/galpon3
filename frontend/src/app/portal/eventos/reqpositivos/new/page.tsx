//frontend\src\app\portal\eventos\reqpositivos2\new\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReqPositivoForm } from "./ReqpositivoForm";
import { createReqpositivo, getReqpositivo } from "../Reqpositivos.api";

interface Props {
  params: {
    id?: string;
  };
}

async function ReqpositivoNewPage({ params }: Props) {
  const { id } = await params;
  let reqPositivo = null;
  if (id) {
    reqPositivo = await getReqpositivo(id);
  }
  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Respuesta de Req.: Positiva" : "Agregar Respuesta de Req.: Positiva"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReqPositivoForm reqPositivo={reqPositivo} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ReqpositivoNewPage;