"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SelectComp from "@/components/ui/SelectAnidaciones";
import PersonalInvolucrado from "@/components/ui/PersonalInvolucrado";
import InternosInvolucrados from "@/components/ui/InternosInvolucrados";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import { InputField } from "@/components/ui/InputField";
import Textarea from "@/components/ui/Textarea";
import { InputFieldExpediente } from "@/components/ui/inputs/InputFieldExpediente";
import { InputFieldPorOrdenDe } from "@/components/ui/inputs/PorOrdenDe";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  createProcedimiento,
  updateProcedimiento,
} from "../Procedimientos.api";
import { useUserStore } from "@/lib/store";
import {
  ShowProcedimientos,
  showCancelAlert,
} from "../../../../utils/alertUtils";
import Toggle from "@/components/ui/Toggle";
import TipoProcedimientoSelect from "@/components/ui/selects/TipoProcedimientoSelect";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";
import ProcedimientosSectorSelect from "@/components/ui/selects/ProcedimientosSectorSelect";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
interface FormValues {
  [key: string]: string;
  establecimiento: string;
  fechaHora: string;
  observacion: string;
  medidas: string;
  sector: string; // Añadir sector aquí
  personalinvolucrado: string;
  internosinvolucrado: string;
  expediente: string;
  interv_requisa: string;
  tipo_procedimiento: string;
  por_orden_de: string;
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

export function ProcedimientoForm({ procedimiento }: { procedimiento: any }) {
  const { handleSubmit, setValue, register, watch } = useForm<FormValues>({
    defaultValues: {
      establecimiento: procedimiento?.establecimiento || "",
      fechaHora: procedimiento?.fechaHora || "",
      observacion: procedimiento?.observacion || "",
      medidas: procedimiento?.medidas || "",
      sector: procedimiento?.sector || "", // Asegúrate de incluir sector aquí
      personalinvolucrado: JSON.stringify(
        procedimiento?.personalinvolucrado || []
      ),
      internosinvolucrado: JSON.stringify(
        procedimiento?.internosinvolucrado || []
      ),
      expediente: procedimiento?.expediente || "",
      por_orden_de: procedimiento?.por_orden_de || "",
      interv_requisa: procedimiento?.interv_requisa === "Si" ? "Si" : "No", // Cambiar a cadena
      tipo_procedimiento: procedimiento?.tipo_procedimiento || "",
      clas_seg: procedimiento?.clas_seg || "",
      imagen: procedimiento?.imagen || "",
      imagenDer: procedimiento?.imagenDer || "",
      imagenIz: procedimiento?.imagenIz || "",
      imagenDact: procedimiento?.imagenDact || "",
      imagenSen1: procedimiento?.imagenSen1 || "",
      imagenSen2: procedimiento?.imagenSen2 || "",
      imagenSen3: procedimiento?.imagenSen3 || "",
      imagenSen4: procedimiento?.imagenSen4 || "",
      imagenSen5: procedimiento?.imagenSen5 || "",
      imagenSen6: procedimiento?.imagenSen6 || "",
      pdf1: procedimiento?.pdf1 || "",
      pdf2: procedimiento?.pdf2 || "",
      pdf3: procedimiento?.pdf3 || "",
      pdf4: procedimiento?.pdf4 || "",
      pdf5: procedimiento?.pdf5 || "",
      pdf6: procedimiento?.pdf6 || "",
      pdf7: procedimiento?.pdf7 || "",
      pdf8: procedimiento?.pdf8 || "",
      pdf9: procedimiento?.pdf9 || "",
      pdf10: procedimiento?.pdf10 || "",
      word1: procedimiento?.word1 || "",
    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [porOrdenDe, setPorOrdenDe] = useState<string>(
    procedimiento?.por_orden_de || ""
  );
  const [fechaHora, setFechaHora] = useState<string>(
    procedimiento?.fechaHora || ""
  );
  const [observacion, setObservacion] = useState<string>(
    procedimiento?.observacion || ""
  );
  const [medidas, setMedidas] = useState<string>(procedimiento?.medidas || "");
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(procedimiento?.establecimiento || "");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(
    procedimiento?.modulo_ur || ""
  );
  const [selectedPabellon, setSelectedPabellon] = useState<string>(
    procedimiento?.pabellon || ""
  );
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>(() => {
    if (procedimiento?.sector) {
      return procedimiento.sector
        .split(", ")
        .map((sector: string) => ({ option: sector }));
    }
    return [];
  });
  const [selectedAgentes, setSelectedAgentes] = useState<Agente[]>(() => {
    try {
      if (procedimiento?.personalinvolucrado) {
        return JSON.parse(procedimiento.personalinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing personalinvolucrado:", error);
    }
    return [];
  });
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (procedimiento?.internosinvolucrado) {
        return JSON.parse(procedimiento.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });

  const [intervRequisa, setIntervRequisa] = useState<boolean>(
    procedimiento?.interv_requisa === "Si"
  );
  const [clas_seg, setClas_seg] = useState<string>(
    procedimiento?.clas_seg || ""
  );

  const [tipoProcedimiento, setTipoProcedimiento] = useState<string>(
    procedimiento?.tipo_procedimiento || ""
  );



  const [imagen, setImagen] = useState<string | null>(
    procedimiento?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.imagen}`
      : null
  );
  
  const [imagenDer, setImagenDer] = useState<string | null>(
    procedimiento?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    procedimiento?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    procedimiento?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    procedimiento?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    procedimiento?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    procedimiento?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    procedimiento?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    procedimiento?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    procedimiento?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    procedimiento?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    procedimiento?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    procedimiento?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    procedimiento?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    procedimiento?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    procedimiento?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    procedimiento?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    procedimiento?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    procedimiento?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    procedimiento?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    procedimiento?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedimientos/uploads/${procedimiento.word1}`
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
    return `/api/procedimientos/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/procedimientos/uploads/${pdfPath.split("/").pop()}`;
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
      medidas: data.medidas,
      personalinvolucrado: JSON.stringify(selectedAgentes || []),
      internosinvolucrado: JSON.stringify(selectedInternos || []),
      expediente: data.expediente,
      por_orden_de: data.por_orden_de,
      interv_requisa: intervRequisa ? "Si" : "No",
      tipo_procedimiento: data.tipo_procedimiento,
      clas_seg: data.clas_seg,
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
      response = await updateProcedimiento(params.id, formData);
    } else {
      response = await createProcedimiento(formData);
    }

    const mensajeTitulo = params.id
      ? "Actualización de Procedimiento"
      : "Creación de Procedimiento";

    if (response.success) {
      await ShowProcedimientos(response.success, mensajeTitulo, {
        ...data,
        modulo_ur: selectedModuloUr,
        pabellon: selectedPabellon,
        interv_requisa: intervRequisa ? "Si" : "No",
      });
      router.push("/portal/eventos/procedimientos");
    } else {
      console.error("Error al crear o actualizar procedimiento:", response.error);
      await ShowProcedimientos(false, "Error", payload);
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    await ShowProcedimientos(false, "Error", {});
  } finally {
    setIsSubmitting(false); // Desbloquear el botón al finalizar
  }
};
  const goToProcedimientos = () => {
    router.push("/portal/eventos/procedimientos");
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
        <ProcedimientosSectorSelect
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
          id="intervRequisa"
          value={intervRequisa}
          onChange={(value) => {
            setIntervRequisa(value);
            setValue("interv_requisa", value ? "Si" : "No");
          }}
          label="¿Intervención de requisa?"
        />
        <TipoProcedimientoSelect
          value={tipoProcedimiento}
          onChange={(value) => {
            setTipoProcedimiento(value);
            setValue("tipo_procedimiento", value);
          }}
        />
        <InputFieldPorOrdenDe
          name="por_orden_de"
          label="Por orden de"
          placeholder=""
          value={porOrdenDe}
          onChange={(value) => {
            setPorOrdenDe(value);
            setValue("por_orden_de", value);
          }}
        />
        <InputFieldExpediente register={register} label="Expediente" />
        <Textarea
          id="medidas"
          value={medidas}
          onChange={(value) => {
            setMedidas(value);
            setValue("medidas", value);
          }}
          label="Medidas adoptadas"
          placeholder="Escribe las Medidas adoptadas aquí..."
        />
        <Textarea
          id="observacion"
          value={observacion}
          onChange={(value) => {
            setObservacion(value);
            setValue("observacion", value);
          }}
          label="Observaciones"
          placeholder="Escribe las observaciones aquí..."
        />
        <div className="flex space-x-4">
          <Button
            type="button"
            onClick={goToProcedimientos}
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
