//frontend\src\app\portal\eventos\ingresos\[id]\page.tsx
"use client";
import { useEffect, useState } from "react";
import { getIngreso, getEventosByLpu } from "../ingresos.api";
import ImageModal from "@/components/InternoId/ImageUniqueModal";
import EventList from "@/components/InternoId/EvsDisponYSeleccionados";
import IngresoInfo from "@/components/InternoId/FichaTecnicaYFoto";
import EventosSearch from "@/components/eventossearch/EventosSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  params: {
    id: string;
  };
}

const eventosDisponibles = [
  "manifestaciones",
  "impactos",
  "manifestaciones2",
  "agresiones",
  "preingresos",
  "prevenciones",
  "sumarios",
  "habeas",
  "huelgas",
  "procedimientos",
  "reqnos",
  "reqpositivos",
  "riesgos",
  "extramuros",
  "elementos",
  "atentados",
  "egresos",
  "temas",
  "traslados",
];

const eventosHumanizados: { [key: string]: string } = {
  manifestaciones: "Alteración al orden hab.",
  impactos: "Impacto sanitario",
  manifestaciones2: "Alteración al orden sec. común",
  agresiones: "Agresiones al personal penit.",
  preingresos: "Preingresos",
  prevenciones: "Prevenciones",
  sumarios: "Sumarios",
  habeas: "Habeas Corpus",
  huelgas: "Huelgas de hambre",
  procedimientos: "Procedimientos de registro",
  reqnos: "Res. de req.: Negativa",
  reqpositivos: "Res. de req.: Positiva",
  riesgos: "Informes de Riesgos",
  extramuros: "Salidas a hospital",
  elementos: "Elementos",
  atentados: "Atentados a la seguridad",
  egresos: "Egresos extramuro",
  temas: "Móvil",
  traslados: "Traslados"
};

const ProductDetailPage = ({ params }: Props) => {
  const { id } = params;
  const [ingreso, setIngreso] = useState<any>(null);
  const [eventos, setEventos] = useState<any[]>([]);
  const [eventosSeleccionados, setEventosSeleccionados] = useState<string[]>(eventosDisponibles);
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const [showAllFields, setShowAllFields] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchIngreso = async () => {
      const data = await getIngreso(id);
      setIngreso(data);
    };

    fetchIngreso();
  }, [id]);

  useEffect(() => {
    if (ingreso && eventosSeleccionados.length > 0) {
      const fetchEventos = async () => {
        console.log("Fetching eventos for selected events:", eventosSeleccionados);
        const allEventos = await Promise.all(
          eventosSeleccionados.map(async (evento) => {
            const data = await getEventosByLpu(evento, ingreso.lpu);
            if (Array.isArray(data)) {
              return data.map((item: any) => ({ ...item, tipo: evento }));
            } else {
              return [];
            }
          })
        );
        console.log("Fetched eventos:", allEventos);
        setEventos(allEventos.flat());
      };

      fetchEventos();
    }
  }, [ingreso, eventosSeleccionados]);

  const toggleEvento = (evento: string) => {
    setEventosSeleccionados((prev) =>
      prev.includes(evento)
        ? prev.filter((e) => e !== evento)
        : [...prev, evento]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setEventosSeleccionados([]);
    } else {
      setEventosSeleccionados(eventosDisponibles);
    }
    setSelectAll(!selectAll);
  };

  const toggleFields = () => {
    setShowAllFields(!showAllFields);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = url.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  if (!ingreso) {
    return <div>Cargando...</div>;
  }

  const words = [
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.word1}`,
      title: "Word 1",
    },
  ];

  const pdfs = [
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf1}`,
      title: "PDF 1",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf2}`,
      title: "PDF 2",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf3}`,
      title: "PDF 3",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf4}`,
      title: "PDF 4",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf5}`,
      title: "PDF 5",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf6}`,
      title: "PDF 6",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf7}`,
      title: "PDF 7",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf8}`,
      title: "PDF 8",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf9}`,
      title: "PDF 9",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf10}`,
      title: "PDF 10",
    },
  ];
  const images = [
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagen}`,
      title: "Imagen frontal",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenDer}`,
      title: "Imagen derecha del ingreso",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenIz}`,
      title: "Imagen izquierda del ingreso",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenDact}`,
      title: "Imagen dactilar del ingreso",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenSen1}`,
      title: "Imagen seña 1 del ingreso",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenSen2}`,
      title: "Imagen seña 2 del ingreso",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenSen3}`,
      title: "Imagen seña 3 del ingreso",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenSen4}`,
      title: "Imagen seña 4 del ingreso",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenSen5}`,
      title: "Imagen seña 5 del ingreso",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenSen6}`,
      title: "Imagen seña 6 del ingreso",
    },
  ];
  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <IngresoInfo
        ingreso={ingreso}
        showAllFields={showAllFields}
        toggleFields={toggleFields}
      />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 self-start"
        onClick={openModal}
      >
        Ver y descargar fotografías, PDFs, Word de ingreso y Ficha Técnica.
      </button>
      <ImageModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        words={words}
        pdfs={pdfs}
        images={images}
        downloadImage={downloadImage}
        interno={{
          nombre: ingreso.nombres,
          apellido: ingreso.apellido,
          lpu: ingreso.lpu,
        }}
        ingreso={ingreso}
      />
      <EventList
        eventosDisponibles={eventosDisponibles}
        eventosSeleccionados={eventosSeleccionados}
        toggleEvento={toggleEvento}
        selectAll={selectAll}
        toggleSelectAll={toggleSelectAll}
        eventosHumanizados={eventosHumanizados} // Pasar el mapeo de títulos humanizados
      />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Eventos Relacionados para ver y descargar:</CardTitle>
        </CardHeader>
        <CardContent>
          {eventos.length > 0 ? (
            <EventosSearch
            eventos={eventos}
            ingreso={ingreso}
            eventosHumanizados={eventosHumanizados} // Pasar el mapeo humanizado
          />// Pasar el mapeo de títulos humanizados
          ) : (
            <p>No hay eventos relacionados.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;