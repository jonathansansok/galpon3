// frontend/src/app/portal/eventos/atentados/AtentadoForm.tsx
"use client";
import { Button } from "@/components/ui/button";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createAtentado, updateAtentado } from "../Atentados.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { InputField } from "@/components/ui/InputField";
import Textarea from "@/components/ui/Textarea";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";
import FechaHoraVencTime from "@/components/ui/FechaHoraVencTime";

import FechaHoraUlOrCap from "@/components/ui/fechaHoraUlOrCap";
import PersonalInvolucrado from "@/components/ui/PersonalInvolucrado";
import InternosInvolucrados from "@/components/ui/InternosInvolucrados";
import { InputFieldExpediente } from "@/components/ui/inputs/InputFieldExpediente";
import { JuzgadoSelector } from "@/components/ui/JuzgadoSelector";
import { useUserStore } from "@/lib/store";
import AtentadoToggle from "@/components/ui/AtentadoToggle";
import SelectComp from "@/components/ui/SelectAnidaciones";
import SelectAcontecimientoAt from "@/components/ui/selects/SelectAcontecimientoAt";
import { ShowAtentados, showCancelAlert } from "../../../../utils/alertUtils";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
interface Juzgado {
  Juzgado: string;
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

export function AtentadoForm({ atentado }: { atentado: any }) {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { handleSubmit, setValue, register, watch } = useForm<FormValues>({
    defaultValues: {
      email: atentado?.email || "",
      personalinvolucrado: JSON.stringify(atentado?.personalinvolucrado || []),
      internosinvolucrado: JSON.stringify(atentado?.internosinvolucrado || []),
      fechaHora: atentado?.fechaHora || "",
      establecimiento: atentado?.establecimiento || "",
      modulo_ur: atentado?.modulo_ur || "",
      pabellon: atentado?.pabellon || "",
      acontecimiento: atentado?.acontecimiento || "",
      prevencioSiNo: atentado?.prevencioSiNo === "Si" ? "Si" : "No", // Cambiar a cadena
      ordenCapDip: atentado?.ordenCapDip === "Si" ? "Si" : "No", // Cambiar a cadena
      fechaVenc: atentado?.fechaVenc === "Si" ? "Si" : "No", // Cambiar a cadena
      jurisdiccion: atentado?.jurisdiccion || "",
      juzgados: atentado?.juzgados || "",
      fechaHoraVencTime: atentado?.fechaHoraVencTime || "",
      FechaHoraUlOrCap: atentado?.FechaHoraUlOrCap || "",
      clas_seg: atentado?.clas_seg || "",
      observacion: atentado?.observacion || "",
      otrosDatos: atentado?.otrosDatos || "",
      expediente: atentado?.expediente || "",
      imagen: atentado?.imagen || "",
      imagenDer: atentado?.imagenDer || "",
      imagenIz: atentado?.imagenIz || "",
      imagenDact: atentado?.imagenDact || "",
      imagenSen1: atentado?.imagenSen1 || "",
      imagenSen2: atentado?.imagenSen2 || "",
      imagenSen3: atentado?.imagenSen3 || "",
      imagenSen4: atentado?.imagenSen4 || "",
      imagenSen5: atentado?.imagenSen5 || "",
      imagenSen6: atentado?.imagenSen6 || "",
      pdf1: atentado?.pdf1 || "",
      pdf2: atentado?.pdf2 || "",
      pdf3: atentado?.pdf3 || "",
      pdf4: atentado?.pdf4 || "",
      pdf5: atentado?.pdf5 || "",
      pdf6: atentado?.pdf6 || "",
      pdf7: atentado?.pdf7 || "",
      pdf8: atentado?.pdf8 || "",
      pdf9: atentado?.pdf9 || "",
      pdf10: atentado?.pdf10 || "",
      word1: atentado?.word1 || "",
    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [observacion, setObservacion] = useState<string>(
    atentado?.observacion || ""
  );
  const [otrosDatos, setOtrosdatos] = useState<string>(
    atentado?.otrosDatos || ""
  );
  const [fechaHora, setFechaHora] = useState<string>(atentado?.fechaHora || "");

  const [prevencioSiNo, setPrevencioSiNo] = useState<boolean>(
    atentado?.prevencioSiNo === "Si"
  );
  const [fechaVenc, setfechaVenc] = useState<boolean>(
    atentado?.fechaVenc === "Si"
  );
  const [ordenCapDip, setOrdenCapDip] = useState<boolean>(
    atentado?.ordenCapDip === "Si"
  );

  const [fechaHoraVencTime, setFechaHoraVencTime] = useState<string>(
    atentado?.fechaHoraVencTime || ""
  );
  const [clas_seg, setClas_seg] = useState<string>(atentado?.clas_seg || "");
  const [fechaHoraUlOrCap, setFechaHoraUlOrCap] = useState<string>(
    atentado?.fechaHoraUlOrCap || ""
  );
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(atentado?.establecimiento || "");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(
    atentado?.modulo_ur || ""
  );
  const [selectedPabellon, setSelectedPabellon] = useState<string>(
    atentado?.pabellon || ""
  );
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (atentado?.internosinvolucrado) {
        return JSON.parse(atentado.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });
  const [selectedAgentes, setSelectedAgentes] = useState<Agente[]>(() => {
    try {
      if (atentado?.personalinvolucrado) {
        return JSON.parse(atentado.personalinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing personalinvolucrado:", error);
    }
    return [];
  });
  const [selectedJuzgados, setSelectedJuzgados] = useState<string[]>(() => {
    if (atentado?.juzgados) {
      return atentado.juzgados.split(", ");
    }
    return [];
  });
  useEffect(() => {}, [selectedJuzgados]);
  const [acontecimiento, setAcontecimiento] = useState<string>(
    atentado?.acontecimiento || ""
  );

  const [imagen, setImagen] = useState<string | null>(
    atentado?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.imagen}`
      : null
  );

  const [imagenDer, setImagenDer] = useState<string | null>(
    atentado?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    atentado?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    atentado?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    atentado?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    atentado?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    atentado?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    atentado?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    atentado?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    atentado?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    atentado?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    atentado?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    atentado?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    atentado?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    atentado?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    atentado?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    atentado?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    atentado?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    atentado?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    atentado?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    atentado?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/atentados/uploads/${atentado.word1}`
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
    return `/api/atentados/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/atentados/uploads/${pdfPath.split("/").pop()}`;
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
  const fieldLabels: Record<string, string> = {
    establecimiento: "Establecimiento",
    fechaHora: "Fecha y hora de evento",
    clas_seg: "Clasificación de Seguridad",
    acontecimiento: "Acontecimiento",
  };

  const requiredFields = [
    "establecimiento",
    "fechaHora",
    "clas_seg",
    "acontecimiento",
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
        email: user?.email,
        personalinvolucrado: JSON.stringify(selectedAgentes),
        internosinvolucrado: JSON.stringify(selectedInternos),
        fechaHora: data.fechaHora,
        establecimiento: data.establecimiento,
        modulo_ur: selectedModuloUr,
        pabellon: selectedPabellon,
        acontecimiento: data.acontecimiento,
        prevencioSiNo: prevencioSiNo ? "Si" : "No",
        ordenCapDip: ordenCapDip ? "Si" : "No",
        fechaVenc: fechaVenc ? "Si" : "No",
        clas_seg: data.clas_seg,
        jurisdiccion: data.jurisdiccion,
        juzgados: selectedJuzgados.join(", "),
        observacion: data.observacion,
        otrosDatos: data.otrosDatos,
        expediente: data.expediente,
      };

      if (data.fechaHoraVencTime) {
        payload.fechaHoraVencTime = data.fechaHoraVencTime;
      }

      if (data.fechaHoraUlOrCap) {
        payload.fechaHoraUlOrCap = data.fechaHoraUlOrCap;
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
        response = await updateAtentado(params.id, formData);
        mensajeTitulo = "Actualización de Atentado a la seguridad";
      } else {
        response = await createAtentado(formData);
        mensajeTitulo = "Creación de Atentado a la seguridad";
      }

      if (response.success) {
        await ShowAtentados(true, mensajeTitulo, payload);
        router.push("/portal/eventos/atentados");
      } else {
        await ShowAtentados(false, "ERROR", {});
        console.error("Error al enviar el formulario:", response.error);
      }
    } catch (error) {
      await ShowAtentados(false, "ERROR", {});
      console.error("Error en la solicitud:", error);
    } finally {
      setIsSubmitting(false); // Desbloquear el botón
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Agregar el WatermarkBackground */}
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

        <SelectAcontecimientoAt
          value={acontecimiento}
          onChange={(value) => {
            setAcontecimiento(value);
            setValue("acontecimiento", value);
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
          onModuloUrChange={(value) => {
            setSelectedModuloUr(value);
            setValue("modulo_ur", value);
          }}
          onPabellonChange={(value) => {
            setSelectedPabellon(value);
            setValue("pabellon", value);
          }}
        />

        <AtentadoToggle
          id="prevencioSiNo"
          value={prevencioSiNo}
          onChange={(value) => {
            setPrevencioSiNo(value);
            setValue("prevencioSiNo", value ? "Si" : "No");
          }}
          label="¿Prevención Sí/No?"
        />
        <InputField
          register={register}
          name="jurisdiccion"
          label="Jurisdicción"
          placeholder="Jurisdicción"
        />
        <JuzgadoSelector
          initialJuzgados={selectedJuzgados}
          onSelect={(selectedJuzgados) => {
            setSelectedJuzgados(selectedJuzgados);
            setValue("juzgados", selectedJuzgados.join(", "));
          }}
        />
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <AtentadoToggle
            id="fechaVenc"
            value={fechaVenc}
            onChange={(value) => {
              setfechaVenc(value);
              setValue("fechaVenc", value ? "Si" : "No");
            }}
            label="Fecha Vencimiento de condena"
          />
          <FechaHoraVencTime
            value={fechaHoraVencTime}
            onChange={(value: string) => {
              setFechaHoraVencTime(value);
              setValue("fechaHoraVencTime", value);
            }}
          />
        </div>
        <AtentadoToggle
          id="ordenCapDip"
          value={ordenCapDip}
          onChange={(value) => {
            setOrdenCapDip(value);
            setValue("ordenCapDip", value ? "Si" : "No");
          }}
          label="Posee orden de captura librada al D.I.P."
        />
        <FechaHoraUlOrCap
          value={fechaHoraUlOrCap}
          onChange={(value: string) => {
            setFechaHoraUlOrCap(value);
            setValue("fechaHoraUlOrCap", value);
          }}
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
        <Textarea
          id="otrosDatos"
          value={otrosDatos}
          onChange={(value) => {
            setOtrosdatos(value);
            setValue("otrosDatos", value);
          }}
          label="Otros datos de interes extraidos del oficio"
          placeholder="Escribe otros datos de interes extraidos del oficio aquí..."
        />
        <InternosInvolucrados
          initialInternos={selectedInternos}
          onSelect={(value) => {
            setSelectedInternos(value);
            setValue("internosinvolucrado", JSON.stringify(value));
          }}
        />
        <PersonalInvolucrado
          initialAgentes={selectedAgentes}
          onSelect={(value) => {
            setSelectedAgentes(value);
            setValue("personalinvolucrado", JSON.stringify(value));
          }}
        />
        <InputFieldExpediente register={register} label="Expediente" />

        <div className="flex space-x-4">
          <Button
            type="button"
            onClick={() => router.push("/portal/eventos/atentados")}
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
