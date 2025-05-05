// frontend/src/app/portal/eventos/agresiones/new/AgresionForm.tsx
"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import WatermarkBackground from "@/components/WatermarkBackground";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SelectComp from "@/components/ui/SelectAnidaciones";
import AgresionesSelect from "@/components/ui/selects/AgresionesSelect";
import TipoAgresionSelect from "@/components/ui/selects/TipoAgresionSelect";
import PersonalInvolucrado from "@/components/ui/PersonalInvolucrado";
import InternosInvolucrados from "@/components/ui/InternosInvolucrados";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import Textarea from "@/components/ui/Textarea";
import { InputFieldExpediente } from "@/components/ui/inputs/InputFieldExpediente";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { createAgresion, updateAgresion } from "../agresiones.api";
import { useUserStore } from "@/lib/store";
import { ShowAgresiones, showCancelAlert } from "../../../../utils/alertUtils";
import Toggle from "@/components/ui/Toggle";
import { loadGoogleMaps } from "@/app/utils/googleMapsLoader";
import ClasSegSelect from "@/components/ui/selects/ClasSegSelect";
import { DomicilioMapaModal } from "@/components/ui/DomicilioMapaModal";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
interface FormValues {
  [key: string]: string;
  expediente: string;
  foco_igneo: string;
  reyerta: string;
  interv_requisa: string;
  tipoAgresion: string;
  internosinvolucrado: string;
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

export function AgresionForm({ Agresion }: { Agresion: any }) {
  const {
    handleSubmit,
    setValue,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      establecimiento: Agresion?.establecimiento || "",
      fechaHora: Agresion?.fechaHora || "",
      observacion: Agresion?.observacion || "",
      clas_seg: Agresion?.clas_seg || "",
      sector: Agresion?.sector || "",
      personalinvolucrado: JSON.stringify(Agresion?.personalinvolucrado || []),
      internosinvolucrado: JSON.stringify(Agresion?.internosinvolucrado || []),
      expediente: Agresion?.expediente || "",
      foco_igneo: Agresion?.foco_igneo === "Si" ? "Si" : "No", // Cambiar a cadena
      reyerta: Agresion?.reyerta === "Si" ? "Si" : "No", // Cambiar a cadena
      interv_requisa: Agresion?.interv_requisa === "Si" ? "Si" : "No", // Cambiar a cadena
      tipoAgresion: Agresion?.tipoAgresion || "",
      ubicacionMap: Agresion?.ubicacionMap || "",
      imagen: Agresion?.imagen || "",
      imagenDer: Agresion?.imagenDer || "",
      imagenIz: Agresion?.imagenIz || "",
      imagenDact: Agresion?.imagenDact || "",
      imagenSen1: Agresion?.imagenSen1 || "",
      imagenSen2: Agresion?.imagenSen2 || "",
      imagenSen3: Agresion?.imagenSen3 || "",
      imagenSen4: Agresion?.imagenSen4 || "",
      imagenSen5: Agresion?.imagenSen5 || "",
      imagenSen6: Agresion?.imagenSen6 || "",
      pdf1: Agresion?.pdf1 || "",
      pdf2: Agresion?.pdf2 || "",
      pdf3: Agresion?.pdf3 || "",
      pdf4: Agresion?.pdf4 || "",
      pdf5: Agresion?.pdf5 || "",
      pdf6: Agresion?.pdf6 || "",
      pdf7: Agresion?.pdf7 || "",
      pdf8: Agresion?.pdf8 || "",
      pdf9: Agresion?.pdf9 || "",
      pdf10: Agresion?.pdf10 || "",
      word1: Agresion?.word1 || "",
    },
  });
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fechaHora, setFechaHora] = useState<string>(Agresion?.fechaHora || "");
  const [observacion, setobservacion] = useState<string>(
    Agresion?.observacion || ""
  );
  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(Agresion?.establecimiento || "");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(
    Agresion?.modulo_ur || ""
  );
  const [selectedPabellon, setSelectedPabellon] = useState<string>(
    Agresion?.pabellon || ""
  );
  const [clas_seg, setClas_seg] = useState<string>(Agresion?.clas_seg || "");
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>(() => {
    if (Agresion?.sector) {
      return Agresion.sector
        .split(", ")
        .map((sector: string) => ({ option: sector }));
    }
    return [];
  });
  const [isMapaModalOpen, setIsMapaModalOpen] = useState(false);
  const [ubicacionMap, setUbicacionMap] = useState<string>(
    Agresion?.ubicacionMap || ""
  );
  const [selectedAgentes, setSelectedAgentes] = useState<Agente[]>(() => {
    try {
      if (Agresion?.personalinvolucrado) {
        return JSON.parse(Agresion.personalinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing personalinvolucrado:", error);
    }
    return [];
  });
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (Agresion?.internosinvolucrado) {
        return JSON.parse(Agresion.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });

  const [focoIgneo, setFocoIgneo] = useState<boolean>(
    Agresion?.foco_igneo === "Si"
  );
  const [reyerta, setReyerta] = useState<boolean>(Agresion?.reyerta === "Si");
  const [intervRequisa, setIntervRequisa] = useState<boolean>(
    Agresion?.interv_requisa === "Si"
  );
  const [tipoAgresion, setTipoAgresion] = useState<string>(
    Agresion?.tipoAgresion || ""
  );
  const [imagen, setImagen] = useState<string | null>(
    Agresion?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.imagen}`
      : null
  );
  const [imagenDer, setImagenDer] = useState<string | null>(
    Agresion?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    Agresion?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    Agresion?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    Agresion?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    Agresion?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    Agresion?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    Agresion?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    Agresion?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    Agresion?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    Agresion?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    Agresion?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    Agresion?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    Agresion?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    Agresion?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    Agresion?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    Agresion?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    Agresion?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    Agresion?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    Agresion?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    Agresion?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/agresiones/uploads/${Agresion.word1}`
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
    return `/api/agresiones/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/agresiones/uploads/${pdfPath.split("/").pop()}`;
  };

  const [isWordOpen, setIsWordOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (apiKey) {
      loadGoogleMaps(apiKey)
        .then((google) => {
          setGoogleLoaded(true);
        })
        .catch((error) => {
          console.error("Error loading Google Maps:", error);
        });
    } else {
      console.error("Google Maps API key is missing");
    }
  }, []);

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
    sector: "Sector",
  };
  

  const requiredFields = ["establecimiento", "fechaHora", "clas_seg", "sector"];
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
        establecimiento: data.establecimiento,
        modulo_ur: selectedModuloUr,
        pabellon: selectedPabellon,
        sector: selectedSectors.map((s) => s.option).join(", "),
        fechaHora: data.fechaHora || null,
        observacion: data.observacion,
        personalinvolucrado: JSON.stringify(selectedAgentes),
        internosinvolucrado: JSON.stringify(selectedInternos),
        expediente: data.expediente,
        foco_igneo: focoIgneo ? "Si" : "No",
        reyerta: reyerta ? "Si" : "No",
        interv_requisa: intervRequisa ? "Si" : "No",
        clas_seg: data.clas_seg,
        tipoAgresion: tipoAgresion,
        email: user?.email,
        ubicacionMap: data.ubicacionMap,
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
        response = await updateAgresion(params.id, formData);
      } else {
        response = await createAgresion(formData);
      }

      if (response.success) {
        await ShowAgresiones(
          response.success,
          params?.id ? "Datos Actualizados" : "Datos Creados",
          {
            ...data,
            modulo_ur: selectedModuloUr,
            pabellon: selectedPabellon,
            foco_igneo: focoIgneo ? "Si" : "No",
            reyerta: reyerta ? "Si" : "No",
            interv_requisa: intervRequisa ? "Si" : "No",
          }
        );
        router.push("/portal/eventos/agresiones");
      } else {
        console.error("Error al crear o actualizar agresión:", response.error);
        ShowAgresiones(false, "Error", {
          ...data,
          modulo_ur: selectedModuloUr,
          pabellon: selectedPabellon,
          foco_igneo: focoIgneo ? "Si" : "No",
          reyerta: reyerta ? "Si" : "No",
          interv_requisa: intervRequisa ? "Si" : "No",
        });
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      ShowAgresiones(false, "Error", {
        ...data,
        modulo_ur: selectedModuloUr,
        pabellon: selectedPabellon,
        foco_igneo: focoIgneo ? "Si" : "No",
        reyerta: reyerta ? "Si" : "No",
        interv_requisa: intervRequisa ? "Si" : "No",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const goToAgresiones = () => {
    router.push("/portal/eventos/agresiones");
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
            setValue("clas_seg", value, { shouldValidate: true }); // Valida el campo al cambiar el valor
          }}
        />
        {/* Mensaje de error si el campo clas_seg no es válido */}
        {errors.clas_seg && (
          <p className="text-red-500 text-sm">
            El campo Clasificación de Seguridad es obligatorio.
          </p>
        )}
        <FechaHoraEvento
          value={fechaHora}
          onChange={(value: string) => {
            setFechaHora(value);
            setValue("fechaHora", value);
          }}
        />
        {errors.fechaHora && (
          <p className="text-red-500 text-sm">
            El campo fecha y hora es obligatorio.
          </p>
        )}
        <SelectComp
          initialEstablecimiento={selectedEstablecimiento}
          initialModuloUr={selectedModuloUr}
          initialPabellon={selectedPabellon}
          onEstablecimientoChange={(value) => {
            setSelectedEstablecimiento(value);
            setValue("establecimiento", value, { shouldValidate: true }); // Valida el campo al cambiar el valor
          }}
          onModuloUrChange={(value) => setSelectedModuloUr(value)}
          onPabellonChange={(value) => setSelectedPabellon(value)}
        />
        {/* Mensaje de error si el campo establecimiento no es válido */}
        {errors.establecimiento && (
          <p className="text-red-500 text-sm">
            El campo establecimiento es obligatorio.
          </p>
        )}
        <AgresionesSelect
          initialSectors={selectedSectors}
          onSelect={(value) => {
            setSelectedSectors(value);
            setValue("sector", value.map((s) => s.option).join(", "), {
              shouldValidate: true,
            }); // Valida el campo al cambiar el valor
          }}
        />
        {/* Mensaje de error si el campo sector no es válido */}
        {errors.sector && (
          <p className="text-red-500 text-sm">
            El campo sector es obligatorio.
          </p>
        )}
        <TipoAgresionSelect
          initialTipoAgresion={tipoAgresion}
          onSelect={(value) => {
            setTipoAgresion(value);
            setValue("tipoAgresion", value);
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
        <Button
          type="button"
          onClick={() => setIsMapaModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Mapa de calor
        </Button>
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
          <Button type="button" onClick={goToAgresiones} className="bg-orange-500">
            Volver
          </Button>
          <Button
            type="submit"
            className="bg-blue-500"
            disabled={isSubmitting} // Deshabilitar el botón si está enviando
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
      <DomicilioMapaModal
        isOpen={isMapaModalOpen}
        onClose={() => setIsMapaModalOpen(false)}
        ubicacionMap={ubicacionMap}
        setUbicacionMap={(value) => {
          setUbicacionMap(value);
          setValue("ubicacionMap", value); // Asegúrate de actualizar el valor en el formulario
        }}
      />
    </form>
  );
}
