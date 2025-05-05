"use client";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createReqno, updateReqno } from "../Reqnos.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import Textarea from "@/components/ui/Textarea";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import RequeridoPorSelect from "@/components/ui/selects/RequeridoPorSelect";
import { ShowReqnos, showCancelAlert } from "../../../../utils/alertUtils";
import { useUserStore } from "@/lib/store";
import DatosFiliatoriosForm from "@/components/ui/DatosFiliatoriosForm"; // Importa el componente
import generatePDF from "@/app/utils/Reqnopdf"; // Importa la función para generar el PDF

interface FormValues {
  [key: string]: string;
}

interface DatosFiliatorios {
  apellido?: string;
  nombres?: string;
  tipoDoc?: string;
  numeroDni?: string;
  fechaNacimiento?: string;
  nacionalidad?: string;
  novedad?: string;
}

export function ReqnoForm({ reqno }: { reqno: any }) {
  const { handleSubmit, setValue, register, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      fechaHora: reqno?.fechaHora || "",
      observacion: reqno?.observacion || "",
      requerido_por: reqno?.requerido_por || "",
    },
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [observacion, setobservacion] = useState<string>(reqno?.observacion || "");
  const [fechaHora, setFechaHora] = useState<string>(reqno?.fechaHora || "");
  const [requeridoPor, setRequeridoPor] = useState<string>(reqno?.requerido_por || "");
  const [datosFiliatorios, setDatosFiliatorios] = useState<DatosFiliatorios[]>(() => {
    if (reqno?.datos_filiatorios) {
      return JSON.parse(reqno.datos_filiatorios);
    }
    return [];
  });
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

  useEffect(() => {
    if (reqno) {
      setValue("fechaHora", reqno.fechaHora || "");
      setValue("observacion", reqno.observacion || "");
      setValue("requerido_por", reqno.requerido_por || "");
    }
  }, [reqno, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
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
        fechaHora: data.fechaHora || null,
        observacion: data.observacion,
        requerido_por: data.requerido_por,
        email: user?.email,
        datos_filiatorios: JSON.stringify(datosFiliatorios),
      };

      if (params?.id) {
        response = await updateReqno(params.id, payload);
      } else {
        response = await createReqno(payload);
      }

      const mensajeTitulo = params.id
        ? "Actualización de Resp. de req. externo"
        : "Creación de Resp. de req. externo";

      if (response.success) {
        await ShowReqnos(response.success, mensajeTitulo, payload);
        generatePDF(payload); 
        router.push("/portal/eventos/reqnos");
      } else {
        console.error("Error al crear o actualizar evento:", response.error);
        await ShowReqnos(false, "Error", payload);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      await ShowReqnos(false, "Error", {});
    } finally {
      setIsSubmitting(false); 
    }
  };

  const addDatosFiliatorios = () => {
    setDatosFiliatorios([...datosFiliatorios, {} as DatosFiliatorios]);
  };

  const goToReqnos = () => {
    router.push("/portal/eventos/reqnos");
  };

  return (
    <form id="formulario" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-auto items-start">
        <FechaHoraEvento
          value={fechaHora}
          onChange={(value: string) => {
            setFechaHora(value);
            setValue("fechaHora", value);
          }}
        />
        <RequeridoPorSelect
          value={requeridoPor}
          onChange={(value) => {
            setRequeridoPor(value);
            setValue("requerido_por", value);
          }}
        />
        {datosFiliatorios.map((datos, index) => (
          <DatosFiliatoriosForm
            key={index}
            index={index}
            datos={datos}
            register={register}
            setValue={setValue}
            datosFiliatorios={datosFiliatorios}
            setDatosFiliatorios={setDatosFiliatorios}
            errors={errors} // Pasa los errores aquí
          />
        ))}
        <Button type="button" onClick={addDatosFiliatorios} className="bg-green-500 w-full">
          Agregar Registro
        </Button>
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
        <div className="flex space-x-4 col-span-2">
          <Button type="button" onClick={goToReqnos} className="bg-orange-500">
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