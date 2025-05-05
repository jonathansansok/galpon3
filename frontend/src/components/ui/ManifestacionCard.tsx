"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { deleteManifestacion } from "@/app/portal/eventos/manifestaciones/manifestaciones.api";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";

export function ManifestacionCard({ manifestacion }: any) {
  const router = useRouter();

  async function handleRemoveManifestacion(id: string) {

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta manifestación?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteManifestacion(id);
      router.refresh();
    } else {
    }
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/manifestaciones/${manifestacion.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          {manifestacion.establecimiento}
          <span className="text-sm font-bold text-gray-500">
            {manifestacion.fechaHora}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{manifestacion.observacion}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/manifestaciones/${manifestacion.id}/edit`);
          }}
        >
          Editar
        </Button>
{/*         <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveManifestacion(manifestacion.id);
          }}
        >
          Eliminar
        </Button> */}
      </CardFooter>
    </Card>
  );
}