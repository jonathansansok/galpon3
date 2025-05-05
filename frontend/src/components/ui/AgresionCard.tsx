"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteAgresion } from "@/app/portal/eventos/agresiones/agresiones.api";
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

export function AgresionCard({ agresion, matches }: any) {
  const router = useRouter();

  if (!agresion) {
    return null; // O muestra un mensaje de error o un componente de carga
  }

  async function handleRemoveAgresion(id: string) {

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta agresion?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteAgresion(id);
      router.refresh();
    } else {
    }
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/agresiones/${agresion.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <Highlight text={agresion.establecimiento} matches={matches} />
          <span className="text-sm font-bold text-gray-500">
            {new Date(agresion.fechaHora).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Fecha de agresión:</strong> <Highlight text={new Date(agresion.fechaHora).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Observación:</strong> <Highlight text={agresion.observacion} matches={matches} /></p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/agresiones/${agresion.id}/edit`);
          }}
        >
          Editar
        </Button>
        <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveAgresion(agresion.id);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}