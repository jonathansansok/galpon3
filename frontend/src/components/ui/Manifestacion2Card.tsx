"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { deleteManifestacion2 } from "@/app/portal/eventos/manifestaciones2/manifestaciones2.api";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";

export function Manifestacion2Card({ manifestacion2 }: any) {
  const router = useRouter();

  async function handleRemoveManifestacion2(id: string) {

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta manifestación?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteManifestacion2(id);
      router.refresh();
    } else {
    }
  }

  if (!manifestacion2) {
    return null; // O puedes mostrar un mensaje de error o un componente de carga
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/manifestaciones2/${manifestacion2.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          {manifestacion2.establecimiento}
          <span className="text-sm font-bold text-gray-500">
            {manifestacion2.fechaHora}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{manifestacion2.observacion}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/manifestaciones2/${manifestacion2.id}/edit`);
          }}
        >
          Editar
        </Button>
        <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveManifestacion2(manifestacion2.id);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}