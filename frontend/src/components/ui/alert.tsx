
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

  // Éxito con botón de WhatsApp adicional (camino separado al de copiar)
  successWithContact: async ({
    title,
    text = "",
    phone = "",
    confirmButtonText = "Aceptar",
  }: AlertProps & { phone?: string }) => {
    // Normalizar número argentino a formato internacional para wa.me
    const normalizeArgPhone = (raw: string): string => {
      const d = raw.replace(/\D/g, "");
      if (!d) return "";
      if (d.startsWith("54") && d.length >= 12) return d;          // ya tiene código país
      if (d.startsWith("0") && d.length === 11) return `549${d.slice(1)}`; // 0XXXXXXXXXX
      if (d.length === 10) return `549${d}`;                        // XXXXXXXXXX local
      return d;
    };
    const cleanPhone = normalizeArgPhone(phone ?? "");
    // WA URL tiene límite ~2000 chars en total; truncamos el mensaje a 1500 para ser conservadores
    const waText = text.length > 1500 ? text.slice(0, 1497) + "..." : text;
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`
      : "";

    const waButtonHtml = waUrl
      ? `<button id="wa-btn" class="swal2-confirm swal2-styled" style="background-color:#25D366;margin-top:6px">📲 Enviar por WhatsApp</button>`
      : "";

    const result = await Swal.fire({
      title,
      html: `${text}<br><button id="copy-btn" class="swal2-confirm swal2-styled" style="background-color:#22c55e;margin-top:6px">Copiar para mensajería</button>${waButtonHtml}`,
      icon: "success",
      confirmButtonText,
      didOpen: () => {
        const copyBtn = document.getElementById("copy-btn");
        if (copyBtn) {
          copyBtn.addEventListener("click", () => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(text).then(() => {
                Swal.fire("¡Copiado!", "El contenido ha sido copiado al portapapeles.", "success");
              }).catch(() => {
                unsecuredCopyToClipboard(text);
                Swal.fire("¡Copiado!", "El contenido ha sido copiado al portapapeles.", "success");
              });
            } else {
              unsecuredCopyToClipboard(text);
              Swal.fire("¡Copiado!", "El contenido ha sido copiado al portapapeles.", "success");
            }
          });
        }
        const waBtn = document.getElementById("wa-btn");
        if (waBtn && waUrl) {
          waBtn.addEventListener("click", () => {
            window.open(waUrl, "_blank");
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