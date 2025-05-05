//frontend\src\app\portal\eventos\preingresos\new\PreingresoForm.tsx
"use client";
import { Button } from "@/components/ui/button";

import { validateRequiredFields, validateEmptyFields, validateFieldFormats } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import Textarea from "@/components/ui/Textarea";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createPreingreso, updatePreingreso } from "../Preingresos.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import SelectProcedencia from "@/components/ui/SelectProcedencia";
import FechaDePreingreso from "@/components/ui/FechaDePreingreso";
import { Edad } from "@/components/ui/edad";
import SelectTipoDoc from "@/components/ui/SelectTipoDoc";
import ClasificacionSelect from "@/components/ui/selects/ClasificacionSelect";
import { InputField } from "@/components/ui/InputField";
import FechaDeNacimiento from "@/components/ui/FechaDeNacimiento";
import SelectNacionalidad from "@/components/ui/Nacionalidad";
import { DomiciliosModal } from "@/components/ui/DomiciliosModal";
import { DomicilioMapaModal } from "@/components/ui/DomicilioMapaModal";
import { JuzgadoSelector } from "@/components/ui/JuzgadoSelector";
import { ElectrodomesticoSelector } from "@/components/ui/ElectrodomesticosSelector"; // Importa el componente
import { CausasModal } from "@/components/ui/CausasModal";
import { ShowPreingresos, showCancelAlert } from "../../../../utils/alertUtils"; // Importa las funciones
import SelectOrgCrim from "@/components/ui/SelectOrgCrim";
import generatePDF from "../../../../utils/PreAlertaPdf"; // Importa el componente PDF
import { useUserStore } from "@/lib/store"; // Importar el store de Zustand
import { loadGoogleMaps } from "@/app/utils/googleMapsLoader"; // Importa el loader
import PhotosModalPreing from "@/components/ui/MultimediaModals/PhotosModalPreing";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import InternosInvolucradosSimple from "@/components/ui/InternosInvolucradosSimpleReing";
interface Domicilio {
  domicilio: string;
  establecimiento?: string;
}
interface Juzgado {
  Juzgado: string;
}
interface Electrodomestico {
  Electrodomestico: string;
  Norma: string;
  titulo: number;
  capitulo: number;
  articulo: number;
  inciso: number;
  apartado: number;
  Otros: number;
  "Tipo de Electrodomestico": string;
  DetalleUser?: string;
}
interface Interno {
  nombreApellido: string;
  alias: string;
  lpu: string;
  lpuProv: string;
  sitProc: string;
  detalle: string;
}
interface FormValues {
  [key: string]: string;
}

interface Causa {
  num_causa: string;
}

export function PreingresoForm({ preingreso }: { preingreso: any }) {
  const { handleSubmit, setValue, register, watch } = useForm<FormValues>({
    defaultValues: {
      apellido: preingreso?.apellido || "",
      nombres: preingreso?.nombres || "",
      alias: preingreso?.alias || "",
      tipoDoc: preingreso?.tipoDoc || "",
      clasificacion: preingreso?.clasificacion || "",
      numeroDni: preingreso?.numeroDni || "",
      fechaPreingreso: preingreso?.fechaHoraIng || "", // Asegúrate de usar el mismo nombre de campo
      fechaNacimiento: preingreso?.fechaNacimiento || "",
      edad: preingreso?.edad_ing || "", // Asegúrate de usar el mismo nombre de campo
      observacion: preingreso?.observacion || "",
      reingreso: preingreso?.reingreso || "",
      circDet: preingreso?.circDet || "",
      org_judicial: preingreso?.org_judicial || "",
      reg_suv: preingreso?.reg_suv || "",
      reg_cir: preingreso?.reg_cir || "",
      nacionalidad: preingreso?.nacionalidad,
      ubicacionMap: preingreso?.ubicacionMap || "",
      num_causa: preingreso?.numeroCausa || "", // Asegúrate de usar el mismo nombre de campo
      establecimiento: preingreso?.establecimiento || "",
      domicilios: preingreso?.domicilios || "", // Asegúrate de usar el mismo nombre de campo
      juzgados: preingreso?.juzgados || "", // Asegúrate de usar el mismo nombre de campo
      numeroCausa: preingreso?.numeroCausa || "", // Asegúrate de usar el mismo nombre de campo
      electrodomesticos: preingreso?.electrodomesticos || [],
      internosinvolucradoSimple: JSON.stringify(
        preingreso?.internosinvolucradoSimple || []
      ),
      resumen: preingreso?.resumen || "",
      link: preingreso?.link || "",
      orgCrim: preingreso?.orgCrim || "",
      cualorg: preingreso?.cualorg || "",
      imagen: preingreso?.imagen || "",
      imagenDer: preingreso?.imagenDer || "",
      imagenIz: preingreso?.imagenIz || "",
      imagenDact: preingreso?.imagenDact || "",
      imagenSen1: preingreso?.imagenSen1 || "",
      imagenSen2: preingreso?.imagenSen2 || "",
      imagenSen3: preingreso?.imagenSen3 || "",
      imagenSen4: preingreso?.imagenSen4 || "",
      imagenSen5: preingreso?.imagenSen5 || "",
      imagenSen6: preingreso?.imagenSen6 || "",
      pdf1: preingreso?.pdf1 || "",
      pdf2: preingreso?.pdf2 || "",
      pdf3: preingreso?.pdf3 || "",
      pdf4: preingreso?.pdf4 || "",
      pdf5: preingreso?.pdf5 || "",
      pdf6: preingreso?.pdf6 || "",
      pdf7: preingreso?.pdf7 || "",
      pdf8: preingreso?.pdf8 || "",
      pdf9: preingreso?.pdf9 || "",
      pdf10: preingreso?.pdf10 || "",
      word1: preingreso?.word1 || "",
    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orgCrim, setOrgCrim] = useState<string>(preingreso?.orgCrim || "");
  const [cualorg, setCualorg] = useState<string>(preingreso?.cualorg || "");
  const [estadoCivil, setEstadoCivil] = useState<string>(
    preingreso?.estadoCivil || ""
  );

  const [observacion, setobservacion] = useState<string>(
    preingreso?.observacion || ""
  );
  const [reingreso, setreingreso] = useState<string>(
    preingreso?.reingreso || ""
  );

  const [cirDet, setcirDet] = useState<string>(preingreso?.cirDet || "");
  const [org_judicial, setorg_judicial] = useState<string>(
    preingreso?.org_judicial || ""
  );
  const [reg_suv, setReg_suv] = useState<string>(preingreso?.reg_suv || "");
  const [reg_cir, setReg_cir] = useState<string>(preingreso?.reg_cir || "");
  const [link, setlink] = useState<string>(preingreso?.link || "");
  const [resumen, setResumen] = useState<string>(preingreso?.resumen || "");
  const [procedencia, setProcedencia] = useState<string>(
    preingreso?.procedencia || ""
  );
  const [nacionalidad, setNacionalidad] = useState<string>(
    preingreso?.nacionalidad || ""
  );
  const [ubicacionMap, setUbicacionMap] = useState<string>(
    preingreso?.ubicacionMap || ""
  );
  const [imagen, setImagen] = useState<string | null>(
    preingreso?.imagen || null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapaModalOpen, setIsMapaModalOpen] = useState(false);
  const [fechaPreingreso, setFechaPreingreso] = useState<string>(
    preingreso?.fechaHoraIng || ""
  );
  const [fechaNacimiento, setFechaNacimiento] = useState<string>(
    preingreso?.fechaNacimiento || ""
  );
  const [domicilios, setDomicilios] = useState<Domicilio[]>(() => {
    if (preingreso?.domicilios) {
      return preingreso.domicilios
        .split(", ")
        .map((domicilio: string) => ({ domicilio }));
    }
    return [];
  });
  const [isDomiciliosModalOpen, setIsDomiciliosModalOpen] = useState(false);
  const [selectedJuzgados, setSelectedJuzgados] = useState<string[]>(() => {
    if (preingreso?.juzgados) {
      return preingreso.juzgados.split(", ");
    }
    return [];
  });
  const [selectedElectrodomesticos, setSelectedElectrodomesticos] = useState<
    Electrodomestico[]
  >([]);
  const [selectedCausas, setSelectedCausas] = useState<Causa[]>(
    preingreso?.numeroCausa ? [{ num_causa: preingreso.numeroCausa }] : []
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    preingreso?.establecimiento || ""
  );

  const [tipoDoc, setTipoDoc] = useState<string>(preingreso?.tipoDoc || "");
  const [clasificacion, setClasificacion] = useState<string>(
    preingreso?.clasificacion || ""
  );
  useEffect(() => {}, [selectedJuzgados]);
  useEffect(() => {}, [selectedJuzgados]);

  const [imagenDer, setImagenDer] = useState<string | null>(
    preingreso?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    preingreso?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    preingreso?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    preingreso?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    preingreso?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    preingreso?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    preingreso?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    preingreso?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    preingreso?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    preingreso?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    preingreso?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    preingreso?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    preingreso?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    preingreso?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    preingreso?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    preingreso?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    preingreso?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    preingreso?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    preingreso?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    preingreso?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/preingresos/uploads/${preingreso.word1}`
      : null
  );
  const [selectedInternosSimple, setSelectedInternosSimple] = useState<
    Interno[]
  >(() => {
    try {
      if (preingreso?.internosinvolucradoSimple) {
        return JSON.parse(preingreso.internosinvolucradoSimple);
      }
    } catch (error) {}
    return [];
  });

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
    return `/api/preingresos/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/preingresos/uploads/${pdfPath.split("/").pop()}`;
  };

  const [isWordOpen, setIsWordOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [googleLoaded, setGoogleLoaded] = useState(false);
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching Google Maps API key:", error);
      }
    };

    fetchApiKey();
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
    apellido: "Apellido",
    nombres: "Nombres",
  };

  const requiredFields = [
    "establecimiento",
    "apellido",
    "nombres",
  ];
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const missingFields = validateRequiredFields(data, requiredFields, fieldLabels);
    const emptyFields = validateEmptyFields(data, fieldLabels, excludedFields);
  
     
    const formatErrors = validateFieldFormats(data);
  
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
  
    if (formatErrors.length > 0) {
      Alert.error({
        title: "Error de formato",
        text: formatErrors.join("\n"),
      });
      return;
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

      const domiciliosString = domicilios.map((d) => d.domicilio).join(", ");
      const juzgadosString = selectedJuzgados.join(", ");
      const electrodomesticosString = selectedElectrodomesticos
        .map(
          (electrodomestico) =>
            `${electrodomestico.Electrodomestico} (${
              electrodomestico.Norma
            }) - Tipo: ${
              electrodomestico["Tipo de Electrodomestico"]
            } - Detalle: ${electrodomestico.DetalleUser || ""}`
        )
        .join(", ");
      const numeroCausa = selectedCausas
        .map((causa) => causa.num_causa)
        .join(", ");

      const payload: any = {
        apellido: data.apellido,
        nombres: data.nombres,
        alias: data.alias,
        tipoDoc: data.tipoDoc,
        clasificacion: data.clasificacion,
        numeroDni: data.numeroDni,
        internosinvolucradoSimple: JSON.stringify(selectedInternosSimple),
        fechaNacimiento: data.fechaNacimiento,
        edad_ing: data.edad,
        procedencia: data.procedencia,
        establecimiento: data.establecimiento,
        fechaHoraIng: data.fechaPreingreso,
        nacionalidad: data.nacionalidad,
        domicilios: domiciliosString,
        ubicacionMap: data.ubicacionMap,
        juzgados: juzgadosString,
        numeroCausa: numeroCausa,
        electrodomesticos: electrodomesticosString,
        orgCrim: data.orgCrim,
        cualorg: data.cualorg,
        observacion: data.observacion,
        reingreso: data.reingreso,
        cirDet: data.cirDet,
        org_judicial: data.org_judicial,
        reg_cir: data.reg_cir,
        reg_suv: data.reg_suv,
        resumen: data.resumen,
        link: data.link,
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
        response = await updatePreingreso(params.id, formData);
      } else {
        response = await createPreingreso(formData);
      }

      const mensajeTitulo = params.id
        ? "Actualización de Preingreso"
        : "Creación de Preingreso";

      if (response.success) {
        await ShowPreingresos(response.success, mensajeTitulo, {
          ...data,
          fechaPreingreso: data.fechaPreingreso,
          procedencia: data.procedencia,
          domicilios: domiciliosString,
          ubicacionMap: data.ubicacionMap,
          numeroCausa: numeroCausa,
          juzgados: juzgadosString,
          electrodomesticos: electrodomesticosString,
          observacion: data.observacion,
          reingreso: data.reingreso,
          cirDet: data.cirDet,
          org_judicial: data.org_judicial,
          reg_suv: data.reg_suv,
          reg_cir: data.reg_cir,
          link: data.link,
        });


        generatePDF(payload, imagen);
        router.push("/portal/eventos/preingresos");
      } else {
        console.error(
          "Error al crear o actualizar preingreso:",
          response.error
        );
        await ShowPreingresos(false, "Error", payload);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      await ShowPreingresos(false, "Error", {});
    } finally {
      setIsSubmitting(false); // Desbloquear el botón al finalizar
    }
  };

  const goToPreingresos = () => {
    router.push("/portal/eventos/preingresos");
  };

  const handleAddDomicilio = (domicilio: Domicilio) => {
    setDomicilios([...domicilios, domicilio]);
  };

  const handleRemoveDomicilio = (index: number) => {
    const newDomicilios = domicilios.filter((_, i) => i !== index);
    setDomicilios(newDomicilios);
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
        <PhotosModalPreing
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

        <ClasificacionSelect
          value={clasificacion}
          onChange={(value) => {
            setClasificacion(value);
            setValue("clasificacion", value);
          }}
        />
        <FechaDePreingreso
          value={fechaPreingreso}
          onChange={(value: string) => {
            setFechaPreingreso(value);
            setValue("fechaPreingreso", value);
          }}
        />
        <FechaDeNacimiento
          value={fechaNacimiento}
          onChange={(value: string) => {
            setFechaNacimiento(value);
            setValue("fechaNacimiento", value);
          }}
        />
        <Edad
          fechaNacimiento={fechaNacimiento}
          onChange={(edad) => setValue("edad", edad.toString())}
        />
        <InputField
          register={register}
          name="apellido"
          label="Apellido"
          placeholder=""
        />
        <InputField register={register} name="nombres" label="Nombres" />
        <InputField register={register} name="alias" label="Alias" />
        <SelectTipoDoc
          value={tipoDoc}
          onChange={(value) => {
            setTipoDoc(value);
            setValue("tipoDoc", value);
          }}
        />
        <InputField register={register} name="numeroDni" label="Número Doc." />

        <SelectNacionalidad
          value={nacionalidad}
          onChange={(value) => {
            setNacionalidad(value);
            setValue("nacionalidad", value);
          }}
        />
        <InternosInvolucradosSimple
          initialInternos={selectedInternosSimple}
          onSelect={(value) => {
            setSelectedInternosSimple(value);
            setValue("internosinvolucradoSimple", JSON.stringify(value));
          }}
        />
        <JuzgadoSelector
          initialJuzgados={selectedJuzgados}
          onSelect={(selectedJuzgados) => {
            setSelectedJuzgados(selectedJuzgados);
            setValue("juzgados", selectedJuzgados.join(", "));
          }}
        />
        <CausasModal
          initialCausas={selectedCausas}
          onSelect={(selectedCausas) => {
            setSelectedCausas(selectedCausas);
            setValue(
              "numeroCausa",
              selectedCausas.map((causa) => causa.num_causa).join(", ")
            );
          }}
        />
        <ElectrodomesticoSelector
          initialElectrodomesticos={preingreso?.electrodomesticos || ""}
          onSelect={(selectedElectrodomesticos: Electrodomestico[]) => {
            setSelectedElectrodomesticos(selectedElectrodomesticos);
          }}
        />

        {!params.id && <></>}
        <Button
          type="button"
          onClick={() => setIsDomiciliosModalOpen(true)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Cargar domicilios
        </Button>
        <Button
          type="button"
          onClick={() => setIsMapaModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Mapa de calor
        </Button>
        <SelectOrgCrim
          orgCrim={orgCrim}
          cualorg={cualorg}
          onChange={(orgCrim, cualorg) => {
            setOrgCrim(orgCrim);
            setCualorg(cualorg);
            setValue("orgCrim", orgCrim);
            setValue("cualorg", cualorg);
          }}
        />
        <SelectProcedencia
          value={procedencia}
          onChange={(value) => {
            setProcedencia(value);
            setValue("procedencia", value);
          }}
        />
        <Select
          label="Seleccione Establecimiento"
          selectedValue={selectedCountry}
          onChange={(value) => {
            setSelectedCountry(value);
            setValue("establecimiento", value);
          }}
          jsonUrl="/data/json/alojs.json"
        />
        <Textarea
          id="cirDet"
          value={cirDet}
          onChange={(value) => {
            setcirDet(value);
            setValue("cirDet", value);
          }}
          label="Circunstancias de detención"
          placeholder="Escribe la Circunstancias de detención aquí..."
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
        <Textarea
          id="resumen"
          value={resumen}
          onChange={(value) => {
            setResumen(value);
            setValue("resumen", value);
          }}
          label="Resumen"
          placeholder="Escribe el resumen aquí..."
        />
        <Textarea
          id="link"
          value={link}
          onChange={(value) => {
            setlink(value);
            setValue("link", value);
          }}
          label="Link"
          placeholder="Escribe Link de información pública aquí..."
        />
        <Textarea
          id="org_judicial"
          value={org_judicial}
          onChange={(value) => {
            setorg_judicial(value);
            setValue("org_judicial", value);
          }}
          label="Órgano Judicial"
          placeholder="Escribe Órgano Judicial aquí..."
        />

        <Textarea
          id="reg_suv"
          value={reg_suv}
          onChange={(value) => {
            setReg_suv(value);
            setValue("reg_suv", value);
          }}
          label="REGISTRO S.U.V."
          placeholder="Escribe REGISTRO S.U.V. aquí..."
        />

        <Textarea
          id="reg_cir"
          value={reg_cir}
          onChange={(value) => {
            setReg_cir(value);
            setValue("reg_cir", value);
          }}
          label="REGISTRO C.I.R.:"
          placeholder="Escribe REGISTRO C.I.R. aquí..."
        />
        <Textarea
          id="cirDet"
          value={cirDet}
          onChange={(value) => {
            setcirDet(value);
            setValue("cirDet", value);
          }}
          label="Detalle C.I.R.:"
          placeholder="Escribe Detalle C.I.R. aquí..."
        />
        <div className="flex space-x-4">
          <Button
            type="button"
            onClick={goToPreingresos}
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
      <DomiciliosModal
        isOpen={isDomiciliosModalOpen}
        onClose={() => setIsDomiciliosModalOpen(false)}
        domicilios={domicilios}
        onAddDomicilio={handleAddDomicilio}
        onRemoveDomicilio={handleRemoveDomicilio}
      />
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
