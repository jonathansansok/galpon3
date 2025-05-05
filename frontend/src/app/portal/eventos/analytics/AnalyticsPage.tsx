//frontend\src\app\portal\eventos\analytics\AnalyticsPage.tsx
"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaSync } from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getAllData } from "./Analytics.api";
import { eventosHumanizados } from "./eventosConfig";
import { BarChart, LineChart } from "./AnalyticsCharts";
import "@/../public/css/establecimientosPage.css";
import SearchAndFilter from "./SearchAndFilter";
import ToggleSwitch from "./ToggleSwitch";
import { FaExpandArrowsAlt } from "react-icons/fa"; // Importar el icono de expandir
import ChartModal from "./ChartModal"; // Importar el componente ChartModal

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ChartDataLabels
);

const MySwal = withReactContent(Swal);

interface EventData {
  establecimiento?: string;
  modulo_ur?: string;
  fechaHora?: string;
  pabellon?: string;
}

const AnalyticsPage = () => {
  const [showPercentage, setShowPercentage] = useState(false);
  const [data, setData] = useState<{ [key: string]: EventData[] }>({});
  const [filteredData, setFilteredData] = useState<{
    [key: string]: EventData[];
  }>({});
  const [isSearching, setIsSearching] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState("");
  const [selectedModuloUr, setSelectedModuloUr] = useState("");
  const [selectedPabellon, setSelectedPabellon] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [modalContent, setModalContent] = useState<React.ReactNode>(null); // Estado para el contenido del modal
  const [modalTitle, setModalTitle] = useState(""); // Estado para el título del modal

  useEffect(() => {
    const timer = setTimeout(() => Swal.close(), 5000);
    MySwal.fire({
      icon: "success",
      title: "Aviso",
      text: "Si desea saltear un filtro, déjelo vacío.",
      confirmButtonText: "Aceptar",
      allowEnterKey: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => clearTimeout(timer));
  }, []);

  const handleSearchByEstablecimiento = async () => {
    setIsSearching(true);
    const allData = await getAllData({
      startDate,
      endDate,
      establecimiento: selectedEstablecimiento,
    });
    setData(allData);
    setFilteredData(allData);
    setIsSearching(false);
  };

  const handleSearchByModuloUr = () => {
    const filtered = Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].filter(
        (item: EventData) => item.modulo_ur === selectedModuloUr
      );
      return acc;
    }, {} as { [key: string]: EventData[] });
    setFilteredData(filtered);
  };

  const handleSearchByPabellon = () => {
    const filtered = Object.keys(filteredData).reduce((acc, key) => {
      acc[key] = filteredData[key].filter(
        (item: EventData) => item.pabellon === selectedPabellon
      );
      return acc;
    }, {} as { [key: string]: EventData[] });
    setFilteredData(filtered);
  };

  const handleSearchByDate = () => {
    const filtered = Object.keys(filteredData).reduce((acc, key) => {
      acc[key] = filteredData[key].filter((item: EventData) => {
        const itemDate = item.fechaHora ? new Date(item.fechaHora) : null;
        return (
          (!startDate || (itemDate && itemDate >= startDate)) &&
          (!endDate || (itemDate && itemDate <= endDate))
        );
      });
      return acc;
    }, {} as { [key: string]: EventData[] });
    setFilteredData(filtered);
  };

  const handleShowAll = async () => {
    setIsSearching(true);
    const allData = await getAllData({ startDate, endDate });
    const filtered = Object.keys(allData).reduce((acc, key) => {
      acc[key] = allData[key].filter((item: EventData) => item.establecimiento);
      return acc;
    }, {} as { [key: string]: EventData[] });
    setFilteredData(filtered);
    setIsSearching(false);
  };

  const eventKeys = Object.keys(filteredData);
  const humanizedLabels = eventKeys.map(
    (key) => eventosHumanizados[key.toLowerCase()] || key
  );
  const datasetValues = eventKeys.map((key) => filteredData[key].length);

  const formatDate = (date?: Date) =>
    date
      ? date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

  const openModalWithContent = (content: React.ReactNode, title: string) => {
    setModalContent(content);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full px-4 py-6 mb-16  text-black">
      <h1 className="text-4xl font-bold mb-4">Eventos por establecimiento</h1>
      <SearchAndFilter
        isSearching={isSearching}
        startDate={startDate}
        endDate={endDate}
        selectedEstablecimiento={selectedEstablecimiento}
        selectedModuloUr={selectedModuloUr}
        selectedPabellon={selectedPabellon}
        setSelectedEstablecimiento={setSelectedEstablecimiento}
        setSelectedModuloUr={setSelectedModuloUr}
        setSelectedPabellon={setSelectedPabellon}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
<div className="flex flex-col mb-4">
  <div className="w-full border-t-4 border-gray-100 shadow-md pt-4 pb-4 mb-4">
    <div className="flex justify-start">
      {/* Botón Mostrar Todos */}
      <button
        onClick={handleShowAll}
        className="ml-2 px-4 py-2 bg-[rgba(140,240,182,0.9)] text-black rounded-lg text-left"
        disabled={isSearching}
      >
        {isSearching ? "Mostrando..." : "Mostrar todos"}
      </button>

      {/* Botón Refrescar Todo */}
      <button
        onClick={() => location.reload()}
        disabled={isSearching}
        className="ml-2 px-4 py-2 bg-[rgba(77,146,173,0.8)] text-black rounded-lg flex items-center"
      >
        <FaSync className="mr-2" />
        Refrescar todo
      </button>

      {selectedEstablecimiento && (
        <button
          onClick={handleSearchByEstablecimiento}
          className="ml-2 px-4 py-2 bg-[rgba(172,93,97,0.9)] text-black rounded-lg text-left"
          disabled={isSearching}
        >
          {isSearching ? "Filtrando..." : "Filtrar por Establecimiento"}
        </button>
      )}
      {selectedEstablecimiento && (
        <button
          onClick={handleSearchByModuloUr}
          className="ml-2 px-4 py-2 bg-[rgba(173,216,230,0.9)] text-black rounded-lg text-left"
          disabled={isSearching || !selectedEstablecimiento}
        >
          {isSearching ? "Filtrando..." : "Filtrar por Módulo - U.R."}
        </button>
      )}
      {selectedModuloUr && (
        <button
          onClick={handleSearchByPabellon}
          className="ml-2 px-4 py-2 bg-[rgba(221,160,221,0.9)] text-black rounded-lg text-left"
          disabled={isSearching || !selectedModuloUr}
        >
          {isSearching ? "Filtrando..." : "Filtrar por Pabellon"}
        </button>
      )}
      {selectedPabellon && (
        <button
          onClick={handleSearchByDate}
          className="ml-2 px-4 py-2 bg-[rgba(144,238,144,0.9)] text-black rounded-lg text-left"
          disabled={isSearching || !selectedPabellon}
        >
          {isSearching ? "Filtrando..." : "Filtrar por Fecha"}
        </button>
      )}
    </div>
  </div>
</div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
        <div className="p-4 rounded-lg shadow-lg mb-4">
          <div className="flex items-center mb-4">
            <FaExpandArrowsAlt
              className="cursor-pointer text-black mr-2"
              onClick={() =>
                openModalWithContent(
                  <BarChart
                    labels={humanizedLabels}
                    dataValues={datasetValues}
                    showPercentage={showPercentage}
                  />,
                  `Barras: ${selectedEstablecimiento} - ${selectedModuloUr} - ${selectedPabellon} - ${formatDate(
                    startDate
                  )} - ${formatDate(endDate)}`
                )
              }
            />
            <h2 className="text-2xl font-bold mb-0">
              Barras: {selectedEstablecimiento} - {selectedModuloUr} -{" "}
              {selectedPabellon} - {formatDate(startDate)} -{" "}
              {formatDate(endDate)}
            </h2>
          </div>
          <BarChart
            labels={humanizedLabels}
            dataValues={datasetValues}
            showPercentage={showPercentage}
          />
        </div>
        <div className="p-4 rounded-lg shadow-lg mb-4">
          <div className="flex items-center mb-4">
            <FaExpandArrowsAlt
              className="cursor-pointer text-black mr-2"
              onClick={() =>
                openModalWithContent(
                  <LineChart
                    labels={humanizedLabels}
                    dataValues={datasetValues}
                    showPercentage={showPercentage}
                  />,
                  `Lineas: ${selectedEstablecimiento} - ${selectedModuloUr} - ${selectedPabellon} - ${formatDate(
                    startDate
                  )} - ${formatDate(endDate)}`
                )
              }
            />
            <h2 className="text-2xl font-bold mb-0">
              Lineas: {selectedEstablecimiento} - {selectedModuloUr} -{" "}
              {selectedPabellon} - {formatDate(startDate)} -{" "}
              {formatDate(endDate)}
            </h2>
          </div>
          <LineChart
            labels={humanizedLabels}
            dataValues={datasetValues}
            showPercentage={showPercentage}
          />
        </div>
      </div>
      <ChartModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </ChartModal>
    </div>
  );
};

export default AnalyticsPage;
