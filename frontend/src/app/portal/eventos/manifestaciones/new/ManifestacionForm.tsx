//frontend\src\app\portal\eventos\manifestaciones\new\ManifestacionForm.tsx
"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import WatermarkBackground from "@/components/WatermarkBackground";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SelectComp from "@/components/ui/SelectAnidaciones";
import SectorSelect from "@/components/ui/SectorSelect";
import PersonalInvolucrado from "@/components/ui/PersonalInvolucrado";
import InternosInvolucrados from "@/components/ui/InternosInvolucrados";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import Textarea from "@/components/ui/Textarea";
import { InputFieldExpediente } from "@/components/ui/inputs/InputFieldExpediente";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  createManifestacion,
  updateManifestacion,
} from "../manifestaciones.api";
import { useUserStore } from "@/lib/store";
import {
  showManifestacion,
  showCancelAlert,
} from "../../../../utils/alertUtils";
import Toggle from "@/components/ui/Toggle";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";
interface FormValues {
  [key: string]: string;
  expediente: string; // Añadir el campo expediente
  foco_igneo: string; // Añadir el campo foco_igneo
  reyerta: string; // Añadir el campo reyerta
  interv_requisa: string; // Añadir el campo interv_requisa
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

export function ManifestacionForm({ manifestacion }: { manifestacion: any }) {
  const { handleSubmit, setValue, register, watch } = useForm<FormValues>({
    defaultValues: {
      establecimiento: manifestacion?.establecimiento || "",
      modulo_ur: manifestacion?.modulo_ur || "",
      fechaHora: manifestacion?.fechaHora || "",
      observacion: manifestacion?.observacion || "",
      sector: manifestacion?.sector || "",
      personalinvolucrado: JSON.stringify(
        manifestacion?.personalinvolucrado || []
      ),
      internosinvolucrado: JSON.stringify(
        manifestacion?.internosinvolucrado || []
      ),
      clas_seg: manifestacion?.clas_seg || "",
      expediente: manifestacion?.expediente || "", // Añadir el valor predeterminado para expediente
      foco_igneo: manifestacion?.foco_igneo === "Si" ? "Si" : "No", // Cambiar a cadena
      reyerta: manifestacion?.reyerta === "Si" ? "Si" : "No", // Cambiar a cadena
      interv_requisa: manifestacion?.interv_requisa === "Si" ? "Si" : "No", // Cambiar a cadena
      imagen: manifestacion?.imagen || "",
      imagenDer: manifestacion?.imagenDer || "",
      imagenIz: manifestacion?.imagenIz || "",
      imagenDact: manifestacion?.imagenDact || "",
      imagenSen1: manifestacion?.imagenSen1 || "",
      imagenSen2: manifestacion?.imagenSen2 || "",
      imagenSen3: manifestacion?.imagenSen3 || "",
      imagenSen4: manifestacion?.imagenSen4 || "",
      imagenSen5: manifestacion?.imagenSen5 || "",
      imagenSen6: manifestacion?.imagenSen6 || "",
      pdf1: manifestacion?.pdf1 || "",
      pdf2: manifestacion?.pdf2 || "",
      pdf3: manifestacion?.pdf3 || "",
      pdf4: manifestacion?.pdf4 || "",
      pdf5: manifestacion?.pdf5 || "",
      pdf6: manifestacion?.pdf6 || "",
      pdf7: manifestacion?.pdf7 || "",
      pdf8: manifestacion?.pdf8 || "",
      pdf9: manifestacion?.pdf9 || "",
      pdf10: manifestacion?.pdf10 || "",
      word1: manifestacion?.word1 || "",
    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fechaHora, setFechaHora] = useState<string>(
    manifestacion?.fechaHora || ""
  );
  const [observacion, setobservacion] = useState<string>(
    manifestacion?.observacion || ""
  );
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(manifestacion?.establecimiento || "");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(
    manifestacion?.modulo_ur || ""
  );
  const [selectedPabellon, setSelectedPabellon] = useState<string>(
    manifestacion?.pabellon || ""
  );
  const [clas_seg, setClas_seg] = useState<string>(
    manifestacion?.clas_seg || ""
  );
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>(() => {
    if (manifestacion?.sector) {
      return manifestacion.sector
        .split(", ")
        .map((sector: string) => ({ option: sector }));
    }
    return [];
  });
  const [selectedAgentes, setSelectedAgentes] = useState<Agente[]>(() => {
    try {
      if (manifestacion?.personalinvolucrado) {
        return JSON.parse(manifestacion.personalinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing personalinvolucrado:", error);
    }
    return [];
  });
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (manifestacion?.internosinvolucrado) {
        return JSON.parse(manifestacion.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });

  const [focoIgneo, setFocoIgneo] = useState<boolean>(
    manifestacion?.foco_igneo === "Si"
  );
  const [reyerta, setReyerta] = useState<boolean>(
    manifestacion?.reyerta === "Si"
  );
  const [intervRequisa, setIntervRequisa] = useState<boolean>(
    manifestacion?.interv_requisa === "Si"
  );
  const [imagen, setImagen] = useState<string | null>(
    manifestacion?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.imagen}`
      : null
  );

  const [imagenDer, setImagenDer] = useState<string | null>(
    manifestacion?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    manifestacion?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    manifestacion?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    manifestacion?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    manifestacion?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    manifestacion?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    manifestacion?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    manifestacion?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    manifestacion?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    manifestacion?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    manifestacion?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    manifestacion?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    manifestacion?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    manifestacion?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    manifestacion?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    manifestacion?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    manifestacion?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    manifestacion?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    manifestacion?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    manifestacion?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones/uploads/${manifestacion.word1}`
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
    return `/api/manifestaciones/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/manifestaciones/uploads/${pdfPath.split("/").pop()}`;
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
        modulo_ur: selectedModuloUr, // Asegurarse de incluir el valor
        pabellon: selectedPabellon, // Asegurarse de incluir el valor
        fechaHora: data.fechaHora || null,
        observacion: data.observacion,
        sector: data.sector,
        personalinvolucrado: JSON.stringify(selectedAgentes || []),
        internosinvolucrado: JSON.stringify(selectedInternos || []),
        clas_seg: data.clas_seg,
        expediente: data.expediente,
        foco_igneo: focoIgneo ? "Si" : "No", // Enviar como cadena
        reyerta: reyerta ? "Si" : "No", // Enviar como cadena
        interv_requisa: intervRequisa ? "Si" : "No", // Enviar como cadena
        email: user?.email,
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
        response = await updateManifestacion(params.id, formData);
      } else {
        response = await createManifestacion(formData);
      }

      const mensajeTitulo = params.id
        ? "Actualización de Alteración al orden hab."
        : "Creación de Alteración al orden. hab.";

      if (response.success) {
        await showManifestacion(response.success, mensajeTitulo, payload);
        router.push("/portal/eventos/manifestaciones");
      } else {
        console.error(
          "Error al crear o actualizar manifestación:",
          response.error
        );
        await showManifestacion(false, "Error", payload);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      await showManifestacion(false, "Error", {});
    } finally {
      setIsSubmitting(false); // Desbloquear el botón al finalizar
    }
  };

  const goToManifestaciones = () => {
    router.push("/portal/eventos/manifestaciones");
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
    setValue("establecimiento", value); // Actualizar el formulario
  }}
  onModuloUrChange={(value) => {
    setSelectedModuloUr(value);
    setValue("modulo_ur", value); // Actualizar el formulario
  }}
  onPabellonChange={(value) => {
    setSelectedPabellon(value);
    setValue("pabellon", value); // Actualizar el formulario
  }}
/>
        <SectorSelect
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
            onClick={goToManifestaciones}
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
