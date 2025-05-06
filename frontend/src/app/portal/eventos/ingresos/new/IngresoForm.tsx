//frontend\src\app\portal\eventos\ingresos\new\IngresoForm.tsx
"use client";
import SelectIVA from "@/components/ui/SelectIVA";
import DiasInput from "@/components/ui/DiasInput";
import InputMau from "@/components/ui/InputMau";
import Condicion from "@/components/ui/Condicion";
import PymeCheckbox from "@/components/ui/PymeCheckbox";
import { handleLpuBlur } from "./handleLpuBlur";
import { Button } from "@/components/ui/button";
import {
  validateEmptyFields,
  validateFieldFormats,
} from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import PhotosModal from "@/components/ui/MultimediaModals/PhotosModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createIngreso, updateIngreso } from "../ingresos.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { InputField } from "@/components/ui/InputField";
import { DomiciliosModal } from "@/components/ui/DomiciliosModal";
import ToggleAlerta from "@/components/ui/ToggleAlerta";
import SelectProvincia from "@/components/ui/SelectProvincia";
import { showAlert, showCancelAlert } from "../../../../utils/alertUtils";
import generatePDF from "../../../../utils/pdf2";
import { useUserStore } from "@/lib/store";
import Modal from "@/components/ui/Modal";
interface Domicilio {
  domicilio: string;
  establecimiento?: string;
}

interface Interno {
  alias: string;
  lpu: string | number;
  lpuProv: string;
  sitProc: string;
  detalle: string;
  establecimiento: string;
  apellido: string;
  cp: string;
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
  telefono?: string; // Agregado
  emailCliente?: string; // Agregado
}

interface FormValues {
  [key: string]: string;
}

export function IngresoForm({ ingreso }: { ingreso: any }) {
  const { handleSubmit, setValue, register, watch } = useForm<FormValues>({
    defaultValues: {
      numeroCuit: ingreso?.numeroCuit || "",
      dias: ingreso?.dias || "",
      iva: ingreso?.iva || "Consumidor Final",
      condicion: ingreso?.condicion || "Cliente",
      pyme: ingreso?.pyme || "false",
      porcB: ingreso?.porcB || "",
      porcRetIB: ingreso?.porcRetIB || "",
      provincia: ingreso?.provincia || "",
      numeroDni: ingreso?.numeroDni || "",
      telefono: ingreso?.telefono || "",
      emailCliente: ingreso?.emailCliente || "",
      apellido: ingreso?.apellido || "",
      cp: ingreso?.cp || "",
      nombres: ingreso?.nombres || "",
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
      observacion: ingreso?.observacion || "",
      domicilios: ingreso?.domicilios || "",
      esAlerta: ingreso?.esAlerta || "No",

      resumen: ingreso?.resumen || "",
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [observacion, setobservacion] = useState<string>(
    ingreso?.observacion || ""
  );
  const [condicion, setCondicion] = useState<string>(ingreso?.condicion || "");
  const [resumen, setResumen] = useState<string>(ingreso?.resumen || "");
  const [provincia, setProvincia] = useState<string>(ingreso?.provincia || "");
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
  const telefono = watch("telefono");
  const email = watch("emailCliente");
  const nDoc = watch("numeroDni");
  const generateFileName = (type: string) => {
    return `${apellido}_${nombres}_Telefono:${telefono}_Nº D.n.i.: ${nDoc}_Email:${email}_ ${type}.png`.replace(
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

  const [esAlerta, setEsAlerta] = useState<string>(ingreso?.esAlerta || "No");

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
    apellido: "Apellido",
    nombres: "Nombres",
  };

  const requiredFields = ["apellido", "nombres"];
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const emptyFields = validateEmptyFields(data, fieldLabels, excludedFields);

    const formatErrors = validateFieldFormats(data);

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

      const payload: any = {
        numeroCuit: data.numeroCuit,
        dias: data.dias,
        iva: data.iva,
        condicion: data.condicion,
        pyme: data.pyme === "true", // Convertir a boolean
        porcB: data.porcB,
        porcRetIB: data.porcRetIB,
        provincia: data.provincia,
        resumen: data.resumen,
        numeroDni: data.numeroDni,
        telefono: data.telefono,
        emailCliente: data.emailCliente,
        apellido: data.apellido,
        cp: data.cp,
        nombres: data.nombres,
        domicilios: domiciliosString,
        observacion: data.observacion,
        email: user?.email,
        esAlerta: esAlerta,

        internosinvolucrado: JSON.stringify(selectedInternos || []),
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
        response = await updateIngreso(params.id, formData);
      } else {
        response = await createIngreso(formData);
      }

      const mensajeTitulo = params.id
        ? "Actualización de Cliente"
        : "Creación de Cliente";

      const alertData = {
        ...data,
        provincia: data.provincia,
        condicion: data.condicion,
        domiciliosString: domiciliosString,
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
        <Button
          type="button"
          onClick={() => setIsPdfOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg"
        >
          Autos
        </Button>

        <InputField
          register={register}
          name="apellido"
          label="Apellido o razón social"
          placeholder=""
        />
        <InputField register={register} name="nombres" label="Nombres" />
        <InputField register={register} name="numeroDni" label="Número Doc." />
        <InputField
          register={register}
          name="telefono"
          label="Teléfono"
          placeholder=""
        />
        <InputField
          register={register}
          name="emailCliente"
          label="Email Cliente"
          placeholder=""
        />

        <Button
          type="button"
          onClick={() => setIsDomiciliosModalOpen(true)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Cargar domicilios
        </Button>
        <SelectProvincia
          value={provincia}
          onChange={(value) => {
            setProvincia(value);
            setValue("provincia", value);
          }}
        />
        <InputField register={register} name="cp" label="C.P." placeholder="" />
        <InputMau
          register={register}
          name="numeroCuit"
          label="Número de CUIT"
        />

        <DiasInput register={register} name="dias" label="Días" />

        <InputMau register={register} name="porcB" label="Porcentaje B" />

        <InputMau
          register={register}
          name="porcRetIB"
          label="Porcentaje Retención IB"
        />
        <PymeCheckbox
  checked={watch("pyme") === "true"} // Convertir la cadena a booleano
  onChange={(checked) => setValue("pyme", checked ? "true" : "false")} // Convertir el booleano a cadena
/>
        <SelectIVA
          value={watch("iva")}
          onChange={(value) => setValue("iva", value)}
        />

        <Condicion
          value={watch("condicion")}
          onChange={(value) => setValue("condicion", value)}
        />

        <Textarea
          id="resumen"
          value={resumen}
          onChange={(value) => {
            setResumen(value);
            setValue("resumen", value);
          }}
          label="Referencia"
          placeholder="Escribe la referencia aquí..."
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

        <div className="font-bold ">
          <ToggleAlerta
            id="esAlerta"
            value={esAlerta === "Si"}
            onChange={(value) => setEsAlerta(value)}
            label="¿Expedir PDF?"
          />
        </div>
        <div className="flex space-x-4">
          <Button
            type="button"
            onClick={goToIngresos}
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
    </form>
  );
}
