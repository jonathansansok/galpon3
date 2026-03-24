//frontend\src\app\portal\eventos\ingresos\new\IngresoForm.tsx
"use client";
import MovilesAnexados from "@/components/ui/MovilesAnexados"; // Importa el nuevo componente
import SelectIVA from "@/components/ui/SelectIVA";
import DiasInput from "@/components/ui/DiasInput";
import InputMau from "@/components/ui/InputMau";
import Condicion from "@/components/ui/Condicion";
import PymeCheckbox from "@/components/ui/PymeCheckbox";
import { Button } from "@/components/ui/button";
import { validateAndNotify, clearFieldErrors, handleBackendErrors } from "../../../../utils/formValidation";
import PhotosModal from "@/components/ui/MultimediaModals/PhotosModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";
import { useFileFields, ALL_FILE_FIELDS } from "@/app/utils/useFileFields";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { anexarMoviles, createIngreso, updateIngreso } from "../ingresos.api";
import { getTemas } from "../../temas/Temas.api"; // Obtener lista de móviles

import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { InputField } from "@/components/ui/InputField";
import { DomiciliosModal } from "@/components/ui/DomiciliosModal";
import ToggleAlerta from "@/components/ui/ToggleAlerta";
import SelectProvincia from "@/components/ui/SelectProvincia";
import { showAlert, showCancelAlert } from "../../../../utils/alertUtils";
import generatePDF from "../../../../utils/pdf2";
import { useUserStore } from "@/lib/store";
import MovilesModal from "@/components/ui/MovilesModal"; // Importa el nuevo componente
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

export function IngresoForm({ ingreso, onSuccess, editId, hideMultimedia }: { ingreso: any; onSuccess?: () => void; editId?: number; hideMultimedia?: boolean }) {
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

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const effectiveId = editId ? String(editId) : params?.id;
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
  const [isMovilesModalOpen, setIsMovilesModalOpen] = useState(false);
  const [moviles, setMoviles] = useState<any[]>([]);
  const [selectedMoviles, setSelectedMoviles] = useState<number[]>([]);

  useEffect(() => {
    const fetchMoviles = async () => {
      try {
        const data = await getTemas(); // Obtener lista de todos los móviles
        setMoviles(data);

        // Si estamos en modo edición, obtener los móviles asociados al ingreso
        if (effectiveId) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingresos/${effectiveId}/moviles`
          );
          if (!response.ok) {
            throw new Error("Error al obtener los móviles asociados");
          }
          const asociados = await response.json();
          setSelectedMoviles(asociados.map((movil: any) => movil.id)); // Establecer los IDs de los móviles asociados
        }
      } catch (error) {
        console.error("Error al obtener móviles:", error);
      }
    };

    fetchMoviles();
  }, [effectiveId]);

  const handleAnexarMoviles = async () => {
    try {
      // Actualiza los móviles seleccionados en el backend
      await anexarMoviles(ingreso.id, selectedMoviles);

      // Actualiza el estado del frontend para reflejar los cambios
      setSelectedMoviles([...selectedMoviles]);

      Alert.success({ title: "Recordatorio", text: "Recuerde clickear en ACTUALIZAR para confirmar los cambios" });
      setIsMovilesModalOpen(false);
    } catch (error) {
      Alert.error({
        title: "Error",
        text: "No se pudieron anexar los móviles",
      });
    }
  };
  const [observacion, setobservacion] = useState<string>(
    ingreso?.observacion || ""
  );
  const [condicion, setCondicion] = useState<string>(ingreso?.condicion || "");
  const [resumen, setResumen] = useState<string>(ingreso?.resumen || "");
  const [provincia, setProvincia] = useState<string>(ingreso?.provincia || "");
  const { files, setFile, getFileUrl, originalNames, setOriginalName } = useFileFields("ingresos", ingreso);

  const [imagenesHistorial, setImagenesHistorial] = useState<{
    [key: string]: string[];
  }>(ingreso?.imagenesHistorial || {});
  const nombres = watch("nombres");
  const apellido = watch("apellido");
  const telefono = watch("telefono");
  const email = watch("emailCliente");
  const nDoc = watch("numeroDni");
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
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
          setUser({ id: data.id, name: data.name, email: data.email });
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

  const ingresoValidationRules = {
    apellido: { required: true, noNumbers: true, label: "Apellido" },
    nombres: { required: true, noNumbers: true, label: "Nombres" },
    numeroCuit: { required: true, numeric: true, label: "CUIT" },
    dias: { required: true, numeric: true, label: "Días" },
    numeroDni: { required: true, numeric: true, label: "Número Doc." },
    telefono: { required: true, label: "Teléfono" },
    emailCliente: { required: true, email: true, label: "Email Cliente" },
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Validar con toast + scroll + red borders
    clearFieldErrors();
    const { valid } = validateAndNotify(data, ingresoValidationRules);
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
    
    setIsSubmitting(true); // Bloquear el botón al iniciar el envío
    
    try {
      let response;
    
      // Inicialización de las variables necesarias
      const domiciliosString =
        domicilios?.map((d) => d.domicilio).join(", ") || "";
    
        const sanitizeNumericFields = (payload: any, fields: string[]) => {
          fields.forEach((field) => {
            if (payload[field]) {
              payload[field] = payload[field].toString().trim(); // Convertir a cadena y eliminar espacios
            } else {
              payload[field] = ""; // Enviar como cadena vacía si no tiene valor
            }
          });
        };
        
        const payload: any = {
          numeroCuit: data.numeroCuit,
          dias: data.dias,
          iva: data.iva || "", // Manejar campo vacío
          condicion: data.condicion || "", // Manejar campo vacío
          porcB: data.porcB,
          porcRetIB: data.porcRetIB,
          provincia: data.provincia || "", // Manejar campo vacío
          resumen: data.resumen || "", // Manejar campo vacío
          numeroDni: data.numeroDni || "", // Manejar campo vacío
          telefono: data.telefono || "", // Manejar campo vacío
          emailCliente: data.emailCliente || "", // Manejar campo vacío
          apellido: data.apellido || "", // Manejar campo vacío
          cp: data.cp,
          nombres: data.nombres || "", // Manejar campo vacío
          domicilios: domiciliosString || "", // Manejar campo vacío
          observacion: data.observacion || "", // Manejar campo vacío
          email: user?.email || "", // Manejar campo vacío
          esAlerta: esAlerta || "", // Manejar campo vacío
          internosinvolucrado: JSON.stringify(selectedInternos || []), // Convertir a JSON
        };
        
        // Sanitizar campos numéricos
        sanitizeNumericFields(payload, ["numeroCuit", "dias", "porcB", "porcRetIB", "cp", "numeroDni"]);
        
        // Log detallado del payload para depuración
        console.log("[DEBUG] Payload enviado al backend:");
        Object.entries(payload).forEach(([key, value]) => {
          console.log(`  ${key}:`, value, `(${typeof value})`);
        });
      const formData = new FormData();
      for (const key in payload) {
        if (payload[key] !== null && payload[key] !== undefined && payload[key] !== "") {
          formData.append(key, payload[key]);
        }
      }

      // Procesar imágenes y archivos
      const sanitizeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "_").substring(0, 60);

      const processFile = async (
        file: string | null,
        key: string,
        extension: string
      ) => {
        if (file && file.startsWith("data:")) {
          const origName = originalNames[key];
          const baseName = origName ? sanitizeName(origName.replace(/\.[^.]+$/, "")) : key;
          const uniqueFileName = `${key}--${baseName}-${Date.now()}.${extension}`;
          console.log("multimedia", "processFile", { key, extension, uniqueFileName });
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append("files", blob, uniqueFileName);
          formData.append(key, uniqueFileName);
        }
      };

      const fileCount = ALL_FILE_FIELDS.filter((f) => files[f]?.startsWith("data:")).length;
      console.log("multimedia", "IngresoForm submit", { fileCount });

      await Promise.all(
        ALL_FILE_FIELDS.map((field) => {
          const ext = field.startsWith("pdf") ? "pdf" : field.startsWith("word") ? "docx" : "png";
          return processFile(files[field], field, ext);
        })
      );

      // Enviar explícitamente campos vacíos para archivos eliminados
      for (const field of ALL_FILE_FIELDS) {
        if (!files[field] && !formData.has(field)) {
          formData.append(field, "");
        }
      }

      // Enviar nombres originales de archivos
      formData.append("nombresOriginales", JSON.stringify(originalNames));

      console.log("[DEBUG] Payload enviado al backend:");
      Object.entries(payload).forEach(([key, value]) => {
        console.log(`  ${key}:`, value, `(${typeof value})`);
      });
      
      if (effectiveId) {
        response = await updateIngreso(effectiveId!, formData);
      } else {
        response = await createIngreso(formData);
      }

      const mensajeTitulo = params.id
        ? "Actualización de Cliente"
        : "Creación de Cliente";

      const alertData = {
        ...response.data, // Utiliza los datos devueltos por el backend
      };

      if (response.success) {
        clearFieldErrors();
        await showAlert(response.success, mensajeTitulo, alertData);

        if (esAlerta !== "No") {
          const historialEgresos = ingreso.historialEgresos || [];
          generatePDF(payload, files.imagen, historialEgresos);
        }
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/portal/eventos/ingresos");
        }
      } else {
        console.error("Error al crear o actualizar ingreso:", response.error);
        handleBackendErrors(response);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      handleBackendErrors({ message: "Error al enviar el formulario" });
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
      className="space-y-6 max-w-7xl mx-auto"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
      }}
    >
      <WatermarkBackground setBackgroundImage={setBackgroundImage} />
      <MovilesAnexados
        moviles={moviles}
        selectedMoviles={selectedMoviles}
        setSelectedMoviles={setSelectedMoviles} // Pasar la función como prop
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-auto items-start">
        <Button
          type="button"
          onClick={() => setIsMovilesModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Anexar móviles
        </Button>
        <MovilesModal
          isOpen={isMovilesModalOpen}
          onClose={() => setIsMovilesModalOpen(false)}
          moviles={moviles}
          selectedMoviles={selectedMoviles}
          setSelectedMoviles={setSelectedMoviles}
          handleAnexarMoviles={handleAnexarMoviles}
        />
        {!hideMultimedia && (
          <>
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
              files={files}
              setFile={setFile}
              getFileUrl={getFileUrl}
              imagenesHistorial={imagenesHistorial}
              originalNames={originalNames}
              setOriginalName={setOriginalName}
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
              originalNames={originalNames}
              setOriginalName={setOriginalName}
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
              originalNames={originalNames}
              setOriginalName={setOriginalName}
            />
          </>
        )}
        <InputField
          register={register}
          name="apellido"
          label="Apellido o razón social"
          placeholder=""
        />
        <InputField register={register} name="nombres" label="Nombres" />
        <InputField register={register} name="numeroDni" label="Número Doc." />

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
        <div className="relative mb-4">
          <input
            {...register("telefono")}
            id="telefono"
            type="text"
            autoComplete="off"
            placeholder=" "
            onFocus={() => toast.info(
              "Formato: 549 + código de área + número. Ej: 5491155667788 (CABA) · 5492215566778 (La Plata)",
              { toastId: "tel-hint", autoClose: 6000 }
            )}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <label htmlFor="telefono" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white ml-2 peer-focus:ml-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
            Teléfono
          </label>
        </div>
        <SelectIVA
          value={watch("iva")}
          onChange={(value) => setValue("iva", value)}
        />
        <InputMau
          register={register}
          name="numeroCuit"
          label="Número de CUIT"
        />

        <DiasInput register={register} name="dias" label="Días" />

        <Condicion
          value={watch("condicion")}
          onChange={(value) => setValue("condicion", value)}
        />
        <InputField
          register={register}
          name="emailCliente"
          label="Email Cliente"
          placeholder=""
        />
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
            className="bg-slate-500 hover:bg-slate-600"
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
