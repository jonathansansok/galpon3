// frontend/src/app/portal/eventos/reqnos/new/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReqnoForm } from "./ReqnoForm";
import { createReqno, getReqno } from "../Reqnos.api";

interface Props {
  params: {
    id?: string;
  };
}

async function ReqnosNewPage({ params }: Props) {
  const { id } = await params;
  let reqno = null;
  if (id) {
    reqno = await getReqno(id);
  }
  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Resp. de Req. Negativa" : "Agregar Resp. de Req. Negativa"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReqnoForm reqno={reqno} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ReqnosNewPage;