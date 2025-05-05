//frontend\src\app\portal\eventos\reqpositivos\new\ReqpositivoForm.tsx
"use client";
import BuscarInternoModal from "@/components/ui/BuscarInternoModal";
import { validateRequiredFields, validateEmptyFields, validateFieldFormats } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import { autocompleteForm } from "@/app/utils/autocompleteUtils";
import { Ingreso } from "@/types/Ingreso";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createReqpositivo, updateReqpositivo } from "../Reqpositivos.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import ProfileImageCropper from "@/components/ui/ProfileImageCropper";
import Select from "@/components/ui/Select";
import FechaDeIngresoReqPos from "@/components/ui/FechaDeIngresoReqPos";
import FechaDeEgreso from "@/components/ui/FechaDeEgreso";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import { Edad } from "@/components/ui/edad";
import SelectTipoDoc from "@/components/ui/SelectTipoDoc";
import { InputField } from "@/components/ui/InputField";
import FechaDeNacimiento from "@/components/ui/FechaDeNacimiento";
import SelectNacionalidad from "@/components/ui/Nacionalidad";
import { DomiciliosModal } from "@/components/ui/DomiciliosModal";
import { DomicilioMapaModal } from "@/components/ui/DomicilioMapaModal";
import { JuzgadoSelector } from "@/components/ui/JuzgadoSelector";
import { ElectrodomesticoSelector } from "@/components/ui/ElectrodomesticosSelector";
import SelectSituacionProcesal from "@/components/ui/sitProc";
import RegistraAntecedenteSPFSelect from "@/components/ui/selects/RegistraAntecedenteSPFSelect";
import { CausasModal } from "@/components/ui/CausasModal";

import {
  ShowReqpositivos,
  showCancelAlert,
} from "../../../../utils/alertUtils";
import SelectSexo from "@/components/ui/SelectSexo";
import generatePDF from "../../../../utils/reqPositivoPdf";
import { useUserStore } from "@/lib/store";
import { loadGoogleMaps } from "@/app/utils/googleMapsLoader";

interface Domicilio {
  domicilio: string;
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

interface FormValues {
  [key: string]: string;
}

interface Causa {
  num_causa: string;
}

export function ReqPositivoForm({ reqPositivo }: { reqPositivo: any }) {
  const [isBuscarInternoModalOpen, setIsBuscarInternoModalOpen] = useState(false);
  const { handleSubmit, setValue, register } = useForm<FormValues>({
    defaultValues: {
      fechaHora: reqPositivo?.fechaHora || "",
      apellido: reqPositivo?.apellido || "",
      nombres: reqPositivo?.nombres || "",
      alias: reqPositivo?.alias || "",
      tipoDoc: reqPositivo?.tipoDoc || "",
      numeroDni: reqPositivo?.numeroDni || "",
      motivoEgreso: reqPositivo?.motivoEgreso || "",
      lpu: reqPositivo?.lpu || "",
      fechaIngreso: reqPositivo?.fechaHoraIng
        ? new Date(reqPositivo.fechaHoraIng).toISOString()
        : "",
      fechaEgreso: reqPositivo?.fechaEgreso || "",
      fechaNacimiento: reqPositivo?.fechaNacimiento || "",
      edad: reqPositivo?.edad_ing || "",
      prensa: reqPositivo?.prensa || "",
      observacion: reqPositivo?.observacion || "",
      registraantecedentespf: reqPositivo?.registraantecedentespf || "",
      nacionalidad: reqPositivo?.nacionalidad,
      ubicacionMap: reqPositivo?.ubicacionMap || "",
      sitProc: reqPositivo?.sitProc || "",
      num_causa: reqPositivo?.numeroCausa || "",
      establecimiento: reqPositivo?.establecimiento || "",
      domicilios: reqPositivo?.domicilios || "",
      juzgados: reqPositivo?.juzgados || "",
      numeroCausa: reqPositivo?.numeroCausa || "",
      electrodomesticos: reqPositivo?.electrodomesticos || [],
    },
  });

  const handleSelectInterno = (interno: Ingreso) => {
    console.log("Interno recibido en el formulario:", interno);
    autocompleteForm(interno, setValue);
    setIsBuscarInternoModalOpen(false);
  };

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sexo, setSexo] = useState<string>(reqPositivo?.sexo || "");
  const [observacion, setobservacion] = useState<string>(
    reqPositivo?.observacion || ""
  );
  const [motivoEgreso, setMotivoEgreso] = useState<string>(
    reqPositivo?.motivoEgreso || ""
  );
  const [registraAntecedenteSPF, setRegistraAntecedenteSPF] = useState<string>(
    reqPositivo?.registraantecedentespf || ""
  );
  const [prensa, setPrensa] = useState<string>(reqPositivo?.prensa || "");

  const [nacionalidad, setNacionalidad] = useState<string>(
    reqPositivo?.nacionalidad || ""
  );
  const [ubicacionMap, setUbicacionMap] = useState<string>(
    reqPositivo?.ubicacionMap || ""
  );
  const [imagen, setImagen] = useState<string | null>(
    reqPositivo?.imagen || null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapaModalOpen, setIsMapaModalOpen] = useState(false);
  const [fechaIngreso, setFechaIngreso] = useState<string>(
    reqPositivo?.fechaHoraIng
      ? new Date(reqPositivo.fechaHoraIng).toISOString()
      : ""
  );
  const [fechaEgreso, setFechaEgreso] = useState<string>(
    reqPositivo?.fechaEgreso || ""
  );
  const [fechaNacimiento, setFechaNacimiento] = useState<string>(
    reqPositivo?.fechaNacimiento || ""
  );
  const [domicilios, setDomicilios] = useState<Domicilio[]>(() => {
    if (reqPositivo?.domicilios) {
      return reqPositivo.domicilios
        .split(", ")
        .map((domicilio: string) => ({ domicilio }));
    }
    return [];
  });
  const [isDomiciliosModalOpen, setIsDomiciliosModalOpen] = useState(false);
  const [selectedJuzgados, setSelectedJuzgados] = useState<string[]>(() => {
    if (reqPositivo?.juzgados) {
      return reqPositivo.juzgados.split(", ");
    }
    return [];
  });
  const [fechaHora, setFechaHora] = useState<string>(
    reqPositivo?.fechaHora || ""
  );
  const [selectedElectrodomesticos, setSelectedElectrodomesticos] = useState<
    Electrodomestico[]
  >([]);
  const [selectedCausas, setSelectedCausas] = useState<Causa[]>(
    reqPositivo?.numeroCausa ? [{ num_causa: reqPositivo.numeroCausa }] : []
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    reqPositivo?.establecimiento || ""
  );
  const [tipoDoc, setTipoDoc] = useState<string>(reqPositivo?.tipoDoc || "");
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
    fechaHora: "Fecha y hora de evento",
    apellido: "Apellido",
    nombres: "Nombres",
  };

  const requiredFields = [
    "establecimiento",
    "fechaHora",
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
    // Validar errores de formato
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
        numeroDni: data.numeroDni,
        lpu: data.lpu,
        edad_ing: data.edad,
        establecimiento: data.establecimiento,
        motivoEgreso: data.motivoEgreso,
        nacionalidad: data.nacionalidad,
        domicilios: domiciliosString,
        sitProc: data.sitProc,
        ubicacionMap: data.ubicacionMap,
        juzgados: juzgadosString,
        numeroCausa: numeroCausa,
        electrodomesticos: electrodomesticosString,
        sexo: data.sexo,
        prensa: data.prensa,
        observacion: data.observacion,
        registraantecedentespf: data.registraantecedentespf,
        email: user?.email,
      };

      if (data.fechaHora) {
        payload.fechaHora = data.fechaHora;
      }
      if (data.fechaNacimiento) {
        payload.fechaNacimiento = data.fechaNacimiento;
      }
      if (data.fechaEgreso) {
        payload.fechaEgreso = data.fechaEgreso;
      }
      if (data.fechaIngreso) {
        payload.fechaHoraIng = new Date(data.fechaIngreso).toISOString();
      }

      if (params?.id) {
        response = await updateReqpositivo(params.id, payload);
      } else {
        response = await createReqpositivo(payload);
      }

      const mensajeTitulo = params.id
        ? "Actualización de Respuesta de Requerimiento: Positivo"
        : "Creación de Respuesta de Requerimiento: Positivo";

      if (response.success) {
        await ShowReqpositivos(response.success, mensajeTitulo, payload);
        generatePDF(payload, imagen); // Generar el PDF después de guardar los datos
        router.push("/portal/eventos/reqpositivos");
      } else {
        console.error(
          "Error al crear o actualizar requerimiento positivo:",
          response.error
        );
        await ShowReqpositivos(false, "Error", payload);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      await ShowReqpositivos(false, "Error", {});
    } finally {
      setIsSubmitting(false); // Desbloquear el botón al finalizar
    }
  };
  const goToReqPositivos = () => {
    router.push("/portal/eventos/reqpositivos");
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
        onClick={() => setIsBuscarInternoModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Buscar Interno
      </Button>

      {/* Modal de búsqueda de internos */}
      <BuscarInternoModal
        isOpen={isBuscarInternoModalOpen}
        onClose={() => setIsBuscarInternoModalOpen(false)}
        onSelect={handleSelectInterno}
      />
        <Button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Cargar imagen rostro
        </Button>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mt-0 !m-0">
            <div className="bg-white p-6 rounded-lg shadow-lg w-100">
              <h2 className="text-xl font-semibold mb-4">Recortar Imagen</h2>
              <ProfileImageCropper
                onImageCropped={(croppedImage: string) => {
                  setImagen(croppedImage);
                  setIsModalOpen(false);
                }}
              />
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
        {imagen && (
          <div className="mt-4">
            <Image
              src={imagen}
              alt="Imagen recortada"
              className="rounded-lg"
              id="imagenCortada"
              width={150}
              height={150}
            />
          </div>
        )}
        <FechaHoraEvento
          value={fechaHora}
          onChange={(value: string) => {
            setFechaHora(value);
            setValue("fechaHora", value);
          }}
        />
<FechaDeIngresoReqPos
  value="2024-07-15T00:00:00.000Z" // Fecha fija para pruebas
  onChange={(value: string) => {
    setFechaIngreso(value);
    setValue("fechaIngreso", value);
  }}
/>
        <FechaDeEgreso
          value={fechaEgreso}
          onChange={(value: string) => {
            setFechaEgreso(value);
            setValue("fechaEgreso", value);
          }}
        />
        <Textarea
          id="motivoEgreso"
          value={motivoEgreso}
          onChange={(value) => {
            setMotivoEgreso(value);
            setValue("motivoEgreso", value);
          }}
          label="Motivo de egreso"
          placeholder="Escribe Motivo de egreso aquí..."
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
        <SelectSexo
          value={sexo}
          onChange={(value) => {
            setSexo(value);
            setValue("sexo", value);
          }}
        />
        <RegistraAntecedenteSPFSelect
          value={registraAntecedenteSPF}
          onChange={(value: string) => {
            setRegistraAntecedenteSPF(value);
            setValue("registraantecedentespf", value);
          }}
        />
        <InputField register={register} name="lpu" label="L.P.U" />
        <SelectSituacionProcesal
          value={reqPositivo?.sitProc || ""}
          onChange={(value) => {
            setValue("sitProc", value);
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
        <SelectNacionalidad
          value={nacionalidad}
          onChange={(value) => {
            setNacionalidad(value);
            setValue("nacionalidad", value);
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
          initialElectrodomesticos={reqPositivo?.electrodomesticos || ""}
          onSelect={(selectedElectrodomesticos: Electrodomestico[]) => {
            setSelectedElectrodomesticos(selectedElectrodomesticos);
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
        <SelectSexo
          value={sexo}
          onChange={(value) => {
            setSexo(value);
            setValue("sexo", value);
          }}
        />
        <Textarea
          id="prensa"
          value={prensa}
          onChange={(value) => {
            setPrensa(value);
            setValue("prensa", value);
          }}
          label="Prensa"
          placeholder="Detalla Prensa aquí..."
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
          <Button
            type="button"
            onClick={goToReqPositivos}
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
