// frontend/src/app/portal/eventos/riesgos/new/RiesgoForm.tsx
"use client";
import { autocompleteForm } from "@/app/utils/autocompleteUtils";
import { validateRequiredFields, validateEmptyFields, validateFieldFormats } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import BuscarInternoModal from "@/components/ui/BuscarInternoModal";
import { Ingreso } from "@/types/Ingreso";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createRiesgo, updateRiesgo } from "../Riesgos.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import ProfileImageCropper from "@/components/ui/ProfileImageCropper";
import Select from "@/components/ui/Select";
import SelectComp from "@/components/ui/SelectAnidaciones";
import FechaDePreingreso from "@/components/ui/FechaDePreingreso";
import { InputField } from "@/components/ui/InputField";
import { DomicilioMapaModal } from "@/components/ui/DomicilioMapaModal";
import { ElectrodomesticoSelector } from "@/components/ui/ElectrodomesticosSelector";
import ReevalToggle from "@/components/ui/Toggle";
import { CausasModal } from "@/components/ui/CausasModal";
import SelectSituacionProcesal from "@/components/ui/sitProc";
import { ShowRiesgos, showCancelAlert } from "../../../../utils/alertUtils";
import OrgCrimRolSelect from "@/components/ui/selects/OrgCrimRolSelect";
import RiesgoFugaSelect from "@/components/ui/selects/RiesgoFugaSelect";
import RiesgoConflSelect from "@/components/ui/selects/RiesgoConflSelect";
import SelectSexo from "@/components/ui/SelectSexo";
import generatePDF from "../../../../utils/Riesgopdf";
import { useUserStore } from "@/lib/store";
import { loadGoogleMaps } from "@/app/utils/googleMapsLoader";
import SelectCondicion from "@/components/ui/Condicion";

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

export function RiesgoForm({ riesgo }: { riesgo: any }) {
  const [isBuscarInternoModalOpen, setIsBuscarInternoModalOpen] = useState(false);
  const { handleSubmit, setValue, register } = useForm<FormValues>({
    defaultValues: {
      establecimiento: riesgo?.establecimiento || "",
      modulo_ur: riesgo?.modulo_ur || "",
      pabellon: riesgo?.pabellon || "",
      apellido: riesgo?.apellido || "",
      nombres: riesgo?.nombres || "",
      lpu: riesgo?.lpu || "",
      fechaHora: riesgo?.fechaHoraIng || "",
      observacion: riesgo?.observacion || "",
      ubicacionMap: riesgo?.ubicacionMap || "",
      sitProc: riesgo?.sitProc || "",
      num_causa: riesgo?.numeroCausa || "",
      electrodomesticos: riesgo?.electrodomesticos || [],
      orgCrim: riesgo?.orgCrim || "",
      cualorg: riesgo?.cualorg || "",
      rol: riesgo?.rol || "",
      atentados: riesgo?.atentados || "",
      allanamientos: riesgo?.allanamientos || "",
      secuestros: riesgo?.secuestros || "",
      restricciones: riesgo?.restricciones || "",
      riesgo_de_fuga: riesgo?.riesgo_de_fuga || "",
      riesgo_de_conf: riesgo?.riesgo_de_conf || "",
      infInd: riesgo?.infInd || "",
      fzaSeg: riesgo?.fzaSeg || "",
      sociedad: riesgo?.sociedad || "",
      territorio: riesgo?.territorio || "",
      enemistad: riesgo?.enemistad || "",
      condena: riesgo?.condena || "",
      sexo: riesgo?.sexo || "",
      reeval: riesgo?.reeval || "No",
      condicion: riesgo?.condicion || "",
    },
  });
  const handleSelectInterno = (interno: Ingreso) => {
    autocompleteForm(interno, setValue); // Llama a la función modularizada
    setIsBuscarInternoModalOpen(false); // Cierra el modal
  };
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedEstablecimiento, setSelectedEstablecimiento] =
    useState<string>(riesgo?.establecimiento || "");
  const [selectedModuloUr, setSelectedModuloUr] = useState<string>(
    riesgo?.modulo_ur || ""
  );
  const [sexo, setSexo] = useState<string>(riesgo?.sexo || "");
  const [reeval, setReeval] = useState<string>(riesgo?.reeval || "No");
  const [selectedPabellon, setSelectedPabellon] = useState<string>(
    riesgo?.pabellon || ""
  );
  const [condicion, setCondicion] = useState<string>(riesgo?.condicion || "");
  const [orgCrim, setOrgCrim] = useState<string>(riesgo?.orgCrim || "");
  const [cualorg, setCualorg] = useState<string>(riesgo?.cualorg || "");
  const [rol, setRol] = useState<string>(riesgo?.rol || "");

  const [observacion, setobservacion] = useState<string>(
    riesgo?.observacion || ""
  );
  const [atentados, setAtentados] = useState<string>(riesgo?.atentados || "");
  const [allanamientos, setAllanamientos] = useState<string>(
    riesgo?.allanamientos || ""
  );
  const [secuestros, setSecuestros] = useState<string>(
    riesgo?.secuestros || ""
  );
  const [restricciones, setRestricciones] = useState<string>(
    riesgo?.restricciones || ""
  );

  const [infInd, setInfInd] = useState<string>(riesgo?.infInd || "");

  const [fzaSeg, setFzaSeg] = useState<string>(riesgo?.fzaSeg || "");

  const [sociedad, setSociedad] = useState<string>(riesgo?.sociedad || "");

  const [condena, setCondena] = useState<string>(riesgo?.condena || "");
  const [enemistad, setEnemistad] = useState<string>(riesgo?.enemistad || "");
  const [territorio, setTerritorio] = useState<string>(
    riesgo?.territorio || ""
  );

  const [ubicacionMap, setUbicacionMap] = useState<string>(
    riesgo?.ubicacionMap || ""
  );
  const [imagen, setImagen] = useState<string | null>(riesgo?.imagen || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapaModalOpen, setIsMapaModalOpen] = useState(false);
  const [fechaHora, setfechaHora] = useState<string>(
    riesgo?.fechaHoraIng || ""
  );
  const [isDomiciliosModalOpen, setIsDomiciliosModalOpen] = useState(false);

  const [selectedElectrodomesticos, setSelectedElectrodomesticos] = useState<
    Electrodomestico[]
  >([]);
  const [selectedCausas, setSelectedCausas] = useState<Causa[]>(
    riesgo?.numeroCausa ? [{ num_causa: riesgo.numeroCausa }] : []
  );
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
  fechaHora: "Fecha y hora de informe",
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

    const electrodomesticosString = selectedElectrodomesticos
      .map(
        (electrodomestico) =>
          `${electrodomestico.Electrodomestico} (${electrodomestico.Norma}) - Tipo: ${electrodomestico["Tipo de Electrodomestico"]} - Detalle: ${electrodomestico.DetalleUser || ""}`
      )
      .join(", ");
    const numeroCausa = selectedCausas.map((causa) => causa.num_causa).join(", ");

    const payload: any = {
      apellido: data.apellido,
      nombres: data.nombres,
      lpu: data.lpu,
      sitProc: data.sitProc,
      establecimiento: data.establecimiento,
      modulo_ur: data.modulo_ur,
      pabellon: data.pabellon,
      fechaHora: data.fechaHora || null,
      ubicacionMap: data.ubicacionMap,
      numeroCausa: numeroCausa,
      electrodomesticos: electrodomesticosString,
      orgCrim: data.orgCrim,
      cualorg: data.cualorg,
      rol: data.rol,
      condicion: data.condicion,
      observacion: data.observacion,
      atentados: data.atentados,
      allanamientos: data.allanamientos,
      secuestros: data.secuestros,
      restricciones: data.restricciones,
      riesgo_de_fuga: data.riesgo_de_fuga,
      riesgo_de_conf: data.riesgo_de_conf,
      infInd: data.infInd,
      fzaSeg: data.fzaSeg,
      sociedad: data.sociedad,
      territorio: data.territorio,
      enemistad: data.enemistad,
      condena: data.condena,
      sexo: data.sexo,
      reeval: reeval,
      email: user?.email,
    };

    if (params?.id) {
      response = await updateRiesgo(params.id, payload);
    } else {
      response = await createRiesgo(payload);
    }

    const mensajeTitulo = params.id
      ? "Actualización de Eval. S.I.G.P.P.L.A.R."
      : "Creación de Eval. S.I.G.P.P.L.A.R.";

    if (response.success) {
      await ShowRiesgos(response.success, mensajeTitulo, payload);
      generatePDF(payload, imagen); // Generar el PDF después de guardar los datos
      router.push("/portal/eventos/riesgos");
    } else {
      console.error("Error al crear o actualizar riesgo:", response.error);
      await ShowRiesgos(false, "Error", payload);
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    await ShowRiesgos(false, "Error", {});
  } finally {
    setIsSubmitting(false); // Desbloquear el botón al finalizar
  }
};

  const goToPreingresos = () => {
    router.push("/portal/eventos/preingresos");
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
                  setImagen(croppedImage); // Guarda el contenido de la imagen recortada
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
              width={150}
              height={150}
            />
          </div>
        )}
                <SelectCondicion
          value={condicion}
          onChange={(value) => {
            setCondicion(value);
            setValue("condicion", value);
          }}
        />
        <ReevalToggle
          id="reeval"
          value={reeval === "Si"}
          onChange={(value) => {
            const stringValue = value ? "Si" : "No";
            setReeval(stringValue);
            setValue("reeval", stringValue);
          }}
          label="¿Reevaluación?"
        />
        <FechaDePreingreso
          value={fechaHora}
          onChange={(value: string) => {
            setfechaHora(value);
            setValue("fechaHora", value);
          }}
        />
        <InputField
          register={register}
          name="apellido"
          label="Apellido"
          placeholder=""
        />
        <InputField register={register} name="nombres" label="Nombres" />

        <InputField register={register} name="lpu" label="L.P.U" />
        <SelectSexo
          value={sexo}
          onChange={(value) => {
            setSexo(value);
            setValue("sexo", value);
          }}
        />
        <RiesgoFugaSelect
          value={riesgo?.riesgo_de_fuga || ""}
          onChange={(value) => {
            setValue("riesgo_de_fuga", value);
          }}
        />
        <SelectSituacionProcesal
          value={riesgo?.sitProc || ""}
          onChange={(value) => {
            setValue("sitProc", value);
          }}
        />
        <Textarea
          id="condena"
          value={condena}
          onChange={(value) => {
            setCondena(value);
            setValue("condena", value);
          }}
          label="Condena "
          placeholder="Escribe Condena aquí..."
        />
        <RiesgoConflSelect
          value={riesgo?.riesgo_de_conf || ""}
          onChange={(value) => {
            setValue("riesgo_de_conf", value);
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
            setValue("modulo_ur", value); // Asegúrate de usar setValue para actualizar el estado del formulario
          }}
          onPabellonChange={(value) => {
            setSelectedPabellon(value);
            setValue("pabellon", value); // Asegúrate de usar setValue para actualizar el estado del formulario
          }}
        />
        <OrgCrimRolSelect
          orgCrim={orgCrim}
          cualorg={cualorg}
          rol={rol}
          onChange={(orgCrim: string, cualorg: string, rol: string) => {
            setOrgCrim(orgCrim);
            setCualorg(cualorg);
            setRol(rol);
            setValue("orgCrim", orgCrim);
            setValue("cualorg", cualorg);
            setValue("rol", rol);
          }}
        />
        <Textarea
          id="territorio"
          value={territorio}
          onChange={(value) => {
            setTerritorio(value);
            setValue("territorio", value);
          }}
          label="Territorio"
          placeholder="Describe Territorio aquí..."
        />

        <Button
          type="button"
          onClick={() => setIsMapaModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Mapa de calor
        </Button>
        <CausasModal
          initialCausas={selectedCausas}
          onSelect={(selectedCausas) => {
            setSelectedCausas(selectedCausas);
            setValue(
              "num_causa", // Asegúrate de usar num_causa aquí
              selectedCausas.map((causa) => causa.num_causa).join(", ")
            );
          }}
        />

        <ElectrodomesticoSelector
          initialElectrodomesticos={riesgo?.electrodomesticos || ""}
          onSelect={(selectedElectrodomesticos: Electrodomestico[]) => {
            setSelectedElectrodomesticos(selectedElectrodomesticos);
          }}
        />

        {!params.id && <></>}
        <Textarea
          id="infInd"
          value={infInd}
          onChange={(value) => {
            setInfInd(value);
            setValue("infInd", value);
          }}
          label="Información Individual"
          placeholder="Escribe Información Individual aquí..."
        />
        <Textarea
          id="fzaSeg"
          value={fzaSeg}
          onChange={(value) => {
            setFzaSeg(value);
            setValue("fzaSeg", value);
          }}
          label="Fuerza de seguridad"
          placeholder="Escribe Fuerza de seguridad aquí..."
        />
        <Textarea
          id="sociedad"
          value={sociedad}
          onChange={(value) => {
            setSociedad(value);
            setValue("sociedad", value);
          }}
          label="Sociedad"
          placeholder="Describe Sociedad aquí..."
        />
        <Textarea
          id="enemistad"
          value={enemistad}
          onChange={(value) => {
            setEnemistad(value);
            setValue("enemistad", value);
          }}
          label="Enemistad"
          placeholder="Describe Enemistad aquí..."
        />

        <Textarea
          id="atentados"
          value={atentados}
          onChange={(value) => {
            setAtentados(value);
            setValue("atentados", value);
          }}
          label="Atentados"
          placeholder="Escribe los atentados aquí..."
        />
        <Textarea
          id="allanamientos"
          value={allanamientos}
          onChange={(value) => {
            setAllanamientos(value);
            setValue("allanamientos", value);
          }}
          label="Allanamientos"
          placeholder="Escribe los allanamientos aquí..."
        />
        <Textarea
          id="secuestros"
          value={secuestros}
          onChange={(value) => {
            setSecuestros(value);
            setValue("secuestros", value);
          }}
          label="Secuestros"
          placeholder="Escribe los secuestros aquí..."
        />
        <Textarea
          id="restricciones"
          value={restricciones}
          onChange={(value) => {
            setRestricciones(value);
            setValue("restricciones", value);
          }}
          label="Restricciones"
          placeholder="Escribe las restricciones aquí..."
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
