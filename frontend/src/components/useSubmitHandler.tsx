import { useState } from "react";
import { Alert } from "@/components/ui/alert";

export function useSubmitHandler() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitWithConfirmation = async (
    onSubmit: () => Promise<void>
  ) => {
    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas enviar el formulario?",
      icon: "warning",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    setIsSubmitting(true); // Bloquear el botón

    try {
      await onSubmit(); // Ejecutar la lógica de envío
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsSubmitting(false); // Desbloquear el botón
    }
  };

  return { isSubmitting, handleSubmitWithConfirmation };
}