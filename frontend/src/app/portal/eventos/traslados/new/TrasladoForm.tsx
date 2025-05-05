//frontend\src\app\portal\eventos\traslados\new\TrasladoForm.tsx
"use client";
import { Button } from "@/components/ui/button";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createTraslado, updateTraslado } from "../Traslados.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import { useUserStore } from "@/lib/store"; // Importar el store de Zustand
import { ShowTraslados, showCancelAlert } from "../../../../utils/alertUtils"; // Importa las funciones
import SelectEstabl from "@/components/ui/SelectEstabl";
import SelectEstabl2 from "@/components/ui/SelectEstabl2";
import InternosInvolucradosSimple from "@/components/ui/InternosInvolucradosSimple";
import FechaTraslado from "@/components/ui/FechaTraslado";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import { InputFieldYearDisp } from "@/components/ui/inputs/InputFieldYearDisp";
import { InputFieldYearDisp2 } from "@/components/ui/inputs/InputFieldYearDisp2";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";
interface FormValues {
  [key: string]: string;
  comunicacion: string;
  fechaHora: string;
  establecimiento: string;
  modulo_ur: string;
  email: string;

}

interface Interno {
  nombreApellido: string;
  alias: string;
  lpu: string;
  lpuProv: string;
  sitProc: string;
  detalle: string;
}
export function TrasladoForm({ traslado }: { traslado: any }) {
  const { handleSubmit, setValue, register, reset, watch } =
    useForm<FormValues>({
      defaultValues: {
        comunicacion: traslado?.comunicacion || "",
        motivo: traslado?.motivo || "",
        clas_seg: traslado?.clas_seg || "",
        fechaHora: traslado?.fechaHora || "",
        fechaTraslado: traslado?.fechaTraslado || "",
        disposicion: traslado?.disposicion || "",
        disposicion2: traslado?.disposicion2 || "",
        establecimiento: traslado?.establecimiento || "",
        establecimiento2: traslado?.establecimiento2 || "",
        email: traslado?.email || "",
        internosinvolucrado: JSON.stringify(traslado?.internosinvolucrado || []),
        imagen: traslado?.imagen || "",
        imagenDer: traslado?.imagenDer || "",
        imagenIz: traslado?.imagenIz || "",
        imagenDact: traslado?.imagenDact || "",
        imagenSen1: traslado?.imagenSen1 || "",
        imagenSen2: traslado?.imagenSen2 || "",
        imagenSen3: traslado?.imagenSen3 || "",
        imagenSen4: traslado?.imagenSen4 || "",
        imagenSen5: traslado?.imagenSen5 || "",
        imagenSen6: traslado?.imagenSen6 || "",
        pdf1: traslado?.pdf1 || "",
        pdf2: traslado?.pdf2 || "",
        pdf3: traslado?.pdf3 || "",
        pdf4: traslado?.pdf4 || "",
        pdf5: traslado?.pdf5 || "",
        pdf6: traslado?.pdf6 || "",
        pdf7: traslado?.pdf7 || "",
        pdf8: traslado?.pdf8 || "",
        pdf9: traslado?.pdf9 || "",
        pdf10: traslado?.pdf10 || "",
        word1: traslado?.word1 || "",
      },
    });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [fechaHora, setFechaHora] = useState<string>(traslado?.fechaHora || "");
  const [fechaTraslado, setFechaTraslado] = useState<string>(
    traslado?.fechaTraslado || ""
  );
  const [comunicacion, setComunicacion] = useState<string>(
    traslado?.comunicacion || ""
  );
  const [motivo, setMotivo] = useState<string>(traslado?.motivo || "");
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(traslado?.establecimiento || "");
    const [clas_seg, setClas_seg] = useState<string>(
      traslado?.clas_seg || ""
    );
  const [selectedEstablecimiento2, setSelectedEstablecimiento2] =
    useState<string>(traslado?.establecimiento2 || "");

    const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
      try {
        if (traslado?.internosinvolucrado) {
          return JSON.parse(traslado.internosinvolucrado);
        }
      } catch (error) {
      }
      return [];
    });
  

  const [imagen, setImagen] = useState<string | null>(
    traslado?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.imagen}`
      : null
  );

  const [imagenDer, setImagenDer] = useState<string | null>(
    traslado?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    traslado?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    traslado?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    traslado?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    traslado?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    traslado?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    traslado?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    traslado?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    traslado?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    traslado?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    traslado?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    traslado?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    traslado?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    traslado?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    traslado?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    traslado?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    traslado?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    traslado?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    traslado?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    traslado?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/traslados/uploads/${traslado.word1}`
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
    return `/api/traslados/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/traslados/uploads/${pdfPath.split("/").pop()}`;
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
  clas_seg: "Clasif. de seguridad",
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
      comunicacion: data.comunicacion,
      motivo: data.motivo,
      fechaHora: data.fechaHora || null,
      fechaTraslado: data.fechaTraslado || null,
      disposicion: data.disposicion || null,
      disposicion2: data.disposicion2 || null,
      establecimiento: data.establecimiento,
      establecimiento2: data.establecimiento2 || "",
      clas_seg: data.clas_seg,
      internosinvolucrado: JSON.stringify(selectedInternos),
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
      response = await updateTraslado(params.id, formData);
    } else {
      response = await createTraslado(formData);
    }

    const mensajeTitulo = params.id
      ? "Actualización de Traslado"
      : "Creación de Traslado";

    if (response.success) {
      await ShowTraslados(response.success, mensajeTitulo, payload);
      router.push("/portal/eventos/traslados");
    } else {
      console.error("Error al crear o actualizar traslado:", response.error);
      await ShowTraslados(false, "Error", payload);
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    await ShowTraslados(false, "Error", {});
  } finally {
    setIsSubmitting(false); // Desbloquear el botón al finalizar
  }
};

  const goToTraslados = () => {
    router.push("/portal/eventos/traslados");
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
       
       <InternosInvolucradosSimple
          initialInternos={selectedInternos}
          onSelect={(value) => {
            setSelectedInternos(value);
            setValue("internosinvolucrado", JSON.stringify(value));
          }}
        />
                <ClasSegSelect
          value={clas_seg}
          onChange={(value) => {
            setClas_seg(value);
            setValue("clas_seg", value);
          }}
        />
        <SelectEstabl
          initialEstablecimiento={selectedEstablecimiento}
          onEstablecimientoChange={(value) => {
            setSelectedEstablecimiento(value);
            setValue("establecimiento", value);
          }}
        />{" "}
        <SelectEstabl2
          initialEstablecimiento2={selectedEstablecimiento2}
          onEstablecimientoChange={(value) => {
            setSelectedEstablecimiento2(value);
            setValue("establecimiento2", value);
          }}
        />
<InputFieldYearDisp register={register} label="Disposición Nº" />
<InputFieldYearDisp2 register={register} label="Año Disposición" />
        <FechaHoraEvento
          value={fechaHora}
          onChange={(value: string) => {
            setFechaHora(value);
            setValue("fechaHora", value);
          }}
        />
        <FechaTraslado
          value={fechaTraslado}
          onChange={(value: string) => {
            setFechaTraslado(value);
            setValue("fechaTraslado", value);
          }}
        />
        <Textarea
          id="motivo"
          value={motivo}
          onChange={(value) => {
            setMotivo(value);
            setValue("motivo", value);
          }}
          label="Comunicación mediante"
          placeholder="Escribe la Comunicación mediante aquí..."
        />
        <Textarea
          id="comunicacion"
          value={comunicacion}
          onChange={(value) => {
            setComunicacion(value);
            setValue("comunicacion", value);
          }}
          label="Comunicación mediante"
          placeholder="Escribe la Comunicación mediante aquí..."
        />
        <div className="flex space-x-4">
          <Button type="button" onClick={goToTraslados} className="bg-orange-500">
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
