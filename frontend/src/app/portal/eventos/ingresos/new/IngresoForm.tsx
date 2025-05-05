//frontend\src\app\portal\eventos\ingresos\new\IngresoForm.tsx
"use client";
import { handleLpuBlur } from "./handleLpuBlur"; 
import { Button } from "@/components/ui/button";
import SelectTipoDocConNacionalidad from "@/components/ui/SelectTipoDoc2";
import {
  validateRequiredFields,
  validateEmptyFields,
  validateFieldFormats
} from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import HistorialEgresos from "@/components/ui/historialegreso/HistorialEgresos";
import PhotosModal from "@/components/ui/MultimediaModals/PhotosModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import SelectComp from "@/components/ui/SelectAnidaciones";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createIngreso, updateIngreso } from "../ingresos.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import SelectProcedencia from "@/components/ui/SelectProcedencia";
import FechaDeIngreso from "@/components/ui/FechaDeIngreso";
import { Edad } from "@/components/ui/edad";
import SelectUnidadDeIngreso from "@/components/ui/SelectUnidadDeIngreso";
import SelectCondicion from "@/components/ui/Condicion";
import { InputField } from "@/components/ui/InputField";
import FechaDeNacimiento from "@/components/ui/FechaDeNacimiento";
import SelectNacionalidad from "@/components/ui/Nacionalidad";
import SelectProvincia from "@/components/ui/SelectProvincia";
import { DomiciliosModal } from "@/components/ui/DomiciliosModal";
import { DomicilioMapaModal } from "@/components/ui/DomicilioMapaModal";
import { JuzgadoSelector } from "@/components/ui/JuzgadoSelector";
import { ElectrodomesticoSelector } from "@/components/ui/ElectrodomesticosSelector";
import { PatologiaSelector } from "@/components/ui/PatologiasSelector";
import { HeridasSelector } from "@/components/ui/HeridasSelector";
import { TatuajesSelector } from "@/components/ui/TatuajesSelector";
import { PerfilesSelector } from "@/components/ui/PerfilesSelector";
import ToggleAlerta from "@/components/ui/ToggleAlerta";
import { CausasModal } from "@/components/ui/CausasModal";
import SelectSituacionProcesal from "@/components/ui/sitProc";
import { showAlert, showCancelAlert } from "../../../../utils/alertUtils";
import SelectSexo from "@/components/ui/SelectSexo";
import SelectSubGrupo from "@/components/ui/SelectSubgrupo";
import SelectSexualidad from "@/components/ui/SelectSexualidad";
import SelectEstadoCivil from "@/components/ui/SelectEstadoCivil";
import SelectOrgCrim from "@/components/ui/SelectOrgCrim";
import generatePDF from "../../../../utils/pdf2";
import { useUserStore } from "@/lib/store";
import Reingresos from "@/components/ui/Reingresos";
import { loadGoogleMaps } from "@/app/utils/googleMapsLoader";
import HistorialAlojamientos from "@/app/portal/eventos/ingresos/ingresoscomponentes/HistorialAlojamientos";
import Modal from "@/components/ui/Modal";
interface Domicilio {
  domicilio: string;
  establecimiento?: string;
}
interface Juzgado {
  Juzgado: string;
}

interface Interno {
  alias: string;
  lpu: string | number;
  lpuProv: string;
  sitProc: string;
  detalle: string;
  establecimiento: string;
  apellido: string;
  nombres: string;
  sexo: string;
  perfil: string;
  profesion: string;
  fechaNacimiento: string;
  sexualidad: string;
  fechaHoraIng: string;
  nacionalidad: string;
  tipoDoc: string;
  numeroDni: string | number;
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

interface Patologia {
  level: number;
  code: string;
  description: string;
  code_2: string;
  code_0: string;
  code_1: string;
  detalles?: string;
}

interface Herida {
  zona: string;
  type: string;
  detail: string;
}

interface Tatuaje {
  zona: string;
  details: string[];
}

interface FormValues {
  [key: string]: string;
}

interface Perfil {
  option: string;
}

interface Causa {
  num_causa: string;
}

export function IngresoForm({ ingreso }: { ingreso: any }) {
  const { handleSubmit, setValue, register, watch } = useForm<FormValues>({
    defaultValues: {
      establecimiento: ingreso?.establecimiento || "",
      modulo_ur: ingreso?.modulo_ur || "",
      pabellon: ingreso?.pabellon || "",
      apellido: ingreso?.apellido || "",
      nombres: ingreso?.nombres || "",
      alias: ingreso?.alias || "",
      tipoDoc: ingreso?.tipoDoc || "",
      docNacionalidad: ingreso?.docNacionalidad || "",
      numeroDni: ingreso?.numeroDni || "",
      lpu: ingreso?.lpu || "",
      lpuProv: ingreso?.lpuProv || "",
      unidadDeIngreso: ingreso?.unidadDeIngreso || "",
      imagen: ingreso?.imagen || "",
      imagenDer: ingreso?.imagenDer || "",
      imagenIz: ingreso?.imagenIz || "",
      imagenDact: ingreso?.imagenDact || "",
      imagenSen1: ingreso?.imagenSen1 || "",
      imagenSen2: ingreso?.imagenSen2 || "",
      imagenSen3: ingreso?.imagenSen3 || "",
      imagenSen4: ingreso?.imagenSen4 || "",
      imagenSen5: ingreso?.imagenSen5 || "",
      imagenSen6: ingreso?.imagenSen6 || "",
      pdf1: ingreso?.pdf1 || "",
      pdf2: ingreso?.pdf2 || "",
      pdf3: ingreso?.pdf3 || "",
      pdf4: ingreso?.pdf4 || "",
      pdf5: ingreso?.pdf5 || "",
      pdf6: ingreso?.pdf6 || "",
      pdf7: ingreso?.pdf7 || "",
      pdf8: ingreso?.pdf8 || "",
      pdf9: ingreso?.pdf9 || "",
      pdf10: ingreso?.pdf10 || "",
      word1: ingreso?.word1 || "",
      fechaIngreso: ingreso?.fechaHoraIng || "",
      fechaNacimiento: ingreso?.fechaNacimiento || "",
      edad: ingreso?.edad_ing || "",
      observacion: ingreso?.observacion || "",
      temaInf: ingreso?.temaInf || "",
      nacionalidad: ingreso?.nacionalidad || "",
      provincia: ingreso?.provincia || "",
      ubicacionMap: ingreso?.ubicacionMap || "",
      num_causa: ingreso?.numeroCausa || "",

      sitProc: ingreso?.sitProc || "",
      domicilios: ingreso?.domicilios || "",
      juzgados: ingreso?.juzgados || "",
      numeroCausa: ingreso?.numeroCausa || "",
      electrodomesticos: ingreso?.electrodomesticos || [],
      patologias: ingreso?.patologias
        ? JSON.stringify(ingreso.patologias)
        : "[]",
      cicatrices: ingreso?.cicatrices || "",
      tatuajes: ingreso?.tatuajes ? JSON.stringify(ingreso.tatuajes) : "[]",
      perfil: ingreso?.perfil ? JSON.stringify(ingreso.perfil) : "",
      sexo: ingreso?.sexo || "",
      subGrupo: ingreso?.subGrupo || "",
      sexualidad: ingreso?.sexualidad || "",
      estadoCivil: ingreso?.estadoCivil || "",
      profesion: ingreso?.profesion || "",
      titInfoPublic: ingreso?.titInfoPublic || "",
      resumen: ingreso?.resumen || "",
      link: ingreso?.link || "",
      orgCrim: ingreso?.orgCrim || "",
      cualorg: ingreso?.cualorg || "",
      esAlerta: ingreso?.esAlerta || "No",
      condicion: ingreso?.condicion || "",
      internosinvolucrado: JSON.stringify(ingreso?.internosinvolucrado || []),
    },
  });

  // Registro del campo con onBlur
  const lpuRegister = register("lpu", {
    onBlur: async (event) => {
      const lpuValue = event.target.value;
      await handleLpuBlur(lpuValue); // Llamar a la función modularizada
    },
  });
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (ingreso?.internosinvolucrado) {
        return JSON.parse(ingreso.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });
  const [historial, setHistorial] = useState<string>(ingreso?.historial || "");
  // Declarar los estados faltantes
const [selectedIngresoEstablecimiento, setSelectedIngresoEstablecimiento] = useState<string>(ingreso?.establecimiento || "");
const [selectedIngresoModuloUr, setSelectedIngresoModuloUr] = useState<string>(ingreso?.modulo_ur || "");
const [selectedIngresoPabellon, setSelectedIngresoPabellon] = useState<string>(ingreso?.pabellon || "");
const [selectedIngresoCelda, setSelectedIngresoCelda] = useState<string>(ingreso?.celda || "");

  useEffect(() => {
    setSelectedIngresoEstablecimiento(ingreso?.establecimiento || "");
    setSelectedIngresoModuloUr(ingreso?.modulo_ur || "");
    setSelectedIngresoPabellon(ingreso?.pabellon || "");
    setSelectedIngresoCelda(ingreso?.celda || "");
  }, [ingreso]);
    const handleIngresoCeldaChange = (value: string) => {
      setSelectedIngresoCelda(value);
      setValue("celda", value);
    };
  const handleIngresoEstablecimientoChange = (value: string) => {
    setSelectedIngresoEstablecimiento(value);
    setValue("establecimiento", value);
  };

  const handleIngresoModuloUrChange = (value: string) => {
    setSelectedIngresoModuloUr(value);
    setValue("modulo_ur", value);
  };

  const handleIngresoPabellonChange = (value: string) => {
    setSelectedIngresoPabellon(value);
    setValue("pabellon", value);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [orgCrim, setOrgCrim] = useState<string>(ingreso?.orgCrim || "");
  const [cualorg, setCualorg] = useState<string>(ingreso?.cualorg || "");
  const [estadoCivil, setEstadoCivil] = useState<string>(
    ingreso?.estadoCivil || ""
  );
  const [sexo, setSexo] = useState<string>(ingreso?.sexo || "");
  const [subGrupo, setSubGrupo] = useState<string>(ingreso?.subGrupo || "");
  const [sexualidad, setSexualidad] = useState<string>(
    ingreso?.sexualidad || ""
  );
  const [observacion, setobservacion] = useState<string>(
    ingreso?.observacion || ""
  );
  const [temaInf, setTemaInf] = useState<string>(ingreso?.temaInf || "");
  const [link, setlink] = useState<string>(ingreso?.link || "");
  const [titInfoPublic, setTitInfoPublic] = useState<string>(
    ingreso?.titInfoPublic || ""
  );
  const [resumen, setResumen] = useState<string>(ingreso?.resumen || "");
  const [procedencia, setProcedencia] = useState<string>(
    ingreso?.procedencia || ""
  );
  const [condicion, setCondicion] = useState<string>(ingreso?.condicion || "");
  const [nacionalidad, setNacionalidad] = useState<string>(
    ingreso?.nacionalidad || ""
  );
  const [provincia, setProvincia] = useState<string>(ingreso?.provincia || "");
  const [ubicacionMap, setUbicacionMap] = useState<string>(
    ingreso?.ubicacionMap || ""
  );
  const [imagen, setImagen] = useState<string | null>(
    ingreso?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagen}`
      : null
  );
  const [imagenDer, setImagenDer] = useState<string | null>(
    ingreso?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    ingreso?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    ingreso?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    ingreso?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    ingreso?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    ingreso?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    ingreso?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    ingreso?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    ingreso?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    ingreso?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    ingreso?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    ingreso?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    ingreso?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    ingreso?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    ingreso?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    ingreso?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    ingreso?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    ingreso?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    ingreso?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    ingreso?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${ingreso.word1}`
      : null
  );

  const [imagenesHistorial, setImagenesHistorial] = useState<{
    [key: string]: string[];
  }>(ingreso?.imagenesHistorial || {});
  const nombres = watch("nombres");
  const apellido = watch("apellido");
  const lpu = watch("lpu");
  const lpuProv = watch("lpuProv");
  const nDoc = watch("numeroDni");
  const generateFileName = (type: string) => {
    return `${apellido}_${nombres}_L.P.U._${lpu}_L.P.U. PROV_${lpuProv}_NºDoc. ${nDoc}_${type}.png`.replace(
      /\s+/g,
      "_"
    );
  };
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const getImageUrl = (imagePath: string): string => {
    return `/api/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/uploads/${pdfPath.split("/").pop()}`;
  };

  const [isWordOpen, setIsWordOpen] = useState(false);

  const [isMapaModalOpen, setIsMapaModalOpen] = useState(false);

  const [fechaIngreso, setFechaIngreso] = useState<string>(
    ingreso?.fechaHoraIng || ""
  );
  const [fechaNacimiento, setFechaNacimiento] = useState<string>(
    ingreso?.fechaNacimiento || ""
  );
  const [domicilios, setDomicilios] = useState<Domicilio[]>(() => {
    if (ingreso?.domicilios) {
      return ingreso.domicilios
        .split(", ")
        .map((domicilio: string) => ({ domicilio }));
    }
    return [];
  });
  const [isDomiciliosModalOpen, setIsDomiciliosModalOpen] = useState(false);
  const [selectedJuzgados, setSelectedJuzgados] = useState<string[]>(() => {
    if (ingreso?.juzgados) {
      return ingreso.juzgados.split(", ");
    }
    return [];
  });
  const [selectedElectrodomesticos, setSelectedElectrodomesticos] = useState<
    Electrodomestico[]
  >([]);
  const [selectedPatologias, setSelectedPatologias] = useState<Patologia[]>(
    () => {
      if (ingreso?.patologias) {
        try {
          return JSON.parse(ingreso.patologias);
        } catch (error) {
          console.error("Error parsing patologias JSON:", error);
          return [];
        }
      }
      return [];
    }
  );
  const [detallesPatologia, setDetallesPatologia] = useState<string>("");
  const [selectedHeridas, setSelectedHeridas] = useState<Herida[]>(() => {
    if (ingreso?.cicatrices) {
      return ingreso.cicatrices.split(", ").map((cicatriz: string) => {
        const [zona, type, detail] = cicatriz.split(" - ");
        return { zona, type, detail };
      });
    }
    return [];
  });
  const [selectedTatuajes, setSelectedTatuajes] = useState<Tatuaje[]>(() => {
    if (ingreso?.tatuajes) {
      try {
        return JSON.parse(ingreso.tatuajes);
      } catch (error) {
        console.error("Error parsing tatuajes JSON:", error);
        return [];
      }
    }
    return [];
  });
  const [selectedPerfiles, setSelectedPerfiles] = useState<Perfil[]>(() => {
    if (ingreso?.perfil) {
      try {
        return JSON.parse(ingreso.perfil);
      } catch (error) {
        console.error("Error parsing perfil JSON:", error);
        return [];
      }
    }
    return [];
  });
  const [selectedCausas, setSelectedCausas] = useState<Causa[]>(
    ingreso?.numeroCausa ? [{ num_causa: ingreso.numeroCausa }] : []
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    ingreso?.establecimiento || ""
  );
  const [unidadDeIngreso, setUnidadDeIngreso] = useState<string>(
    ingreso?.unidadDeIngreso || ""
  );
  const [tipoDoc, setTipoDoc] = useState<string>(ingreso?.tipoDoc || "");
  const [docNacionalidad, setDocNacionalidad] = useState<string>(
    ingreso?.docNacionalidad || ""
  );
  const handleTipoDocChange = (value: string) => {
    setTipoDoc(value);
    setValue("tipoDoc", value);
  };

  const handleDocNacionalidadChange = (value: string) => {
    setDocNacionalidad(value);
    setValue("docNacionalidad", value);
  };
  const [esAlerta, setEsAlerta] = useState<string>(ingreso?.esAlerta || "No");

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  useEffect(() => {}, [selectedJuzgados]);

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
    numeroDni: "Num. Doc",
  };

  const requiredFields = [
    "establecimiento",
    "apellido",
    "nombres",
    "numeroDni",
  ];
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const missingFields = validateRequiredFields(
      data,
      requiredFields,
      fieldLabels
    );
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
        text: `Hay campos vacíos: ${emptyFields.join(
          " - "
        )}. ¿Deseas continuar?`,
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

      // Inicialización de las variables necesarias
      const domiciliosString =
        domicilios?.map((d) => d.domicilio).join(", ") || "";
      const juzgadosString = selectedJuzgados?.join(", ") || "";
      const electrodomesticosString =
        selectedElectrodomesticos
          ?.map(
            (electrodomestico) =>
              `${electrodomestico.Electrodomestico} (${
                electrodomestico.Norma
              }) - Tipo: ${
                electrodomestico["Tipo de Electrodomestico"]
              } - Detalle: ${electrodomestico.DetalleUser || ""}`
          )
          .join(", ") || "";
      const patologiasString = JSON.stringify(selectedPatologias || []);
      const patologiasConDetalles = `${patologiasString} - Detalles de Patologías: ${
        detallesPatologia || ""
      }`;
      const heridasString =
        selectedHeridas
          ?.map(
            (herida) => `${herida.zona} - ${herida.type} - ${herida.detail}`
          )
          .join(", ") || "";
      const tatuajesString = JSON.stringify(selectedTatuajes || []);
      const perfilesString = JSON.stringify(selectedPerfiles || []);
      const numeroCausa =
        selectedCausas?.map((causa) => causa.num_causa).join(", ") || "";

      const payload: any = {
        apellido: data.apellido,
        nombres: data.nombres,
        alias: data.alias,
        tipoDoc: data.tipoDoc,
        docNacionalidad: data.docNacionalidad,
        numeroDni: data.numeroDni,
        lpu: data.lpu,
        lpuProv: data.lpuProv,
        sitProc: data.sitProc,
        edad_ing: data.edad,
        unidadDeIngreso: data.unidadDeIngreso,
        procedencia: data.procedencia,
        condicion: data.condicion,
        fechaHoraIng: data.fechaIngreso,
        celda: data.celda, // Agregar este campo
        nacionalidad: data.nacionalidad,
        provincia: data.provincia,
        domicilios: domiciliosString,
        ubicacionMap: data.ubicacionMap,
        juzgados: juzgadosString,
        numeroCausa: numeroCausa,
        electrodomesticos: electrodomesticosString,
        cicatrices: heridasString,
        tatuajes: tatuajesString,
        patologias: patologiasString,
        orgCrim: data.orgCrim,
        cualorg: data.cualorg,
        perfil: perfilesString,
        sexo: data.sexo,
        subGrupo: data.subGrupo,
        sexualidad: data.sexualidad,
        estadoCivil: data.estadoCivil,
        profesion: data.profesion,
        observacion: data.observacion,
        temaInf: data.temaInf,
        titInfoPublic: data.titInfoPublic,
        resumen: data.resumen,
        link: data.link,
        email: user?.email,
        esAlerta: esAlerta,
        internosinvolucrado: JSON.stringify(selectedInternos || []),
        establecimiento: data.establecimiento,
        modulo_ur: data.modulo_ur,
        pabellon: data.pabellon,
        historial: historial,
      };

      if (data.fechaNacimiento) {
        payload.fechaNacimiento = data.fechaNacimiento;
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

      if (params?.id) {
        response = await updateIngreso(params.id, formData);
      } else {
        response = await createIngreso(formData);
      }

      const mensajeTitulo = params.id
        ? "Actualización de Interno"
        : "Creación de Interno";

      const alertData = {
        ...data,
        fechaIngreso: data.fechaIngreso,
        procedencia: data.procedencia,
        condicion: data.condicion,
        provincia: data.provincia,
        domiciliosString: domiciliosString,
        ubicacionMap: data.ubicacionMap,
        numeroCausa: numeroCausa,
        juzgadosString: juzgadosString,
        electrodomesticosString: electrodomesticosString,
        patologiasString: patologiasConDetalles,
        heridasString: heridasString,
        tatuajesString: tatuajesString,
        perfilesString: perfilesString,
        link: data.link,
        esAlerta: esAlerta,
      };

      if (response.success) {
        await showAlert(response.success, mensajeTitulo, alertData);
      
        if (esAlerta !== "No") {
          const historialEgresos = ingreso.historialEgresos || []; // Asegúrate de que sea un array
          console.log("Historial que se pasa al PDF:", historialEgresos); // Verificar el historial antes de pasarlo
          generatePDF(payload, imagen, historialEgresos); // Pasar historialEgresos como tercer argumento
        }
        router.push("/portal/eventos/ingresos");
      } else {
        console.error("Error al crear o actualizar ingreso:", response.error);
        await showAlert(false, "Error", alertData);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      await showAlert(false, "Error", {});
    } finally {
      setIsSubmitting(false); // Desbloquear el botón al finalizar
    }
  };
  const goToIngresos = () => {
    router.replace("/portal/eventos/ingresos");
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
{/*         <Reingresos
          initialInternos={selectedInternos}
          onSelect={(value) => {
            setSelectedInternos(value);
            setValue("internosinvolucrado", JSON.stringify(value));
          }}
        /> */}
        <Button
          type="button"
          onClick={() => setIsPhotosOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Fotografías
        </Button>
        <PhotosModal
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
          imagenesHistorial={imagenesHistorial} // Asegúrate de pasar esta prop
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
<SelectCondicion
  value={condicion}
  onChange={(value) => {
    setCondicion(value);
    setValue("condicion", value);
  }}
/>
<HistorialEgresos
  historial={ingreso?.historialEgresos || []}
  setHistorial={(newHistorial) => {
    // Convierte el historial a una cadena JSON antes de actualizarlo
    setValue("historialEgresos", JSON.stringify(newHistorial));
  }}
/>
        <FechaDeIngreso
          value={fechaIngreso}
          onChange={(value: string) => {
            setFechaIngreso(value);
            setValue("fechaIngreso", value);
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
        <SelectTipoDocConNacionalidad
  tipoDoc={tipoDoc}
  docNacionalidad={docNacionalidad} // Cambiado de "nacionalidad" a "docNacionalidad"
  onTipoDocChange={handleTipoDocChange}
  onDocNacionalidadChange={handleDocNacionalidadChange}
/>
        <InputField register={register} name="numeroDni" label="Número Doc." />
        <InputField
        register={register}
        name="lpu"
        label="L.P.U"
    
      />
        <InputField register={register} name="lpuProv" label="L.P.U Prov." />

        <SelectSituacionProcesal
          value={ingreso?.sitProc || ""}
          onChange={(value) => {
            setValue("sitProc", value);
          }}
        />
        <SelectProcedencia
          value={procedencia}
          onChange={(value) => {
            setProcedencia(value);
            setValue("procedencia", value);
          }}
        />
        <SelectUnidadDeIngreso
          value={unidadDeIngreso}
          onChange={(value) => {
            setUnidadDeIngreso(value);
            setValue("unidadDeIngreso", value);
          }}
        />
<SelectComp
  initialEstablecimiento={selectedIngresoEstablecimiento}
  initialModuloUr={selectedIngresoModuloUr}
  initialPabellon={selectedIngresoPabellon}
  initialCelda={selectedIngresoCelda}
  onEstablecimientoChange={handleIngresoEstablecimientoChange}
  onModuloUrChange={handleIngresoModuloUrChange}
  onPabellonChange={handleIngresoPabellonChange}
  onCeldaChange={handleIngresoCeldaChange}
  showPabellon={true}
  showCelda={true}
/>
        <button
          type="button"
          onClick={toggleModal}
          className="w-full text-white bg-teal-500 hover:bg-teal-500 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-400"
        >
          Cronología de alojamientos
        </button>
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
          <HistorialAlojamientos
            historial={historial}
            setHistorial={setHistorial}
            ingreso={ingreso}
          />
        </Modal>
        <SelectNacionalidad
          value={nacionalidad}
          onChange={(value) => {
            setNacionalidad(value);
            setValue("nacionalidad", value);
          }}
        />
        <SelectProvincia
          value={provincia}
          onChange={(value) => {
            setProvincia(value);
            setValue("provincia", value);
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
          initialElectrodomesticos={ingreso?.electrodomesticos || ""}
          onSelect={(selectedElectrodomesticos: Electrodomestico[]) => {
            setSelectedElectrodomesticos(selectedElectrodomesticos);
          }}
        />
        <PatologiaSelector
          defaultPatologias={selectedPatologias}
          onSelect={(selectedPatologias: Patologia[]) => {
            setSelectedPatologias(selectedPatologias);
            setValue("patologias", JSON.stringify(selectedPatologias));
          }}
        />
        <PerfilesSelector
          initialPerfiles={selectedPerfiles}
          onSelect={(selectedPerfiles) => {
            setSelectedPerfiles(selectedPerfiles);
            setValue("perfil", JSON.stringify(selectedPerfiles));
          }}
        />

        <TatuajesSelector
          defaultTatuajes={selectedTatuajes}
          onSelect={(selectedTatuajes: Tatuaje[]) => {
            setSelectedTatuajes(selectedTatuajes);
            setValue("tatuajes", JSON.stringify(selectedTatuajes));
          }}
        />

        <HeridasSelector
          defaultHeridas={selectedHeridas}
          onSelect={(selectedHeridas: Herida[]) => {
            setSelectedHeridas(selectedHeridas);
            setValue(
              "cicatrices",
              selectedHeridas
                .map(
                  (herida) =>
                    `${herida.zona} - ${herida.type} - ${herida.detail}`
                )
                .join(", ")
            );
          }}
        />

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

        <SelectSubGrupo
          value={subGrupo}
          onChange={(value) => {
            setSubGrupo(value);
            setValue("subGrupo", value);
          }}
        />
        <SelectSexo
          value={sexo}
          onChange={(value) => {
            setSexo(value);
            setValue("sexo", value);
          }}
        />
        <SelectSexualidad
          value={sexualidad}
          onChange={(value) => {
            setSexualidad(value);
            setValue("sexualidad", value);
          }}
        />
        <SelectEstadoCivil
          value={estadoCivil}
          onChange={(value) => {
            setEstadoCivil(value);
            setValue("estadoCivil", value);
          }}
        />

        <InputField register={register} name="profesion" label="Profesión/es" />
        <Textarea
          id="titInfoPublic"
          value={titInfoPublic}
          onChange={(value) => {
            setTitInfoPublic(value);
            setValue("titInfoPublic", value);
          }}
          label="Título de información pública"
          placeholder="Escribe Título de información pública aquí..."
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
          id="temaInf"
          value={temaInf}
          onChange={(value) => {
            setTemaInf(value);
            setValue("temaInf", value);
          }}
          label="Tema informativo"
          placeholder="Escribe Tema Informativo aquí..."
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
          placeholder="Escribe los detalles de los delitos aquí..."
        />
        <div className="font-bold ">
          <ToggleAlerta
            id="esAlerta"
            value={esAlerta === "Si"}
            onChange={(value) => setEsAlerta(value)}
            label="¿Es Alerta?"
          />
        </div>
        <div className="flex space-x-4">
          <Button type="button" onClick={goToIngresos} className="bg-orange-500">
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
