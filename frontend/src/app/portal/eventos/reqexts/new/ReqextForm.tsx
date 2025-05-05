"use client";
import { Button } from "@/components/ui/button";
import { validateRequiredFields, validateEmptyFields } from "../../../../utils/validationUtils";
import { excludedFields } from "../../../../utils/excludedFields";
import Textarea from "@/components/ui/Textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import WatermarkBackground from "@/components/WatermarkBackground";
import { createReqext, updateReqext } from "../Reqexts.api";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";

import InternosInvolucradosSimple from "@/components/ui/InternosInvolucradosSimple";
import FechaHoraEvento from "@/components/ui/FechaHoraEvento";
import FechaHoraContestacion from "@/components/ui/FechaHoraContestacion";

import { InputFieldNota } from "@/components/ui/inputs/InputFieldNota";
import { useUserStore } from "@/lib/store";
import { ShowReqexts, showCancelAlert } from "../../../../utils/alertUtils";
import Toggle from "@/components/ui/Toggle";
import PhotosEvModal from "@/components/ui/MultimediaModals/PhotosEvModal";
import PdfModal from "@/components/ui/MultimediaModals/PdfModal";
import WordModal from "@/components/ui/MultimediaModals/WordModal";

interface FormValues {
  [key: string]: string;
  nota: string;
  fechaHora: string;
  observacion: string;
  organismo_requiriente: string;
  causa: string;
  internosinvolucrado2: string;
  internosinvolucradoSimple: string;
  contestacion: string;
  estado: string;
}

interface Interno {
  nombreApellido: string;
  alias: string;
  lpu: string;
  lpuProv: string;
  sitProc: string;
  detalle: string;
}

export function ReqextForm({ reqexts }: { reqexts: any }) {
  const { handleSubmit, setValue, register, reset, watch } =
    useForm<FormValues>({
      defaultValues: {
        fechaHora: reqexts?.fechaHora || "",
        fechaHoraContestacion: reqexts?.fechaHoraContestacion || "",
        observacion: reqexts?.observacion || "",
        contestacion: reqexts?.contestacion || "",
        causa: reqexts?.causa || "",
        internosinvolucrado2: reqexts?.internosinvolucrado2 || "",
        organismo_requiriente: reqexts?.organismo_requiriente || "",
        internosinvolucradoSimple: JSON.stringify(
          reqexts?.internosinvolucradoSimple || []
        ),
        nota: reqexts?.nota || "",
        estado: reqexts?.estado === "Cerrado" ? "Cerrado" : "Abierto",
        imagen: reqexts?.imagen || "",
        imagenDer: reqexts?.imagenDer || "",
        imagenIz: reqexts?.imagenIz || "",
        imagenDact: reqexts?.imagenDact || "",
        imagenSen1: reqexts?.imagenSen1 || "",
        imagenSen2: reqexts?.imagenSen2 || "",
        imagenSen3: reqexts?.imagenSen3 || "",
        imagenSen4: reqexts?.imagenSen4 || "",
        imagenSen5: reqexts?.imagenSen5 || "",
        imagenSen6: reqexts?.imagenSen6 || "",
        pdf1: reqexts?.pdf1 || "",
        pdf2: reqexts?.pdf2 || "",
        pdf3: reqexts?.pdf3 || "",
        pdf4: reqexts?.pdf4 || "",
        pdf5: reqexts?.pdf5 || "",
        pdf6: reqexts?.pdf6 || "",
        pdf7: reqexts?.pdf7 || "",
        pdf8: reqexts?.pdf8 || "",
        pdf9: reqexts?.pdf9 || "",
        pdf10: reqexts?.pdf10 || "",
        word1: reqexts?.word1 || "",
      },
    });

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fechaHoraContestacion, setFechaHoraContestacion] = useState<string>(
    reqexts?.fechaHoraContestacion || ""
  );

  const [fechaHora, setFechaHora] = useState<string>(reqexts?.fechaHora || "");
  const [observacion, setObservacion] = useState<string>(
    reqexts?.observacion || ""
  );
  const [contestacion, setContestacion] = useState<string>(
    reqexts?.contestacion || ""
  );
  const [causa, setCausa] = useState<string>(reqexts?.causa || "");
  const [internosinvolucrado2, setInternosinvolucrado2] = useState<string>(
    reqexts?.internosinvolucrado2 || ""
  );
  const [organismo_requiriente, setOrganismo_requiriente] = useState<string>(
    reqexts?.organismo_requiriente || ""
  );

  const [selectedInternosSimple, setSelectedInternosSimple] = useState<
    Interno[]
  >(() => {
    try {
      if (reqexts?.internosinvolucradoSimple) {
        return JSON.parse(reqexts.internosinvolucradoSimple);
      }
    } catch (error) {}
    return [];
  });

  const [estado, setEstado] = useState<boolean>(reqexts?.estado === "Cerrado");

  const [imagen, setImagen] = useState<string | null>(
    reqexts?.imagen
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.imagen}`
      : null
  );
  const [imagenDer, setImagenDer] = useState<string | null>(
    reqexts?.imagenDer
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.imagenDer}`
      : null
  );
  const [imagenIz, setImagenIz] = useState<string | null>(
    reqexts?.imagenIz
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.imagenIz}`
      : null
  );
  const [imagenDact, setImagenDact] = useState<string | null>(
    reqexts?.imagenDact
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.imagenDact}`
      : null
  );
  const [imagenSen1, setImagenSen1] = useState<string | null>(
    reqexts?.imagenSen1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.imagenSen1}`
      : null
  );
  const [imagenSen2, setImagenSen2] = useState<string | null>(
    reqexts?.imagenSen2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.imagenSen2}`
      : null
  );
  const [imagenSen3, setImagenSen3] = useState<string | null>(
    reqexts?.imagenSen3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.imagenSen3}`
      : null
  );
  const [imagenSen4, setImagenSen4] = useState<string | null>(
    reqexts?.imagenSen4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.imagenSen4}`
      : null
  );
  const [imagenSen5, setImagenSen5] = useState<string | null>(
    reqexts?.imagenSen5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.imagenSen5}`
      : null
  );
  const [imagenSen6, setImagenSen6] = useState<string | null>(
    reqexts?.imagenSen6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.imagenSen6}`
      : null
  );
  const [pdf1, setPdf1] = useState<string | null>(
    reqexts?.pdf1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.pdf1}`
      : null
  );
  const [pdf2, setPdf2] = useState<string | null>(
    reqexts?.pdf2
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.pdf2}`
      : null
  );
  const [pdf3, setPdf3] = useState<string | null>(
    reqexts?.pdf3
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.pdf3}`
      : null
  );
  const [pdf4, setPdf4] = useState<string | null>(
    reqexts?.pdf4
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.pdf4}`
      : null
  );
  const [pdf5, setPdf5] = useState<string | null>(
    reqexts?.pdf5
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.pdf5}`
      : null
  );
  const [pdf6, setPdf6] = useState<string | null>(
    reqexts?.pdf6
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.pdf6}`
      : null
  );
  const [pdf7, setPdf7] = useState<string | null>(
    reqexts?.pdf7
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.pdf7}`
      : null
  );
  const [pdf8, setPdf8] = useState<string | null>(
    reqexts?.pdf8
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.pdf8}`
      : null
  );
  const [pdf9, setPdf9] = useState<string | null>(
    reqexts?.pdf9
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.pdf9}`
      : null
  );
  const [pdf10, setPdf10] = useState<string | null>(
    reqexts?.pdf10
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.pdf10}`
      : null
  );
  const [word1, setWord1] = useState<string | null>(
    reqexts?.word1
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reqexts/uploads/${reqexts.word1}`
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
    return `/api/reqexts/uploads/${imagePath.split("/").pop()}`;
  };

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // Definir la función getPdfUrl
  const getPdfUrl = (pdfPath: string) => {
    return `/api/reqexts/uploads/${pdfPath.split("/").pop()}`;
  };

  const [isWordOpen, setIsWordOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
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
        router.push("/api/auth/login");
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser, router]);

  const fieldLabels: Record<string, string> = {
    fechaHora: "Fecha y hora de evento",
  };

  const requiredFields = ["fechaHora"];
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
        causa: data.causa,
        nota: data.nota,
        estado: data.estado || "Abierto",
        fechaHora: data.fechaHora || null,
        observacion: data.observacion,
        email: user?.email,
        contestacion: data.contestacion || null,
      };

      // Solo incluir fechaHoraContestacion si está presente
      if (data.fechaHoraContestacion) {
        payload.fechaHoraContestacion = data.fechaHoraContestacion;
      }
      if (data.internosinvolucrado) {
        payload.internosinvolucrado = data.internosinvolucrado;
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
        response = await updateReqext(params.id, formData);
      } else {
        response = await createReqext(formData);
      }

      const mensajeTitulo = params.id
        ? "Actualización de Requerimiento Externo"
        : "Creación de Requerimiento Externo";

      if (response.success) {
        await ShowReqexts(response.success, mensajeTitulo, {
          ...data,
          estado: estado ? "Cerrado" : "Abierto",
        });
        router.push("/portal/eventos/reqexts");
      } else {
        console.error(
          "Error al crear o actualizar requerimiento externo:",
          response.error
        );
        await ShowReqexts(false, "Error", payload);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      await ShowReqexts(false, "Error", {});
    } finally {
      setIsSubmitting(false); // Desbloquear el botón al finalizar
    }
  };

  const goToReqexts = () => {
    router.push("/portal/eventos/reqexts");
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
        <FechaHoraEvento
          value={fechaHora}
          onChange={(value: string) => {
            setFechaHora(value);
            setValue("fechaHora", value);
          }}
        />

        <InternosInvolucradosSimple
          initialInternos={selectedInternosSimple}
          onSelect={(value) => {
            setSelectedInternosSimple(value);
            setValue("internosinvolucradoSimple", JSON.stringify(value));
          }}
        />
        <Textarea
          id="internosinvolucrado2"
          value={internosinvolucrado2}
          onChange={(value) => {
            setInternosinvolucrado2(value);
            setValue("internosinvolucrado2", value);
          }}
          label="Internos sin buscador:"
          placeholder="Escribe Internos sin buscador aquí..."
        />
        <InputFieldNota register={register} label="Nota" />
        <Textarea
          id="organismo_requiriente"
          value={organismo_requiriente}
          onChange={(value) => {
            setOrganismo_requiriente(value);
            setValue("organismo_requiriente", value);
          }}
          label="Organismo Requiriente"
          placeholder="Escribe Organismo Requiriente aquí..."
        />
        <Textarea
          id="causa"
          value={causa}
          onChange={(value) => {
            setCausa(value);
            setValue("causa", value);
          }}
          label="Causa/s"
          placeholder="Escribe causa/s aquí..."
        />
        <FechaHoraContestacion
          value={fechaHoraContestacion}
          onChange={(value: string) => {
            setFechaHoraContestacion(value);
            setValue("fechaHoraContestacion", value);
          }}
        />
        <Textarea
          id="contestacion"
          value={contestacion}
          onChange={(value) => {
            setContestacion(value);
            setValue("contestacion", value);
          }}
          label="Contestación"
          placeholder="Escribe Contestación aquí..."
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
        <div className="flex items-center space-x-2">
          <span>Abierto</span>
          <Toggle
            id="estado"
            value={estado}
            onChange={(value) => {
              setEstado(value);
              setValue("estado", value ? "Cerrado" : "Abierto");
            }}
            label=""
          />
          <span>Cerrado</span>
        </div>
        <div className="flex space-x-4">
          <Button type="button" onClick={goToReqexts} className="bg-blue-500">
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
