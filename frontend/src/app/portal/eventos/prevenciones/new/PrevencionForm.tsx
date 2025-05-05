"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SelectComp from "@/components/ui/SelectAnidaciones";
import PrevencionesSelect from "@/components/ui/selects/PrevencionesSelect";
import PersonalInvolucrado from "@/components/ui/PersonalInvolucrado";
import InternosInvolucrados from "@/components/ui/InternosInvolucrados";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import Textarea from "@/components/ui/Textarea";
import { InputFieldExpediente } from "@/components/ui/inputs/InputFieldExpediente";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { createPrevencion, updatePrevencion } from "../Prevenciones.api";
import { useUserStore } from "@/lib/store";
import {
  ShowPrevenciones,
  showCancelAlert,
} from "../../../../utils/alertUtils";
import Toggle from "@/components/ui/Toggle";
import { JuzgadoSelector } from "@/components/ui/JuzgadoSelector";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";
interface FormValues {
  [key: string]: string;
  establecimiento: string;
  fechaHora: string;
  observacion: string;
  sector: string;
  personalinvolucrado: string;
  internosinvolucrado: string;
  expediente: string;
  foco_igneo: string;
  reyerta: string;
  interv_requisa: string;
  juzgados: string; // Añadir esta línea
}

interface Sector {
  option: string;
}

interface Agente {
  grado: string;
  nombreApellidoAgente: string;
  credencial: string;
  gravedad: string;
  atencionART: string;
  detalle: string;
}

interface Interno {
  nombreApellido: string;
  alias: string;
  lpu: string;
  lpuProv: string;
  sitProc: string;
  gravedad: string;
  atencionExtramuro: string;
  detalle: string;
}

export function PrevencionForm({ prevencion }: { prevencion: any }) {
  const { handleSubmit, setValue, register, reset, watch } =
    useForm<FormValues>({
      defaultValues: {
        establecimiento: prevencion?.establecimiento || "",
        fechaHora: prevencion?.fechaHora || "",
        observacion: prevencion?.observacion || "",
        sector: prevencion?.sector || "",
        personalinvolucrado: JSON.stringify(
          prevencion?.personalinvolucrado || []
        ),
        internosinvolucrado: JSON.stringify(
          prevencion?.internosinvolucrado || []
        ),
        juzgados: prevencion?.juzgados
          ? JSON.parse(prevencion.juzgados).join(", ")
          : "", // Modificar esta línea
        expediente: prevencion?.expediente || "",
        foco_igneo: prevencion?.foco_igneo === "Si" ? "Si" : "No", // Cambiar a cadena
        reyerta: prevencion?.reyerta === "Si" ? "Si" : "No", // Cambiar a cadena
        interv_requisa: prevencion?.interv_requisa === "Si" ? "Si" : "No", // Cambiar a cadena
        clas_seg: prevencion?.clas_seg || "",
        imagen: prevencion?.imagen || "",
        imagenDer: prevencion?.imagenDer || "",
        imagenIz: prevencion?.imagenIz || "",
        imagenDact: prevencion?.imagenDact || "",
        imagenSen1: prevencion?.imagenSen1 || "",
        imagenSen2: prevencion?.imagenSen2 || "",
        imagenSen3: prevencion?.imagenSen3 || "",
        imagenSen4: prevencion?.imagenSen4 || "",
        imagenSen5: prevencion?.imagenSen5 || "",
        imagenSen6: prevencion?.imagenSen6 || "",
        pdf1: prevencion?.pdf1 || "",
        pdf2: prevencion?.pdf2 || "",
        pdf3: prevencion?.pdf3 || "",
        pdf4: prevencion?.pdf4 || "",
        pdf5: prevencion?.pdf5 || "",
        pdf6: prevencion?.pdf6 || "",
        pdf7: prevencion?.pdf7 || "",
        pdf8: prevencion?.pdf8 || "",
        pdf9: prevencion?.pdf9 || "",
        pdf10: prevencion?.pdf10 || "",
        word1: prevencion?.word1 || "",
      },
    });
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fechaHora, setFechaHora] = useState<string>(
    prevencion?.fechaHora || ""
  );
  const [observacion, setobservacion] = useState<string>(
    prevencion?.observacion || ""
  );
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(prevencion?.establecimiento || "");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(
    prevencion?.modulo_ur || ""
  );
  const [selectedPabellon, setSelectedPabellon] = useState<string>(
    prevencion?.pabellon || ""
  );
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>(() => {
    if (prevencion?.sector) {
      return prevencion.sector
        .split(", ")
        .map((sector: string) => ({ option: sector }));
    }
    return [];
  });
  const [selectedAgentes, setSelectedAgentes] = useState<Agente[]>(() => {
    try {
      if (prevencion?.personalinvolucrado) {
        return JSON.parse(prevencion.personalinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing personalinvolucrado:", error);
    }
    return [];
  });
  const [selectedJuzgados, setSelectedJuzgados] = useState<string[]>(() => {
    try {
      if (prevencion?.juzgados) {
        return JSON.parse(prevencion.juzgados);
      }
    } catch (error) {
      console.error("Error parsing juzgados:", error);
    }
    return [];
  });
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (prevencion?.internosinvolucrado) {
        return JSON.parse(prevencion.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });
  const [clas_seg, setClas_seg] = useState<string>(prevencion?.clas_seg || "");
  const [focoIgneo, setFocoIgneo] = useState<boolean>(
    prevencion?.foco_igneo === "Si"
  );
  const [reyerta, setReyerta] = useState<boolean>(prevencion?.reyerta === "Si");
  const [intervRequisa, setIntervRequisa] = useState<boolean>(
    prevencion?.interv_requisa === "Si"
  );
  const [imagen, setImagen] = useState<string | null>(
    prevencion?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.imagen}`
      : null
  );

  const [imagenDer, setImagenDer] = useState<string | null>(
    prevencion?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    prevencion?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    prevencion?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    prevencion?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    prevencion?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    prevencion?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    prevencion?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    prevencion?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    prevencion?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    prevencion?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    prevencion?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    prevencion?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    prevencion?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    prevencion?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    prevencion?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    prevencion?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    prevencion?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    prevencion?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    prevencion?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    prevencion?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/prevenciones/uploads/${prevencion.word1}`
      : null
  );

  const nombres = watch("establecimiento");
  const apellido = watch("establecimiento");
  const lpu = watch("establecimiento");
  const lpuProv = watch("lpuPestablecimientorov");
  const nDoc = watch("establecimiento");
  const generateFileName = (type: string) => {
    return `${apellido}_${nombres}_L.P.U._${lpu}_L.P.U. PROV_${lpuProv}_NºDoc. ${nDoc}_${type}.png`.replace(
      /\s+/g,
      "_"
    );
  };
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const getImageUrl = (imagePath: string): string => {
    return `/api/prevenciones/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/prevenciones/uploads/${pdfPath.split("/").pop()}`;
  };

  const [isWordOpen, setIsWordOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.email) {
          setUser({ name: data.name, email: data.email });
        } else {
          router.push("/api/auth/login");
        }
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
        router.push("/api/auth/login");
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser, router]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const fieldLabels: Record<string, string> = {
    establecimiento: "Establecimiento",
    fechaHora: "Fecha y hora de evento",
    clas_seg: "Clasificación de Seguridad",
  };
  const requiredFields = [
    "establecimiento",
    "fechaHora",
    "clas_seg",
  ];
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const missingFields = validateRequiredFields(data, requiredFields, fieldLabels);
    const emptyFields = validateEmptyFields(data, fieldLabels, excludedFields);
  if (missingFields.length > 0) {
    Alert.error({
      title: "Error",
      text: `Faltan campos obligatorios: ${missingFields.join(" - ")}.`,
    });
    return;
  }
  if (emptyFields.length > 0) {
    const confirmation = await Alert.confirm({
      title: "Advertencia",
      text: `Hay campos vacíos: ${emptyFields.join(" - ")}. ¿Deseas continuar?`,
      icon: "warning",
    });

    if (!confirmation.isConfirmed) {
      return; // El usuario decidió no continuar
    }
  }
    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas enviar el formulario?",
      icon: "warning",
    });

    if (!confirmation.isConfirmed) {
      showCancelAlert();
      return;
    }

    setIsSubmitting(true); // Bloquear el botón al iniciar el envío

    try {
      let response;

      const payload: any = {
        establecimiento: data.establecimiento,
        modulo_ur: selectedModuloUr,
        pabellon: selectedPabellon,
        sector: selectedSectors.map((s) => s.option).join(", "),
        fechaHora: data.fechaHora || null,
        observacion: data.observacion,
        personalinvolucrado: JSON.stringify(selectedAgentes || []),
        internosinvolucrado: JSON.stringify(selectedInternos || []),
        juzgados: JSON.stringify(selectedJuzgados || []),
        expediente: data.expediente,
        foco_igneo: focoIgneo ? "Si" : "No",
        reyerta: reyerta ? "Si" : "No",
        interv_requisa: intervRequisa ? "Si" : "No",
        email: user?.email,
        clas_seg: data.clas_seg,
      };

      const formData = new FormData();
      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      // Procesar imágenes y archivos
      const processFile = async (
        file: string | null,
        key: string,
        extension: string
      ) => {
        if (file && file.startsWith("data:")) {
          const uniqueFileName = `${key}-${Date.now()}-${Math.floor(
            Math.random() * 1000000
          )}.${extension}`;
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append("files", blob, uniqueFileName);
          formData.append(key, uniqueFileName);
        }
      };

      await Promise.all([
        processFile(imagen, "imagen", "png"),
        processFile(imagenDer, "imagenDer", "png"),
        processFile(imagenIz, "imagenIz", "png"),
        processFile(imagenDact, "imagenDact", "png"),
        processFile(imagenSen1, "imagenSen1", "png"),
        processFile(imagenSen2, "imagenSen2", "png"),
        processFile(imagenSen3, "imagenSen3", "png"),
        processFile(imagenSen4, "imagenSen4", "png"),
        processFile(imagenSen5, "imagenSen5", "png"),
        processFile(imagenSen6, "imagenSen6", "png"),
        processFile(pdf1, "pdf1", "pdf"),
        processFile(pdf2, "pdf2", "pdf"),
        processFile(pdf3, "pdf3", "pdf"),
        processFile(pdf4, "pdf4", "pdf"),
        processFile(pdf5, "pdf5", "pdf"),
        processFile(pdf6, "pdf6", "pdf"),
        processFile(pdf7, "pdf7", "pdf"),
        processFile(pdf8, "pdf8", "pdf"),
        processFile(pdf9, "pdf9", "pdf"),
        processFile(pdf10, "pdf10", "pdf"),
        processFile(word1, "word1", "docx"),
      ]);

      if (params?.id) {
        response = await updatePrevencion(params.id, formData);
      } else {
        response = await createPrevencion(formData);
      }

      const mensajeTitulo = params.id
        ? "Actualización de Prevención"
        : "Creación de Prevención";

      if (response.success) {
        await ShowPrevenciones(response.success, mensajeTitulo, {
          ...data,
          modulo_ur: selectedModuloUr,
          pabellon: selectedPabellon,
          foco_igneo: focoIgneo ? "Si" : "No",
          reyerta: reyerta ? "Si" : "No",
          interv_requisa: intervRequisa ? "Si" : "No",
        });
        router.push("/portal/eventos/prevenciones");
      } else {
        console.error(
          "Error al crear o actualizar prevención:",
          response.error
        );
        await ShowPrevenciones(false, "Error", payload);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      await ShowPrevenciones(false, "Error", {});
    } finally {
      setIsSubmitting(false); // Desbloquear el botón al finalizar
    }
  };

  const goToPrevenciones = () => {
    router.push("/portal/eventos/prevenciones");
  };

  return (
    <form
      id="formulario"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
      }}
    >
      <WatermarkBackground setBackgroundImage={setBackgroundImage} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-auto items-start">
        <Button
          type="button"
          onClick={() => setIsPhotosOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Fotografías
        </Button>
        <PhotosEvModal
          isOpen={isPhotosOpen}
          onClose={() => setIsPhotosOpen(false)}
          imagen={imagen}
          setImagen={setImagen}
          imagenDer={imagenDer}
          setImagenDer={setImagenDer}
          imagenIz={imagenIz}
          setImagenIz={setImagenIz}
          imagenDact={imagenDact}
          setImagenDact={setImagenDact}
          imagenSen1={imagenSen1}
          setImagenSen1={setImagenSen1}
          imagenSen2={imagenSen2}
          setImagenSen2={setImagenSen2}
          imagenSen3={imagenSen3}
          setImagenSen3={setImagenSen3}
          imagenSen4={imagenSen4}
          setImagenSen4={setImagenSen4}
          imagenSen5={imagenSen5}
          setImagenSen5={setImagenSen5}
          imagenSen6={imagenSen6}
          setImagenSen6={setImagenSen6}
          getImageUrl={getImageUrl}
          generateFileName={generateFileName}
        />

        <Button
          type="button"
          onClick={() => setIsPdfOpen(true)}
          className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
        >
          PDFs
        </Button>
        <PdfModal
          isOpen={isPdfOpen}
          onClose={() => setIsPdfOpen(false)}
          pdf1={pdf1}
          setPdf1={setPdf1}
          pdf2={pdf2}
          setPdf2={setPdf2}
          pdf3={pdf3}
          setPdf3={setPdf3}
          pdf4={pdf4}
          setPdf4={setPdf4}
          pdf5={pdf5}
          setPdf5={setPdf5}
          pdf6={pdf6}
          setPdf6={setPdf6}
          pdf7={pdf7}
          setPdf7={setPdf7}
          pdf8={pdf8}
          setPdf8={setPdf8}
          pdf9={pdf9}
          setPdf9={setPdf9}
          pdf10={pdf10}
          setPdf10={setPdf10}
          getPdfUrl={getPdfUrl}
        />
        <Button
          type="button"
          onClick={() => setIsWordOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Word
        </Button>
        <WordModal
          isOpen={isWordOpen}
          onClose={() => setIsWordOpen(false)}
          word1={word1}
          setWord1={setWord1}
        />
        <ClasSegSelect
          value={clas_seg}
          onChange={(value) => {
            setClas_seg(value);
            setValue("clas_seg", value);
          }}
        />
        <FechaHoraEvento
          value={fechaHora}
          onChange={(value: string) => {
            setFechaHora(value);
            setValue("fechaHora", value);
          }}
        />
        <SelectComp
          initialEstablecimiento={selectedEstablecimiento}
          initialModuloUr={selectedModuloUr}
          initialPabellon={selectedPabellon}
          onEstablecimientoChange={(value) => {
            setSelectedEstablecimiento(value);
            setValue("establecimiento", value);
          }}
          onModuloUrChange={(value) => setSelectedModuloUr(value)}
          onPabellonChange={(value) => setSelectedPabellon(value)}
        />
        <PrevencionesSelect
          initialSectors={selectedSectors}
          onSelect={(value) => {
            setSelectedSectors(value);
            setValue("sector", value.map((s) => s.option).join(", "));
          }}
        />
        <PersonalInvolucrado
          initialAgentes={selectedAgentes}
          onSelect={(value) => {
            setSelectedAgentes(value);
            setValue("personalinvolucrado", JSON.stringify(value));
          }}
        />
        <InternosInvolucrados
          initialInternos={selectedInternos}
          onSelect={(value) => {
            setSelectedInternos(value);
            setValue("internosinvolucrado", JSON.stringify(value));
          }}
        />
        <JuzgadoSelector
          initialJuzgados={selectedJuzgados}
          onSelect={(selectedJuzgados) => {
            setSelectedJuzgados(selectedJuzgados);
            setValue("juzgados", JSON.stringify(selectedJuzgados)); // Modificar esta línea
          }}
        />
        <Toggle
          id="focoIgneo"
          value={focoIgneo}
          onChange={(value) => {
            setFocoIgneo(value);
            setValue("foco_igneo", value ? "Si" : "No");
          }}
          label="¿Foco ígneo?"
        />
        <Toggle
          id="reyerta"
          value={reyerta}
          onChange={(value) => {
            setReyerta(value);
            setValue("reyerta", value ? "Si" : "No");
          }}
          label="¿Reyerta?"
        />
        <Toggle
          id="intervRequisa"
          value={intervRequisa}
          onChange={(value) => {
            setIntervRequisa(value);
            setValue("interv_requisa", value ? "Si" : "No");
          }}
          label="¿Intervención de requisa?"
        />
        <InputFieldExpediente register={register} label="Expediente" />
        <Textarea
          id="observacion"
          value={observacion}
          onChange={(value) => {
            setobservacion(value);
            setValue("observacion", value);
          }}
          label="Observaciones"
          placeholder="Escribe las observaciones aquí..."
        />
        <div className="flex space-x-4">
          <Button
            type="button"
            onClick={goToPrevenciones}
            className="bg-orange-500"
          >
            Volver
          </Button>
          <Button
            type="submit"
            className="bg-blue-500"
            disabled={isSubmitting} // Bloquear el botón si está enviando
          >
            {isSubmitting
              ? params.id
                ? "Actualizando..."
                : "Posteando..."
              : params.id
              ? "Actualizar"
              : "Crear"}
          </Button>
        </div>
      </div>
    </form>
  );
}
