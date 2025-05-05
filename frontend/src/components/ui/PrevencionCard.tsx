// frontend/src/components/ui/PrevencionCard.tsx
"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deletePrevencion } from "@/app/portal/eventos/prevenciones/Prevenciones.api";
import { useRouter } from "next/navigation";
import { FuseResultMatch } from "fuse.js";
import { Alert } from "@/components/ui/alert";

function Highlight({ text, matches }: { text: string, matches: FuseResultMatch[] | undefined }) {
  if (!matches || matches.length === 0) {
    return <span>{text}</span>;
  }

  const parts = [];
  let lastIndex = 0;

  matches.forEach(match => {
    match.indices.forEach(([start, end]) => {
      parts.push(text.slice(lastIndex, start));
      parts.push(<mark key={start} style={{ backgroundColor: 'orange' }}>{text.slice(start, end + 1)}</mark>);
      lastIndex = end + 1;
    });
  });

  parts.push(text.slice(lastIndex));

  return <span>{parts}</span>;
}

export function PrevencionCard({ prevencion, matches }: any) {
  const router = useRouter();

  if (!prevencion) {
    return null; // O muestra un mensaje de error o un componente de carga
  }

  async function handleRemovePrevencion(id: string) {

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta Prevencion?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deletePrevencion(id);
      router.refresh();
    } else {
    }
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/prevenciones/${prevencion.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <Highlight text={prevencion.establecimiento} matches={matches} />
          <span className="text-sm font-bold text-gray-500">
            {new Date(prevencion.fechaHora).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Fecha de Prevención:</strong> <Highlight text={new Date(prevencion.fechaHora).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Observación:</strong> <Highlight text={prevencion.observacion} matches={matches} /></p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/prevenciones/${prevencion.id}/edit`);
          }}
        >
          Editar
        </Button>
        <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemovePrevencion(prevencion.id);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}