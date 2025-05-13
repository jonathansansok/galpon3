//frontend\src\app\portal\eventos\temas\new\TemaForm.tsx
"use client";
import { usePresupuestoStore } from "@/lib/store"; // Importar el store de Zustand
import PresupuestosAsociados from "@/components/ui/PresupuestosAsociados";
import { getPresupuestosAsociados } from "../Temas.api";
import { InputField } from "@/components/ui/InputField";
import { InputAnio } from "@/components/ui/InputAnio";
import { Button } from "@/components/ui/button";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createTema, updateTema, getClienteAsociado } from "../Temas.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import { useUserStore } from "@/lib/store"; // Importar el store de Zustand
import { ShowTemas, showCancelAlert } from "../../../../utils/alertUtils"; // Importa las funciones
import ClienteAsociado from "@/components/ui/ClienteAsociado";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import SelectMarca from "@/app/portal/eventos/marcas/SelectMarca";
interface FormValues {
  [key: string]: string;
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

export function TemaForm({ tema }: { tema: any }) {
  const [presupuestos, setPresupuestos] = useState<any[]>([]);
  const [showPresupuestos, setShowPresupuestos] = useState(false);
  const idMovil = usePresupuestoStore((state) => state.idMovil);

  const fetchPresupuestos = async () => {
    if (!idMovil) {
      console.error("No se encontró el ID del móvil.");
      return;
    }

    try {
      const data = await getPresupuestosAsociados(idMovil.toString());
      setPresupuestos(data);
      console.log("[DEBUG] Presupuestos asociados:", data);
    } catch (error) {
      console.error("Error al obtener los presupuestos asociados:", error);
    }
  };

  const { handleSubmit, setValue, register, reset, watch } =
    useForm<FormValues>({
      defaultValues: {
        observacion: tema?.observacion || "",
        fechaHora: tema?.fechaHora || "",

        email: tema?.email || "",
        internosinvolucrado: JSON.stringify(tema?.internosinvolucrado || []),
        imagen: tema?.imagen || "",
        imagenDer: tema?.imagenDer || "",
        imagenIz: tema?.imagenIz || "",
        imagenDact: tema?.imagenDact || "",
        imagenSen1: tema?.imagenSen1 || "",
        imagenSen2: tema?.imagenSen2 || "",
        imagenSen3: tema?.imagenSen3 || "",
        imagenSen4: tema?.imagenSen4 || "",
        imagenSen5: tema?.imagenSen5 || "",
        imagenSen6: tema?.imagenSen6 || "",
        pdf1: tema?.pdf1 || "",
        pdf2: tema?.pdf2 || "",
        pdf3: tema?.pdf3 || "",
        pdf4: tema?.pdf4 || "",
        pdf5: tema?.pdf5 || "",
        pdf6: tema?.pdf6 || "",
        pdf7: tema?.pdf7 || "",
        pdf8: tema?.pdf8 || "",
        pdf9: tema?.pdf9 || "",
        pdf10: tema?.pdf10 || "",
        word1: tema?.word1 || "",
        patente: tema?.patente || "",
        marca: tema?.marca || "",
        modelo: tema?.modelo || "",
        anio: tema?.anio?.toString() || "",
        color: tema?.color || "",
        tipoPintura: tema?.tipoPintura || "",
        paisOrigen: tema?.paisOrigen || "",
        tipoVehic: tema?.tipoVehic || "",
        motor: tema?.motor || "",
        chasis: tema?.chasis || "",
        combustion: tema?.combustion || "",
        vin: tema?.vin || "",
      },
    });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zustand: Obtener y configurar el estado global
  const setIdMovil = usePresupuestoStore((state) => state.setIdMovil);
  const setPatente = usePresupuestoStore((state) => state.setPatente); // Agregar esta línea

  useEffect(() => {
    if (params?.id) {
      console.log("[DEBUG] Valor de tema?.patente:", tema?.patente);
      setIdMovil(Number(params.id));
      setPatente(tema?.patente || "");
    }
  }, [params?.id, setIdMovil, setPatente, tema?.patente]);

  const [fechaHora, setFechaHora] = useState<string>(tema?.fechaHora || "");
  const [observacion, setObservacion] = useState<string>(
    tema?.observacion || ""
  );

  const [imagen, setImagen] = useState<string | null>(
    tema?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.imagen}`
      : null
  );

  const [imagenDer, setImagenDer] = useState<string | null>(
    tema?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    tema?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    tema?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    tema?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    tema?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    tema?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    tema?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    tema?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    tema?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    tema?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    tema?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    tema?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    tema?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    tema?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    tema?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    tema?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    tema?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    tema?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    tema?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    tema?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${tema.word1}`
      : null
  );
  const [selectedInternos, setSelectedInternos] = useState<Interno[]>(() => {
    try {
      if (tema?.internosinvolucrado) {
        return JSON.parse(tema.internosinvolucrado);
      }
    } catch (error) {
      console.error("Error parsing internosinvolucrado:", error);
    }
    return [];
  });
  const [anio, setAnio] = useState<string>(tema?.anio?.toString() || "");
  const nombres = watch("establecimiento");

  const generateFileName = (type: string) => {
    return `Documento_${type}.png`.replace(/\s+/g, "_");
  };

  const validateEmptyFields = () => {
    const fieldsToValidate = [
      anio,
      watch("patente"),
      watch("marca"),
      watch("modelo"),
      watch("color"),
      watch("tipoPintura"),
      watch("paisOrigen"),
      watch("tipoVehic"),
      watch("motor"),
      watch("chasis"),
      watch("combustion"),
      watch("vin"),
    ];

    return fieldsToValidate.some((field) => !field || field.trim() === "");
  };
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const getImageUrl = (imagePath: string): string => {
    return `/api/temas/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/temas/uploads/${pdfPath.split("/").pop()}`;
  };

  const [isWordOpen, setIsWordOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [clienteAsociado, setClienteAsociado] = useState<any>(null);

  const setClienteData = usePresupuestoStore((state) => state.setClienteData); // Obtener setClienteData de Zustand

  useEffect(() => {
    const fetchClienteAsociado = async () => {
      try {
        if (params?.id) {
          console.log("[DEBUG] ID del tema:", params.id); // Verificar el ID del tema

          const cliente = await getClienteAsociado(params.id);
          console.log(
            "[DEBUG] Datos del cliente obtenidos del backend:",
            cliente
          ); // Verificar los datos obtenidos

          setClienteAsociado(cliente); // Establecer los datos del cliente asociado en el estado local

          const clienteData = {
            nombre: cliente.nombres || "No disponible",
            apellido: cliente.apellido || "No disponible",
            email: cliente.emailCliente || "No disponible",
            telefono: cliente.telefono || "No disponible",
            cuit: cliente.numeroCuit || "No disponible",
            localidad: cliente.provincia || "No disponible",
            direccion: cliente.direccion || "No disponible",
            fechaCreacion: cliente.createdAt || "No disponible",
          };

          console.log(
            "[DEBUG] Datos del cliente preparados para Zustand:",
            clienteData
          ); // Verificar los datos preparados

          setClienteData(clienteData); // Guardar los datos del cliente en Zustand

          console.log(
            "[DEBUG] Datos del cliente guardados en Zustand:",
            clienteData
          ); // Confirmar que se guardaron en Zustand
        }
      } catch (error) {
        console.error("Error al obtener el cliente asociado:", error);
      }
    };

    fetchClienteAsociado();
  }, [params?.id, setClienteData]);
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
  };

  const requiredFields = ["", ""];
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("[DEBUG] Valor de anio antes de parsear:", anio);

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas enviar el formulario?",
      icon: "warning",
    });

    if (!confirmation.isConfirmed) {
      showCancelAlert();
      return;
    }

    setIsSubmitting(true); // Bloquear el botón

    try {
      const payload: any = {
        observacion: data.observacion,
        fechaHora: data.fechaHora || null,
        internosinvolucrado: JSON.stringify(selectedInternos),
        email: user?.email,
        patente: data.patente,
        marca: data.marca, 
        modelo: data.modelo,
        anio: anio, // `anio` ya es una cadena
        color: data.color,
        tipoPintura: data.tipoPintura,
        paisOrigen: data.paisOrigen,
        tipoVehic: data.tipoVehic,
        motor: data.motor,
        chasis: data.chasis,
        combustion: data.combustion,
        vin: data.vin,
      };

      console.log("[DEBUG] Payload enviado al backend:", payload);
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

      try {
        let response;

        if (params?.id) {
          response = await updateTema(params.id, formData);
        } else {
          response = await createTema(formData);
        }

        const mensajeTitulo = params?.id
          ? "Actualización de Móvil"
          : "Creación de Móvil";

        console.log("[DEBUG] response completo:", response);
        console.log("[DEBUG] response.success:", response.success);
        console.log("[DEBUG] response.data:", response.data);
        console.log("[DEBUG] response.error:", response.error);

        await ShowTemas(
          response.success,
          mensajeTitulo,
          response.data ?? response.error,
          clienteAsociado // Pasar los datos del cliente asociado
        );

        if (response.success) {
          router.push("/portal/eventos/temas");
        } else {
          console.error(
            "[ERROR] Error al crear o actualizar tema:",
            response.error
          );
          ShowTemas(false, "Error", response.error);
        }
      } catch (error) {
        console.error("[EXCEPTION] Error inesperado:", error);
        ShowTemas(
          false,
          "Error inesperado",
          error instanceof Error ? error.message : "Error desconocido",
          clienteAsociado || {} // Pasar un objeto vacío si no hay cliente
        );
      } finally {
        setIsSubmitting(false);
      }
    } finally {
      setIsSubmitting(false); // Desbloquear el botón
    }
  };
  const goToTemas = () => {
    router.push("/portal/eventos/temas");
  };

  return (
    <form
      id="formulario"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
      }}
    >
      <WatermarkBackground setBackgroundImage={setBackgroundImage} />
      <ClienteAsociado cliente={clienteAsociado} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-auto items-start">
        <Button
          type="button"
          onClick={() => {
            if (params?.id) {
              setIdMovil(Number(params.id)); // Guardar el ID del móvil en Zustand
              console.log(`ID del móvil (${params.id}) guardado en Zustand.`);
              router.push("/portal/eventos/presupuestos/new"); // Navegar en la misma ventana
            } else {
              console.error("No se encontró el ID del móvil.");
            }
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Agregar Presupuesto-Trabajo
        </Button>
        <Button
          type="button"
          onClick={() => {
            setShowPresupuestos(!showPresupuestos);
            if (!showPresupuestos) {
              fetchPresupuestos();
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          {showPresupuestos
            ? "Ocultar Presupuestos"
            : "Ver Presupuestos Asociados"}
        </Button>

        {/* Tabla de presupuestos asociados */}
        {showPresupuestos && (
          <div className="col-span-full w-full">
            <PresupuestosAsociados presupuestos={presupuestos} />
          </div>
        )}

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

        <InputField
          register={register}
          name="patente"
          label="Patente"
          placeholder=""
        />
        <SelectMarca
  name="marca"
  label="Marca"
  register={register}
/>
        <InputField
          register={register}
          name="modelo"
          label="Modelo"
          placeholder=""
        />
        <InputAnio
          value={anio} // `anio` debe ser una cadena
          onChange={(e) => setAnio(e.target.value)} // Actualiza el estado como cadena
          label="Año"
          placeholder="Ingrese el año"
        />
        <InputField
          register={register}
          name="color"
          label="Color"
          placeholder=""
        />
        <InputField
          register={register}
          name="tipoPintura"
          label="Tipo de Pintura"
          placeholder=""
        />
        <InputField
          register={register}
          name="paisOrigen"
          label="País de Origen"
          placeholder=""
        />
        <InputField
          register={register}
          name="tipoVehic"
          label="Tipo de Vehículo"
          placeholder=""
        />
        <InputField
          register={register}
          name="motor"
          label="Motor"
          placeholder=""
        />
        <InputField
          register={register}
          name="chasis"
          label="Chasis"
          placeholder=""
        />
        <InputField
          register={register}
          name="combustion"
          label="Combustión"
          placeholder=""
        />
        <InputField register={register} name="vin" label="VIN" placeholder="" />

        <FechaHoraEvento
          value={fechaHora}
          onChange={(value: string) => {
            setFechaHora(value);
            setValue("fechaHora", value);
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
        <div className="flex space-x-4">
          <Button type="button" onClick={goToTemas} className="bg-orange-500">
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
              ? "Actualizar Móvil"
              : "Crear Móvil"}
          </Button>
        </div>
      </div>
    </form>
  );
}
