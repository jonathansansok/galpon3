"use client"
import { useState } from "react";

const HandleMine = (encryptedEmail: string): string => {
  return encryptedEmail
    .replace(/\^...\-/g, "@")
    .replace(/[a-zA-Z]/g, (c) =>
      String.fromCharCode(
        c.charCodeAt(0) - 10 < (c <= "Z" ? 65 : 97)
          ? c.charCodeAt(0) - 10 + 26
          : c.charCodeAt(0) - 10
      )
    )
    .replace(/[;:<=>?@A]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 11))
    .replace(/5/g, "_")
    .replace(/9/g, "-")
    .replace(/8/g, ".");
};
export default function PortalPage() {
  const [encryptedEmail, setEncryptedEmail] = useState("");
  const [decryptedEmail, setDecryptedEmail] = useState("");

  const handleDecrypt = () => {
    setDecryptedEmail(HandleMine(encryptedEmail));
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1 className="text-4xl font-bold mb-8">Desencriptar informe</h1>
      <input
        type="text"
        value={encryptedEmail}
        onChange={(e) => setEncryptedEmail(e.target.value)}
        className="block w-full max-w-md p-2.5 mb-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Ingrese el código encriptado"
      />
      <button
        onClick={handleDecrypt}
        className="w-full max-w-md text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Desencriptar
      </button>
      {decryptedEmail && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Correo desencriptado:</h2>
          <p className="text-gray-700">{decryptedEmail}</p>
        </div>
      )}
    </div>
  );
}