"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteElemento } from "@/app/portal/eventos/elementos/elementos.api";
import { useRouter } from "next/navigation";
import { FuseResultMatch } from "fuse.js";
import { formatUbicacionMap } from "@/app/utils/formatters";
function Highlight({
  text,
  matches,
}: {
  text: string;
  matches: FuseResultMatch[] | undefined;
}) {
  if (!matches || matches.length === 0) {
    return <span>{text}</span>;
  }

  const parts = [];
  let lastIndex = 0;

  matches.forEach((match) => {
    match.indices.forEach(([start, end]) => {
      parts.push(text.slice(lastIndex, start));
      parts.push(
        <mark key={start} style={{ backgroundColor: "orange" }}>
          {text.slice(start, end + 1)}
        </mark>
      );
      lastIndex = end + 1;
    });
  });

  parts.push(text.slice(lastIndex));

  return <span>{parts}</span>;
}

export function ElementoCard({ elemento, matches }: any) {
  const router = useRouter();

  if (!elemento) {
    return null; // O muestra un mensaje de error o un componente de carga
  }

  async function handleRemoveElemento(id: string) {
    await deleteElemento(id);
    router.refresh();
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/elementos/${elemento.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <Highlight text={elemento.establecimiento} matches={matches} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Fecha de elemento:</strong>{" "}
          <Highlight
            text={new Date(elemento.fechaHoraIng).toLocaleString("es-AR", {
              timeZone: "America/Argentina/Buenos_Aires",
            })}
            matches={matches}
          />
        </p>
        <p>
          <strong>Es Alerta:</strong>{" "}
          <Highlight text={elemento.esAlerta ? "Sí" : "No"} matches={matches} />
        </p>
        <p>
          <strong>Condición:</strong>{" "}
          <Highlight text={elemento.condicion} matches={matches} />
        </p>
        <p>
          <strong>Apellido:</strong>{" "}
          <Highlight text={elemento.apellido} matches={matches} />
        </p>
        <p>
          <strong>Nombres:</strong>{" "}
          <Highlight text={elemento.nombres} matches={matches} />
        </p>
        <p>
          <strong>Alias:</strong>{" "}
          <Highlight text={elemento.alias} matches={matches} />
        </p>
        <p>
          <strong>Tipo de Documento:</strong>{" "}
          <Highlight text={elemento.tipoDoc} matches={matches} />
        </p>
        <p>
          <strong>Número de Documento:</strong>{" "}
          <Highlight text={elemento.numeroDni} matches={matches} />
        </p>
        <p>
          <strong>Fecha de Nacimiento:</strong>{" "}
          <Highlight
            text={new Date(elemento.fechaNacimiento).toLocaleDateString(
              "es-AR",
              { timeZone: "America/Argentina/Buenos_Aires" }
            )}
            matches={matches}
          />
        </p>
        <p>
          <strong>Edad:</strong>{" "}
          <Highlight text={elemento.edad_ing} matches={matches} />
        </p>
        <p>
          <strong>Nacionalidad:</strong>{" "}
          <Highlight text={elemento.nacionalidad} matches={matches} />
        </p>
        <p>
          <strong>Provincia:</strong>{" "}
          <Highlight text={elemento.provincia} matches={matches} />
        </p>
        <p>
          <strong>Domicilios:</strong>{" "}
          <Highlight text={elemento.domicilios} matches={matches} />
        </p>
        <p>
          <strong>Número/s de Causa/s:</strong>{" "}
          <Highlight text={elemento.numeroCausa} matches={matches} />
        </p>
        <p>
          <strong>Procedencia:</strong>{" "}
          <Highlight text={elemento.procedencia} matches={matches} />
        </p>
        <p>
          <strong>Organización Criminal:</strong>{" "}
          <Highlight text={elemento.orgCrim} matches={matches} />
        </p>
        <p>
          <strong>Delitos:</strong>{" "}
          <Highlight
            text={JSON.stringify(elemento.electrodomesticos)}
            matches={matches}
          />
        </p>
        <p>
          <strong>Juzgados:</strong>{" "}
          <Highlight
            text={JSON.stringify(elemento.juzgados)}
            matches={matches}
          />
        </p>
        <p>
          <strong>LPU:</strong>{" "}
          <Highlight text={elemento.lpu} matches={matches} />
        </p>
        <p>
          <strong>Situación Procesal:</strong>{" "}
          <Highlight text={elemento.sitProc} matches={matches} />
        </p>
        <p>
          <strong>LPU Prov:</strong>{" "}
          <Highlight text={elemento.lpuProv} matches={matches} />
        </p>
        <p>
          <strong>Ubicación en el Mapa:</strong>{" "}
          <Highlight
            text={formatUbicacionMap(elemento.ubicacionMap)}
            matches={matches}
          />
        </p>

        <p>
          <strong>Perfil:</strong>{" "}
          <Highlight text={JSON.stringify(elemento.perfil)} matches={matches} />
        </p>
        <p>
          <strong>Reingreso:</strong>{" "}
          <Highlight text={elemento.reingreso} matches={matches} />
        </p>
        <p>
          <strong>Título de Información Pública:</strong>{" "}
          <Highlight text={elemento.titInfoPublic} matches={matches} />
        </p>
        <p>
          <strong>Resumen:</strong>{" "}
          <Highlight text={elemento.resumen} matches={matches} />
        </p>
        <p>
          <strong>Observación:</strong>{" "}
          <Highlight text={elemento.observacion} matches={matches} />
        </p>
        <p>
          <strong>Link:</strong>{" "}
          <Highlight text={elemento.link} matches={matches} />
        </p>
        <p>
          <strong>Patologías:</strong>{" "}
          <Highlight
            text={JSON.stringify(elemento.patologias)}
            matches={matches}
          />
        </p>
        <p>
          <strong>Tatuajes:</strong>{" "}
          <Highlight
            text={JSON.stringify(elemento.tatuajes)}
            matches={matches}
          />
        </p>
        <p>
          <strong>Cicatrices:</strong>{" "}
          <Highlight
            text={JSON.stringify(elemento.cicatrices)}
            matches={matches}
          />
        </p>
        <p>
          <strong>Subgrupo:</strong>{" "}
          <Highlight text={elemento.subGrupo} matches={matches} />
        </p>
        <p>
          <strong>Sexo:</strong>{" "}
          <Highlight text={elemento.sexo} matches={matches} />
        </p>
        <p>
          <strong>Sexualidad:</strong>{" "}
          <Highlight text={elemento.sexualidad} matches={matches} />
        </p>
        <p>
          <strong>Estado Civil:</strong>{" "}
          <Highlight text={elemento.estadoCivil} matches={matches} />
        </p>
        <p>
          <strong>Profesión:</strong>{" "}
          <Highlight text={elemento.profesion} matches={matches} />
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/elementos/${elemento.id}/edit`);
          }}
        >
          Editar - Expedir PDF - WhatsApp
        </Button>
        <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveElemento(elemento.id);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}
