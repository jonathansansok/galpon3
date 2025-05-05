//frontend\src\app\portal\eventos\elementos\new\ElementoForm.tsx
"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import WatermarkBackground from "@/components/WatermarkBackground";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SelectComp from "@/components/ui/SelectAnidaciones";
import InternosInvolucrados from "@/components/ui/InternosInvolucrados";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import { InputField } from "@/components/ui/InputField";
import Textarea from "@/components/ui/Textarea";
import { InputFieldExpediente } from "@/components/ui/inputs/InputFieldExpediente";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { createElemento, updateElemento } from "../elementos.api";
import { useUserStore } from "@/lib/store";
import { ShowElementos, showCancelAlert } from "../../../../utils/alertUtils";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";
import EstupefacientesModal from "@/components/ui/secuestroElementos/EstupefacientesModal";
import ArmasModal from "@/components/ui/secuestroElementos/ArmasModal";
import ElectronicosModal from "@/components/ui/secuestroElementos/ElectronicosModal";
import ComponentesModal from "@/components/ui/secuestroElementos/ComponentesModal";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
interface FormValues {
  [key: string]: string;
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

export function ElementoForm({ elemento }: { elemento: any }) {
  const { handleSubmit, setValue, register, watch } = useForm<FormValues>({
    defaultValues: {
      prevencion: elemento?.prevencion || "",
      establecimiento: elemento?.establecimiento || "",
      modulo_ur: elemento?.modulo_ur || "",
      pabellon: elemento?.pabellon || "",
      fechaHora: elemento?.fechaHora || "",
      expediente: elemento?.expediente || "",
      observacion: elemento?.observacion || "",
      medidas: elemento?.medidas || "",
      dentroDePabellon: elemento?.dentroDePabellon || "",
      estupefacientes: elemento?.estupefacientes || "",
      armas: elemento?.armas || "",
      electronicos: elemento?.electronicos || "",
      componentes: elemento?.componentes || "",
      internosinvolucrado: JSON.stringify(elemento?.internosinvolucrado || []),
      email: elemento?.email || "",
      clas_seg: elemento?.clas_seg || "",
      imagen: elemento?.imagen || "",
      imagenDer: elemento?.imagenDer || "",
      imagenIz: elemento?.imagenIz || "",
      imagenDact: elemento?.imagenDact || "",
      imagenSen1: elemento?.imagenSen1 || "",
      imagenSen2: elemento?.imagenSen2 || "",
      imagenSen3: elemento?.imagenSen3 || "",
      imagenSen4: elemento?.imagenSen4 || "",
      imagenSen5: elemento?.imagenSen5 || "",
      imagenSen6: elemento?.imagenSen6 || "",
      pdf1: elemento?.pdf1 || "",
      pdf2: elemento?.pdf2 || "",
      pdf3: elemento?.pdf3 || "",
      pdf4: elemento?.pdf4 || "",
      pdf5: elemento?.pdf5 || "",
      pdf6: elemento?.pdf6 || "",
      pdf7: elemento?.pdf7 || "",
      pdf8: elemento?.pdf8 || "",
      pdf9: elemento?.pdf9 || "",
      pdf10: elemento?.pdf10 || "",
      word1: elemento?.word1 || "",
    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fechaHora, setFechaHora] = useState<string>(elemento?.fechaHora || "");
  const [observacion, setObservacion] = useState<string>(
    elemento?.observacion || ""
  );
  const [medidas, setMedidas] = useState<string>(elemento?.medidas || "");
  const [prevencion, setPrevencion] = useState<string>(
    elemento?.prevencion || ""
  );
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(elemento?.establecimiento || "");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(
    elemento?.modulo_ur || ""
  );
  const [selectedPabellon, setSelectedPabellon] = useState<string>(
    elemento?.pabellon || ""
  );

  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (elemento?.internosinvolucrado) {
        return JSON.parse(elemento.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });
  const [clas_seg, setClas_seg] = useState<string>(elemento?.clas_seg || "");

  const [estupefacientes, setEstupefacientes] = useState<string>(
    elemento?.estupefacientes || ""
  );
  const [armas, setArmas] = useState<string>(elemento?.armas || "");
  const [electronicos, setElectronicos] = useState<string>(
    elemento?.electronicos || ""
  );
  const [componentes, setComponentes] = useState<string>(
    elemento?.componentes || ""
  );

  const [imagen, setImagen] = useState<string | null>(
    elemento?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.imagen}`
      : null
  );

  const [imagenDer, setImagenDer] = useState<string | null>(
    elemento?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    elemento?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    elemento?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    elemento?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    elemento?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    elemento?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    elemento?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    elemento?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    elemento?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    elemento?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    elemento?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    elemento?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    elemento?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    elemento?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    elemento?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    elemento?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    elemento?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    elemento?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    elemento?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    elemento?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/elementos/uploads/${elemento.word1}`
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
    return `/api/elementos/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/elementos/uploads/${pdfPath.split("/").pop()}`;
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

    setIsSubmitting(true); // Bloquear el botón

    try {
      let response;

      const payload: any = {
        prevencion: data.prevencion,
        establecimiento: data.establecimiento,
        modulo_ur: selectedModuloUr,
        pabellon: selectedPabellon,
        expediente: data.expediente,
        observacion: data.observacion,
        medidas: data.medidas,
        imagenes: data.imagenes,
        estupefacientes: estupefacientes,
        armas: armas,
        electronicos: electronicos,
        componentes: componentes,
        clas_seg: data.clas_seg,
        internosinvolucrado: JSON.stringify(selectedInternos),
        email: user?.email,
      };

      if (data.fechaHora) {
        payload.fechaHora = data.fechaHora;
      }

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

      let mensajeTitulo;
      if (params?.id) {
        response = await updateElemento(params.id, formData);
        mensajeTitulo = "Actualización de Secuestro de elementos";
      } else {
        response = await createElemento(formData);
        mensajeTitulo = "Creación de Secuestro de elementos";
      }

      if (response.success) {
        await ShowElementos(response.success, mensajeTitulo, {
          ...data,
          modulo_ur: selectedModuloUr,
          pabellon: selectedPabellon,
        });
        router.push("/portal/eventos/elementos");
      } else {
        console.error("Error al crear o actualizar elemento:", response.error);
        ShowElementos(false, "Error", {
          ...data,
          modulo_ur: selectedModuloUr,
          pabellon: selectedPabellon,
        });
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      ShowElementos(false, "Error", {
        ...data,
        modulo_ur: selectedModuloUr,
        pabellon: selectedPabellon,
      });
    } finally {
      setIsSubmitting(false); // Desbloquear el botón
    }
  };
  const goToElementos = () => {
    router.push("/portal/eventos/elementos");
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
        <InternosInvolucrados
          initialInternos={selectedInternos}
          onSelect={(value) => {
            setSelectedInternos(value);
            setValue("internosinvolucrado", JSON.stringify(value));
          }}
        />

        <EstupefacientesModal
          initialEstupefacientes={estupefacientes}
          onSave={(data) => {
            setEstupefacientes(data);
            setValue("estupefacientes", data);
          }}
        />
        <ArmasModal
          initialArmas={armas}
          onSave={(data) => {
            setArmas(data);
            setValue("armas", data);
          }}
        />
        <ElectronicosModal
          initialElectronicos={electronicos}
          onSave={(data) => {
            setElectronicos(data);
            setValue("electronicos", data);
          }}
        />
        <ComponentesModal
          initialComponentes={componentes}
          onSave={(data) => {
            setComponentes(data);
            setValue("electronicos", data);
          }}
        />
        <InputFieldExpediente register={register} label="Expediente" />
        <Textarea
          id="prevencion"
          value={prevencion}
          onChange={(value) => {
            setPrevencion(value);
            setValue("prevencion", value);
          }}
          label="Prevención"
          placeholder="Escribe Prevención aquí..."
        />
        <Textarea
          id="medidas"
          value={medidas}
          onChange={(value) => {
            setMedidas(value);
            setValue("medidas", value);
          }}
          label="Medidas"
          placeholder="Escribe las Medidas aquí..."
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
          <Button type="button" onClick={goToElementos} className="bg-orange-500">
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
