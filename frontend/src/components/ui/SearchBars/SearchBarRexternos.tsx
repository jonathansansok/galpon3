// frontend/src/components/ui/SearchBars/SearchBarProcedimientos.tsx
"use client";

import { useState } from "react";
import Fuse from "fuse.js";
import { Reqext } from "@/types/Reqext"; // Importa la interfaz Procedimiento
import { ReqextSearchResult } from "@/types/SearchResult"; // Importa la interfaz ProcedimientoSearchResult

interface SearchBarProps {
  data: Reqext[];
  onSearchResults: (results: ReqextSearchResult[]) => void;
}

function normalizeString(str: string): string {
  return str.replace(/\./g, "").toLowerCase();
}

function formatDate(date: Date): string {
  return date.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
}

export function SearchBar({ data, onSearchResults }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const normalizedData = data.map((item) => {
    const normalizedItem: { [key: string]: any } = { ...item };
    for (const key in normalizedItem) {
      if (typeof normalizedItem[key] === "string") {
        normalizedItem[key] = normalizeString(normalizedItem[key]);
      } else if (normalizedItem[key] instanceof Date) {
        normalizedItem[key] = formatDate(normalizedItem[key]);
      }
    }
    // Agregar campos normalizados para fechas
    if (item.fechaHora) {
      normalizedItem.fechaHoraFormatted = formatDate(new Date(item.fechaHora));
    }
    return normalizedItem;
  });

  const fuse = new Fuse(normalizedData, {
    keys: [
      "email",
      "observacion",
      "fechaHoraFormatted",
    ],
    threshold: 0.3,
    ignoreLocation: true,
    ignoreFieldNorm: true,
  });

  const handleSearchClick = () => {
    if (query === "") {
      onSearchResults(data.map(item => ({ item, matches: [] })));
    } else {
      const normalizedQuery = normalizeString(query);
      const results = fuse.search(normalizedQuery).map(result => ({
        item: data[result.refIndex],
        matches: result.matches
      }));
      onSearchResults(results);
    }
  };
  return (
    <div className="w-full mb-4 flex items-start max-w-[900px]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar..."
        className="w-full max-w-[800px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
      />
      <button
        onClick={handleSearchClick}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-left"
      >
        Buscar
      </button>
    </div>
  );
}