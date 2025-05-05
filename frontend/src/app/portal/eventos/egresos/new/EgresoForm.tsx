// frontend/src/app/portal/eventos/egresos/egresos.tsx
"use client";
import { Button } from "@/components/ui/button";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createEgreso, updateEgreso } from "../Egresos.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { InputField } from "@/components/ui/InputField";
import Textarea from "@/components/ui/Textarea";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";
import FechaHoraReintFueTerm from "@/components/ui/FechaHoraReintFueTerm";
import FechaHoraVencTime from "@/components/ui/FechaHoraVencTime";
import FechaHoraReingPorRecap from "@/components/ui/FechaHoraReingPorRecap";
import FechaHoraUlOrCap from "@/components/ui/fechaHoraUlOrCap";
import PersonalInvolucrado from "@/components/ui/PersonalInvolucrado";
import InternosInvolucrados from "@/components/ui/InternosInvolucrados";
import { InputFieldExpediente } from "@/components/ui/inputs/InputFieldExpediente";
import { JuzgadoSelector } from "@/components/ui/JuzgadoSelector";
import { useUserStore } from "@/lib/store";
import AtentadoToggle from "@/components/ui/AtentadoToggle";
import SelectComp from "@/components/ui/SelectAnidaciones";
import TipoDeSalida from "@/components/ui/selects/TipoDeSalida";
import Modalidad from "@/components/ui/selects/Modalidad";
import { ShowEgresos, showCancelAlert } from "../../../../utils/alertUtils";
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

export function EgresoForm({ egreso }: { egreso: any }) {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { handleSubmit, setValue, register, watch } = useForm<FormValues>({
    defaultValues: {
      email: egreso?.email || "",
      personalinvolucrado: JSON.stringify(egreso?.personalinvolucrado || []),
      internosinvolucrado: JSON.stringify(egreso?.internosinvolucrado || []),
      fechaHora: egreso?.fechaHora || "",
      establecimiento: egreso?.establecimiento || "",
      modulo_ur: egreso?.modulo_ur || "",
      clas_seg: egreso?.clas_seg || "",
      pabellon: egreso?.pabellon || "",
      acontecimiento: egreso?.acontecimiento || "",
      tipoDeSalida: egreso?.tipoDeSalida || "",
      modalidad: egreso?.modalidad || "",
      noReintSalTra: egreso?.noReintSalTra === "Si" ? "Si" : "No",
      reintFueraTerm: egreso?.reintFueraTerm === "Si" ? "Si" : "No",
      revArrDom: egreso?.revArrDom === "Si" ? "Si" : "No",
      revLibCond: egreso?.revLibCond === "Si" ? "Si" : "No",
      revlibAsis: egreso?.revlibAsis === "Si" ? "Si" : "No",
      fechaVenc: egreso?.fechaVenc === "Si" ? "Si" : "No",
      ordenCapDip: egreso?.ordenCapDip === "Si" ? "Si" : "No",
      reingPorRecap: egreso?.reingPorRecap === "Si" ? "Si" : "No",
      jurisdiccion: egreso?.jurisdiccion || "",
      plazo: egreso?.plazo || "",
      juzgados: egreso?.juzgados || "",
      fechaHoraVencTime: egreso?.fechaHoraVencTime || "",
      fechaHoraReintFueTerm: egreso?.fechaHoraReintFueTerm || "",
      FechaHoraUlOrCap: egreso?.FechaHoraUlOrCap || "",
      fechaHoraReingPorRecap: egreso?.fechaHoraReingPorRecap || "",
      observacion: egreso?.observacion || "",
      detalle: egreso?.detalle || "",
      otrosDatos: egreso?.otrosDatos || "",
      expediente: egreso?.expediente || "",
      imagen: egreso?.imagen || "",
      imagenDer: egreso?.imagenDer || "",
      imagenIz: egreso?.imagenIz || "",
      imagenDact: egreso?.imagenDact || "",
      imagenSen1: egreso?.imagenSen1 || "",
      imagenSen2: egreso?.imagenSen2 || "",
      imagenSen3: egreso?.imagenSen3 || "",
      imagenSen4: egreso?.imagenSen4 || "",
      imagenSen5: egreso?.imagenSen5 || "",
      imagenSen6: egreso?.imagenSen6 || "",
      pdf1: egreso?.pdf1 || "",
      pdf2: egreso?.pdf2 || "",
      pdf3: egreso?.pdf3 || "",
      pdf4: egreso?.pdf4 || "",
      pdf5: egreso?.pdf5 || "",
      pdf6: egreso?.pdf6 || "",
      pdf7: egreso?.pdf7 || "",
      pdf8: egreso?.pdf8 || "",
      pdf9: egreso?.pdf9 || "",
      pdf10: egreso?.pdf10 || "",
      word1: egreso?.word1 || "",
    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [observacion, setObservacion] = useState<string>(
    egreso?.observacion || ""
  );
  const [detalle, setDetalle] = useState<string>(egreso?.detalle || "");
  const [otrosDatos, setOtrosdatos] = useState<string>(
    egreso?.otrosDatos || ""
  );
  const [fechaHora, setFechaHora] = useState<string>(egreso?.fechaHora || "");
  const [noReintSalTra, setNoReintSalTra] = useState(
    egreso?.noReintSalTra === "Si"
  );
  const [reintFueraTerm, setReintFueraTerm] = useState(
    egreso?.reintFueraTerm === "Si"
  );
  const [revArrDom, setRevArrDom] = useState(egreso?.revArrDom === "Si");
  const [revLibCond, setRevLibCond] = useState(egreso?.revLibCond === "Si");
  const [revlibAsis, setRevlibAsis] = useState(egreso?.revlibAsis === "Si");
  const [fechaVenc, setfechaVenc] = useState(egreso?.fechaVenc === "Si");
  const [ordenCapDip, setOrdenCapDip] = useState(egreso?.ordenCapDip === "Si");
  const [reingPorRecap, setReingPorRecap] = useState(
    egreso?.reingPorRecap === "Si"
  );
  const [fechaHoraVencTime, setFechaHoraVencTime] = useState<string>(
    egreso?.fechaHoraVencTime || ""
  );

  const [fechaHoraReintFueTerm, setFechaHoraReintFueTerm] = useState<string>(
    egreso?.fechaHoraReintFueTerm || ""
  );
  const [fechaHoraUlOrCap, setFechaHoraUlOrCap] = useState<string>(
    egreso?.fechaHoraUlOrCap || ""
  );
  const [fechaHoraReingPorRecap, setFechaHoraReingPorRecap] = useState<string>(
    egreso?.fechaHoraReingPorRecap || ""
  );

  const [clas_seg, setClas_seg] = useState<string>(egreso?.clas_seg || "");
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(egreso?.establecimiento || "");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(
    egreso?.modulo_ur || ""
  );
  const [selectedPabellon, setSelectedPabellon] = useState<string>(
    egreso?.pabellon || ""
  );
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (egreso?.internosinvolucrado) {
        return JSON.parse(egreso.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });
  const [selectedAgentes, setSelectedAgentes] = useState<Agente[]>(() => {
    try {
      if (egreso?.personalinvolucrado) {
        return JSON.parse(egreso.personalinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing personalinvolucrado:", error);
    }
    return [];
  });
  const [selectedJuzgados, setSelectedJuzgados] = useState<string[]>(() => {
    if (egreso?.juzgados) {
      return egreso.juzgados.split(", ");
    }
    return [];
  });
  useEffect(() => {}, [selectedJuzgados]);
  const [tipoDeSalida, setTipoDeSalida] = useState<string>(
    egreso?.tipoDeSalida || ""
  );
  const [modalidad, setModalidad] = useState<string>(egreso?.modalidad || "");
  const [imagen, setImagen] = useState<string | null>(
    egreso?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.imagen}`
      : null
  );

  const [imagenDer, setImagenDer] = useState<string | null>(
    egreso?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    egreso?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    egreso?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    egreso?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    egreso?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    egreso?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    egreso?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    egreso?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    egreso?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    egreso?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    egreso?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    egreso?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    egreso?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    egreso?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    egreso?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    egreso?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    egreso?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    egreso?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    egreso?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    egreso?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/egresos/uploads/${egreso.word1}`
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
    return `/api/egresos/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/egresos/uploads/${pdfPath.split("/").pop()}`;
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
    tipoDeSalida: "Tipo de salida",
  };

  const requiredFields = [
    "establecimiento",
    "fechaHora",
    "clas_seg",
    "modalidad",
    "tipoDeSalida",
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
        tipoDeSalida: data.tipoDeSalida,
        modalidad: data.modalidad,
        noReintSalTra: noReintSalTra ? "Si" : "No",
        reintFueraTerm: reintFueraTerm ? "Si" : "No",
        revArrDom: revArrDom ? "Si" : "No",
        revLibCond: revLibCond ? "Si" : "No",
        revlibAsis: revlibAsis ? "Si" : "No",
        fechaVenc: fechaVenc ? "Si" : "No",
        ordenCapDip: ordenCapDip ? "Si" : "No",
        reingPorRecap: reingPorRecap ? "Si" : "No",
        jurisdiccion: data.jurisdiccion,
        plazo: data.plazo,
        juzgados: selectedJuzgados.join(", "),
        clas_seg: data.clas_seg,
        observacion: data.observacion,
        detalle: data.detalle,
        otrosDatos: data.otrosDatos,
        expediente: data.expediente,
      };

      if (data.fechaHoraVencTime) {
        payload.fechaHoraVencTime = data.fechaHoraVencTime;
      }

      if (data.fechaHoraReintFueTerm) {
        payload.fechaHoraReintFueTerm = data.fechaHoraReintFueTerm;
      }

      if (data.fechaHoraUlOrCap) {
        payload.fechaHoraUlOrCap = data.fechaHoraUlOrCap;
      }

      if (data.fechaHoraReingPorRecap) {
        payload.fechaHoraReingPorRecap = data.fechaHoraReingPorRecap;
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
        response = await updateEgreso(params.id, formData);
        mensajeTitulo = "Actualización de Egreso extramuro";
      } else {
        response = await createEgreso(formData);
        mensajeTitulo = "Creación de Egreso extramuro";
      }

      if (response.success) {
        await ShowEgresos(true, mensajeTitulo, payload);
        router.push("/portal/eventos/egresos");
      } else {
        await ShowEgresos(false, "ERROR", {});
        console.error("Error al enviar el formulario:", response.error);
      }
    } catch (error) {
      await ShowEgresos(false, "ERROR", {});
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
      {/* Componente WatermarkBackground */}
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
          onModuloUrChange={(value) => {
            setSelectedModuloUr(value);
            setValue("modulo_ur", value);
          }}
          onPabellonChange={(value) => {
            setSelectedPabellon(value);
            setValue("pabellon", value);
          }}
        />
        <TipoDeSalida
          value={tipoDeSalida}
          onChange={(value) => {
            setTipoDeSalida(value);
            setValue("tipoDeSalida", value);
          }}
        />
        <Modalidad
          value={modalidad}
          onChange={(value) => {
            setModalidad(value);
            setValue("modalidad", value);
          }}
        />
        <div className="p-4 bg-white rounded-lg shadow-2xl">
          <AtentadoToggle
            id="noReintSalTra"
            value={noReintSalTra}
            onChange={(value) => {
              setNoReintSalTra(value);
              setValue("noReintSalTra", value ? "Si" : "No");
            }}
            label="¿No reintegro de salida transitoria?"
          />
          <InputField
            register={register}
            name="plazo"
            label="Plazo en horas"
            placeholder="Plazo en horas"
          />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <AtentadoToggle
            id="reintFueraTerm"
            value={reintFueraTerm}
            onChange={(value) => {
              setReintFueraTerm(value);
              setValue("reintFueraTerm", value ? "Si" : "No");
            }}
            label="¿Reintegro fuera de término?"
          />
          <FechaHoraReintFueTerm
            value={fechaHoraReintFueTerm}
            onChange={(value: string) => {
              setFechaHoraReintFueTerm(value);
              setValue("fechaHoraReintFueTerm", value);
            }}
          />
        </div>
        <Textarea
          id="detalle"
          value={detalle}
          onChange={(value) => {
            setDetalle(value);
            setValue("detalle", value);
          }}
          label="Detalle:"
          placeholder="Escribe los detalles aquí..."
        />
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <AtentadoToggle
            id="reingPorRecap"
            value={reingPorRecap}
            onChange={(value) => {
              setReingPorRecap(value);
              setValue("reingPorRecap", value ? "Si" : "No");
            }}
            label="Reingreso por recaptura"
          />
          <FechaHoraReingPorRecap
            value={fechaHoraReingPorRecap}
            onChange={(value: string) => {
              setFechaHoraReingPorRecap(value);
              setValue("fechaHoraReingPorRecap", value);
            }}
          />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <AtentadoToggle
            id="revArrDom"
            value={revArrDom}
            onChange={(value) => {
              setRevArrDom(value);
              setValue("revArrDom", value ? "Si" : "No");
            }}
            label="Revocación arresto domiciliario"
          />
          <AtentadoToggle
            id="revLibCond"
            value={revLibCond}
            onChange={(value) => {
              setRevLibCond(value);
              setValue("revLibCond", value ? "Si" : "No");
            }}
            label="Revocación libertado condicional"
          />
          <AtentadoToggle
            id="revlibAsis"
            value={revlibAsis}
            onChange={(value) => {
              setRevlibAsis(value);
              setValue("revlibAsis", value ? "Si" : "No");
            }}
            label="Revocación libertad asistida"
          />
        </div>
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
            onClick={() => router.push("/portal/eventos/egresos")}
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
