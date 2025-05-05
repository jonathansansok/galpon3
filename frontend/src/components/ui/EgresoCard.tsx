// frontend/src/components/ui/Ingreso-card.tsx
"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteEgreso } from "@/app/portal/eventos/egresos/Egresos.api";
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

export function EgresoCard({ egreso, matches }: any) {
  const router = useRouter();

  async function handleRemoveEgreso(id: string) {
    await deleteEgreso(id);
    router.refresh();
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/egresos/${egreso.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <Highlight text={egreso.establecimiento} matches={matches} />
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/egresos/${egreso.id}/edit`);
          }}
        >
          Editar -  WhatsApp
        </Button>
        <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveEgreso(egreso.id);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
      <CardContent>
        <p><strong>Email:</strong> <Highlight text={egreso.email} matches={matches} /></p>
        <p><strong className="text-lg">&quot;Personal involucrado:&quot;</strong> <Highlight text={egreso.personalinvolucrado} matches={matches} /></p>
        <p><strong>IMS:</strong> <Highlight text={egreso.ims} matches={matches} /></p>
        <p><strong className="text-lg">&quot;Internos involucrados:&quot;</strong> <Highlight text={egreso.internosinvolucrado} matches={matches} /></p>
        <p><strong>Fecha y Hora:</strong> <Highlight text={new Date(egreso.fechaHora).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Modulo UR:</strong> <Highlight text={egreso.modulo_ur} matches={matches} /></p>
        <p><strong>Pabellon:</strong> <Highlight text={egreso.pabellon} matches={matches} /></p>
        <p><strong>Acontecimiento:</strong> <Highlight text={egreso.acontecimiento} matches={matches} /></p>
        <p><strong>Tipo de Salida:</strong> <Highlight text={egreso.tipoDeSalida} matches={matches} /></p>
        <p><strong>Modalidad:</strong> <Highlight text={egreso.modalidad} matches={matches} /></p>
        <p><strong>¿No reintegro de salida transitoria?:</strong> <Highlight text={egreso.noReintSalTra ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>¿Reintegro fuera de término?:</strong> <Highlight text={egreso.reintFueraTerm ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>Revocación arresto domiciliario:</strong> <Highlight text={egreso.revArrDom ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>Revocación libertad condicional:</strong> <Highlight text={egreso.revLibCond ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>Revocación libertad asistida:</strong> <Highlight text={egreso.revlibAsis ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>Jurisdiccion:</strong> <Highlight text={egreso.jurisdiccion} matches={matches} /></p>
        <p><strong>Plazo en horas:</strong> <Highlight text={egreso.plazo} matches={matches} /></p>
        <p><strong>Juzgados:</strong> <Highlight text={JSON.stringify(egreso.juzgados)} matches={matches} /></p>
        <p><strong>Prevención Sí/No:</strong> <Highlight text={egreso.prevencioSiNo ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>Fecha Vencimiento:</strong> <Highlight text={egreso.fechaVenc ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>Orden Cap DIP:</strong> <Highlight text={egreso.ordenCapDip ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>Reingreso por recaptura:</strong> <Highlight text={egreso.reingPorRecap ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>Fecha Hora Vencimiento:</strong> <Highlight text={new Date(egreso.fechaHoraVencTime).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Fecha Hora Reintegro fuera de término:</strong> <Highlight text={new Date(egreso.fechaHoraReintFueTerm).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Fecha Hora Reingreso por recaptura:</strong> <Highlight text={new Date(egreso.fechaHoraReingPorRecap).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Fecha Hora Última Orden de Captura:</strong> <Highlight text={new Date(egreso.fechaHoraUlOrCap).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Observación:</strong> <Highlight text={egreso.observacion} matches={matches} /></p>
        <p><strong>Otros Datos:</strong> <Highlight text={egreso.otrosDatos} matches={matches} /></p>
        <p><strong>Expediente:</strong> <Highlight text={egreso.expediente} matches={matches} /></p>
      </CardContent>
      
    </Card>
  );
}