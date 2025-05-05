
//frontend\src\components\ui\alert.tsx
"use client"; // Necesario porque se utiliza SweetAlert2 (basado en el DOM)

import Swal from "sweetalert2";

interface AlertProps {
  title: string;
  text?: string;
  icon?: "success" | "error" | "warning" | "info" | "question";
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  preConfirm?: () => void;
}

// Función alternativa para copiar texto al portapapeles
function unsecuredCopyToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
}

// Componente reutilizable para mostrar alertas
export const Alert = {
  // Método confirmación
  confirm: async ({
    title,
    text = "",
    icon = "warning",
    showCancelButton = true,
    confirmButtonText = "Confirmar",
    cancelButtonText = "Cancelar",
  }: AlertProps) => {
    return await Swal.fire({
      title,
      text,
      icon,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
    });
  },

  // Éxito genérico con botón de copiar
  success: async ({
    title,
    text = "",
    confirmButtonText = "Aceptar",
    preConfirm,
  }: AlertProps) => {
    const result = await Swal.fire({
      title,
      html: `${text}<br><button id="copy-btn" class="swal2-confirm swal2-styled bg-green-500">Copiar para mensajería</button>`,
      icon: "success",
      confirmButtonText,
      didOpen: () => {
        // El evento de clic en el botón se maneja aquí, asegurándonos de que la alerta ya esté abierta
        const copyButton = document.getElementById("copy-btn");
        if (copyButton) {
          copyButton.addEventListener("click", () => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(text).then(() => {
                Swal.fire(
                  "¡Copiado!",
                  "El contenido ha sido copiado al portapapeles.",
                  "success"
                );
              }).catch((error) => {
                Swal.fire(
                  "Error",
                  "No se pudo copiar al portapapeles",
                  "error"
                );
                console.error("Error al copiar al portapapeles:", error);
              });
            } else {
              unsecuredCopyToClipboard(text);
              Swal.fire(
                "¡Copiado!",
                "El contenido ha sido copiado al portapapeles.",
                "success"
              );
            }
          });
        }
      },
    });

    return result;
  },

  // Error genérico
  error: ({ title, text = "", confirmButtonText = "Aceptar" }: AlertProps) => {
    Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonText,
    });
  },

  // Información genérica
  info: ({ title, text = "", confirmButtonText = "Aceptar" }: AlertProps) => {
    Swal.fire({
      title,
      text,
      icon: "info",
      confirmButtonText,
    });
  },

  // Advertencia genérica
  warning: ({ title, text = "", confirmButtonText = "Aceptar" }: AlertProps) => {
    Swal.fire({
      title,
      text,
      icon: "warning",
      confirmButtonText,
    });
  },
};