"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { deleteReqno } from "@/app/portal/eventos/reqnos/Reqnos.api";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";

export function ReqnoCard({ reqno }: any) {
  const router = useRouter();

  async function handleRemoveReqno(id: string) {

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta manifestación?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteReqno(id);
      router.refresh();
    } else {
    }
  }

  if (!reqno) {
    return null; // O puedes mostrar un mensaje de error o un componente de carga
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/reqnos/${reqno.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          {reqno.establecimiento}
          <span className="text-sm font-bold text-gray-500">
            {reqno.fechaHora}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{reqno.observacion}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/reqnos/${reqno.id}/edit`);
          }}
        >
          Editar
        </Button>
        <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveReqno(reqno.id);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}