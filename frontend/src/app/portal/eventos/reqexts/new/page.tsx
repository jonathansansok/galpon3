import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReqextForm } from "./ReqextForm";
import { createReqext, getReqext } from "../Reqexts.api";

interface Props {
  params: {
    id?: string;
  };
}

async function ReqextsNewPage({ params }: Props) {
  const { id } = await params;
  let reqexts = null;
  if (id) {
    reqexts = await getReqext(id);
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Resp. de req. externo" : "Agregar Resp. de req. externo"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReqextForm reqexts={reqexts} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ReqextsNewPage;