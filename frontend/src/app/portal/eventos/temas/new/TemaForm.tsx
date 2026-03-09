//frontend\src\app\portal\eventos\temas\new\TemaForm.tsx
"use client";
import { getMarcas, getModelos } from "@/app/portal/eventos/marcas/Marcas.api"; // Importar la función getModelos
import SelectModelo from "@/app/portal/eventos/marcas/SelectModelo"; // Importa el nuevo componente
import SelectMarca from "@/app/portal/eventos/marcas/SelectMarca";
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
import { validateAndNotify, clearFieldErrors, handleBackendErrors } from "../../../../utils/formValidation";
import ClienteAsociado from "@/components/ui/ClienteAsociado";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import { useFileFields, ALL_FILE_FIELDS } from "@/app/utils/useFileFields";

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
  const [modelos, setModelos] = useState<{ id: number; label: string }[]>([]);
  const fetchModelosByMarca = async (marcaId: string) => {
    try {
      const allModelos = await getModelos(); // Obtener todos los modelos
      const filteredModelos = allModelos.filter(
        (modelo: any) => modelo.marcaId === parseInt(marcaId)
      ); // Filtrar por marcaId
      setModelos(
        filteredModelos.map((modelo: any) => ({
          id: modelo.id,
          label: modelo.label,
        }))
      );
    } catch (error) {
      console.error("Error al obtener los modelos:", error);
    }
  };

  const fetchMarcaLabel = async (marcaId: string) => {
    try {
      const marcas = await getMarcas(); // Obtener todas las marcas
      const marca = marcas.find((m: any) => m.id === parseInt(marcaId));
      return marca ? marca.label : ""; // Devuelve el label de la marca o una cadena vacía
    } catch (error) {
      console.error("Error al obtener el label de la marca:", error);
      return "";
    }
  };

  const fetchModeloLabel = async (modeloId: string) => {
    try {
      const modelos = await getModelos(); // Obtener todos los modelos
      const modelo = modelos.find((m: any) => m.id === parseInt(modeloId));
      return modelo ? modelo.label : ""; // Devuelve el label del modelo o una cadena vacía
    } catch (error) {
      console.error("Error al obtener el label del modelo:", error);
      return "";
    }
  };

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

  useEffect(() => {
    const fetchLabels = async () => {
      if (tema?.marca) {
        console.log("Configurando marca:", tema.marca); // Debug
        setValue("marca", tema.marca); // Establecer el ID de la marca directamente
        await fetchModelosByMarca(tema.marca); // Cargar los modelos asociados a la marca
      }
  
      if (tema?.modelo) {
        console.log("Configurando modelo:", tema.modelo); // Debug
        setTimeout(() => {
          setValue("modelo", tema.modelo); // Establecer el ID del modelo directamente
        }, 100); // Esperar un breve momento para que las opciones estén listas
      }
    };
  
    fetchLabels();
  }, [tema, setValue]);
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

  const { files, setFile, getFileUrl } = useFileFields("temas", tema);
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
  const [isPdfOpen, setIsPdfOpen] = useState(false);
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

  const temaValidationRules = {
    patente: { required: true, label: "Patente" },
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("[DEBUG] Valor de anio antes de parsear:", anio);

    // Validar con toast + scroll + red borders
    clearFieldErrors();
    const { valid } = validateAndNotify(data, temaValidationRules);
    if (!valid) return;

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
          console.log("multimedia", "processFile", { key, extension, uniqueFileName });
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append("files", blob, uniqueFileName);
          formData.append(key, uniqueFileName);
        }
      };

      const fileCount = ALL_FILE_FIELDS.filter((f) => files[f]?.startsWith("data:")).length;
      console.log("multimedia", "TemaForm submit", { fileCount });

      await Promise.all(
        ALL_FILE_FIELDS.map((field) => {
          const ext = field.startsWith("pdf") ? "pdf" : field.startsWith("word") ? "docx" : "png";
          return processFile(files[field], field, ext);
        })
      );

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
          clearFieldErrors();
          window.location.href = "/portal/eventos/temas";
        } else {
          console.error(
            "[ERROR] Error al crear o actualizar tema:",
            response.error
          );
          handleBackendErrors(response);
        }
      } catch (error) {
        console.error("[EXCEPTION] Error inesperado:", error);
        handleBackendErrors({ message: error instanceof Error ? error.message : "Error desconocido" });
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
          files={files}
          setFile={setFile}
          getFileUrl={getFileUrl}
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
          files={files}
          setFile={setFile}
          getFileUrl={getFileUrl}
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
          files={files}
          setFile={setFile}
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
          watch={watch} // Pasar watch como prop
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const marcaId = e.target.value;
            setValue("marca", marcaId); // Actualiza el valor de la marca en el formulario
            fetchModelosByMarca(marcaId); // Carga los modelos asociados a la marca
          }}
        />

        <SelectModelo
          name="modelo"
          label="Modelo"
          register={register}
          watch={watch} // Pasar watch como prop
          marcaId={watch("marca")} // Pasar el ID de la marca seleccionada
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setValue("modelo", e.target.value); // Actualizar el valor del modelo en el formulario
          }}
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
