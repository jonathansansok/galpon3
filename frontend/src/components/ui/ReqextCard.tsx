"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteReqext } from "@/app/portal/eventos/reqexts/Reqexts.api";
import { useRouter } from "next/navigation";
import { FuseResultMatch } from "fuse.js";

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

export function ReqextCard({ reqext, matches }: any) {
  const router = useRouter();

  async function handleRemoveReqext(id: string) {
    await deleteReqext(id);
    router.refresh();
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/reqexts/${reqext.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <Highlight text={reqext.establecimiento} matches={matches} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Fecha y Hora:</strong> <Highlight text={new Date(reqext.fechaHora).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Observación:</strong> <Highlight text={reqext.observacion} matches={matches} /></p>
        <p><strong>Email:</strong> <Highlight text={reqext.email} matches={matches} /></p>
        <p><strong>Organismo Requiriente:</strong> <Highlight text={reqext.organismo_requiriente} matches={matches} /></p>
        <p><strong>Causa:</strong> <Highlight text={reqext.causa} matches={matches} /></p>
        <p><strong className="text-lg">&quot;Internos involucrados:&quot;</strong> <Highlight text={reqext.internosinvolucrado2} matches={matches} /></p>
        <p><strong>Contestación:</strong> <Highlight text={reqext.contestacion} matches={matches} /></p>
        <p><strong>Estado:</strong> <Highlight text={reqext.estado} matches={matches} /></p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/reqexts/${reqext.id}/edit`);
          }}
        >
          Editar -  WhatsApp
        </Button>
        <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveReqext(reqext.id);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}