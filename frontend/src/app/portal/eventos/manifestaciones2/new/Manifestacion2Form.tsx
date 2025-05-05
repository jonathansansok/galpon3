// frontend/src/app/portal/eventos/manifestaciones2/new/Manifestacion2Form.tsx
"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import WatermarkBackground from "@/components/WatermarkBackground";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SelectComp from "@/components/ui/SelectAnidaciones2";
import SectorSelect2 from "@/components/ui/SectorSelect2";
import PersonalInvolucrado from "@/components/ui/PersonalInvolucrado";
import InternosInvolucrados from "@/components/ui/InternosInvolucrados";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import Textarea from "@/components/ui/Textarea";
import { InputFieldExpediente } from "@/components/ui/inputs/InputFieldExpediente";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { createManifestacion2, updateManifestacion2 } from "../manifestaciones2.api";
import { useUserStore } from "@/lib/store";
import { showManifestacion2, showCancelAlert } from "../../../../utils/alertUtils";
import Toggle from "@/components/ui/Toggle";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";
interface FormValues {
  [key: string]: string;
  expediente: string; 
  foco_igneo: string; 
  reyerta: string; 
  interv_requisa: string; 
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

export function Manifestacion2Form({ manifestacion2 }: { manifestacion2: any }) {
  const { handleSubmit, setValue, register, watch} = useForm<FormValues>({
    defaultValues: {
      establecimiento: manifestacion2?.establecimiento || "",
      fechaHora: manifestacion2?.fechaHora || "",
      observacion: manifestacion2?.observacion || "",
      sector: manifestacion2?.sector || "",
      personalinvolucrado: JSON.stringify(manifestacion2?.personalinvolucrado || []),
      internosinvolucrado: JSON.stringify(manifestacion2?.internosinvolucrado || []),
      expediente: manifestacion2?.expediente || "", // Añadir el valor predeterminado para expediente
      foco_igneo: manifestacion2?.foco_igneo === "Si" ? "Si" : "No", // Cambiar a cadena
      reyerta: manifestacion2?.reyerta === "Si" ? "Si" : "No", // Cambiar a cadena
      clas_seg: manifestacion2?.clas_seg || "",
      interv_requisa: manifestacion2?.interv_requisa === "Si" ? "Si" : "No", // Cambiar a cadena
      imagen: manifestacion2?.imagen || "",
      imagenDer: manifestacion2?.imagenDer || "",
      imagenIz: manifestacion2?.imagenIz || "",
      imagenDact: manifestacion2?.imagenDact || "",
      imagenSen1: manifestacion2?.imagenSen1 || "",
      imagenSen2: manifestacion2?.imagenSen2 || "",
      imagenSen3: manifestacion2?.imagenSen3 || "",
      imagenSen4: manifestacion2?.imagenSen4 || "",
      imagenSen5: manifestacion2?.imagenSen5 || "",
      imagenSen6: manifestacion2?.imagenSen6 || "",
      pdf1: manifestacion2?.pdf1 || "",
      pdf2: manifestacion2?.pdf2 || "",
      pdf3: manifestacion2?.pdf3 || "",
      pdf4: manifestacion2?.pdf4 || "",
      pdf5: manifestacion2?.pdf5 || "",
      pdf6: manifestacion2?.pdf6 || "",
      pdf7: manifestacion2?.pdf7 || "",
      pdf8: manifestacion2?.pdf8 || "",
      pdf9: manifestacion2?.pdf9 || "",
      pdf10: manifestacion2?.pdf10 || "",
      word1: manifestacion2?.word1 || "",
    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [fechaHora, setFechaHora] = useState<string>(
    manifestacion2?.fechaHora || ""
  );
  const [observacion, setobservacion] = useState<string>(
    manifestacion2?.observacion || ""
  );
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState<string>(
    manifestacion2?.establecimiento || ""
  );
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(
    manifestacion2?.modulo_ur || ""
  );

  const [selectedSectors, setSelectedSectors] = useState<Sector[]>(() => {
    if (manifestacion2?.sector) {
      return manifestacion2.sector.split(", ").map((sector: string) => ({ option: sector }));
    }
    return [];
  });
  const [selectedAgentes, setSelectedAgentes] = useState<Agente[]>(() => {
    try {
      if (manifestacion2?.personalinvolucrado) {
        return JSON.parse(manifestacion2.personalinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing personalinvolucrado:", error);
    }
    return [];
  });
  const [clas_seg, setClas_seg] = useState<string>(
    manifestacion2?.clas_seg || ""
  );
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (manifestacion2?.internosinvolucrado) {
        return JSON.parse(manifestacion2.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });

  const [focoIgneo, setFocoIgneo] = useState<boolean>(
    manifestacion2?.foco_igneo === "Si"
  );
  const [reyerta, setReyerta] = useState<boolean>(
    manifestacion2?.reyerta === "Si"
  );
  const [intervRequisa, setIntervRequisa] = useState<boolean>(
    manifestacion2?.interv_requisa === "Si"
  );
  const [imagen, setImagen] = useState<string | null>(
    manifestacion2?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.imagen}`
      : null
  );
  
  const [imagenDer, setImagenDer] = useState<string | null>(
    manifestacion2?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    manifestacion2?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    manifestacion2?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    manifestacion2?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    manifestacion2?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    manifestacion2?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    manifestacion2?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    manifestacion2?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    manifestacion2?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    manifestacion2?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    manifestacion2?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    manifestacion2?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    manifestacion2?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    manifestacion2?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    manifestacion2?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    manifestacion2?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    manifestacion2?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    manifestacion2?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    manifestacion2?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    manifestacion2?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/manifestaciones2/uploads/${manifestacion2.word1}`
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
    return `/api/manifestaciones2/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/manifestaciones2/uploads/${pdfPath.split("/").pop()}`;
  };
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isWordOpen, setIsWordOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.email) {
          setUser({ name: data.name, email: data.email });
        } else {
          router.push("/api/auth/login");
        }
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
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
        sector: selectedSectors.map((s) => s.option).join(", "),
        fechaHora: data.fechaHora || null,
        observacion: data.observacion || null, // Permitir que sea null si está vacío
        personalinvolucrado: JSON.stringify(selectedAgentes || []),
        internosinvolucrado: JSON.stringify(selectedInternos || []),
        expediente: data.expediente,
        foco_igneo: focoIgneo ? "Si" : "No", // Enviar como cadena
        reyerta: reyerta ? "Si" : "No", // Enviar como cadena
        interv_requisa: intervRequisa ? "Si" : "No", // Enviar como cadena
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
        response = await updateManifestacion2(params.id, formData);
      } else {
        response = await createManifestacion2(formData);
      }
  
      const mensajeTitulo = params.id ? "Actualización de Alteración al orden en sector común" : "Creación de Alteración al orden en sector común";
  
      if (response.success) {
        await showManifestacion2(response.success, mensajeTitulo, payload);
        router.push("/portal/eventos/manifestaciones2");
      } else {
        console.error("Error al crear o actualizar manifestación:", response.error);
        await showManifestacion2(false, "Error", payload);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      await showManifestacion2(false, "Error", {});
    } finally {
      setIsSubmitting(false); // Desbloquear el botón al finalizar
    }
  };
  const goToManifestaciones2 = () => {
    router.push("/portal/eventos/manifestaciones2");
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
         
          onEstablecimientoChange={(value) => {
            setSelectedEstablecimiento(value);
            setValue("establecimiento", value);
          }}
          onModuloUrChange={(value) => setSelectedModuloUr(value)}
        />
        <SectorSelect2
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
        <InputFieldExpediente
          register={register}
          label="Expediente"
        />
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
          <Button type="button" onClick={goToManifestaciones2} className="bg-orange-500">
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