//frontend\src\app\portal\eventos\redes\NetworkGraph.tsx
import React, { useEffect, useRef } from 'react';
import { Network, DataSet, Node, Edge } from 'vis-network/standalone';
import { downloadAsImage, downloadAsPDF, downloadAsExcel } from './DownloadUtils';
import { FaFileImage, FaFilePdf, FaFileExcel } from 'react-icons/fa';

interface NetworkGraphProps {
  filteredData: any[];
  prioritizedId: number | null;
  title: string;
  onClose: () => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ filteredData, prioritizedId, title, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (containerRef.current) {
      const nodes = new DataSet<Node>(
        filteredData.map((interno) => ({
          id: interno.id,
          label: `${interno.nombres} ${interno.apellido}\nLPU: ${interno.lpu}`,
          shape: 'circularImage',
          image: interno.imagen ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingresos/uploads/${interno.imagen}` : '/images/silueta.png',
          borderWidth: interno.id === prioritizedId ? 4 : 1,
          color: interno.id === prioritizedId ? { border: 'green' } : undefined,
          font: { size: 14, color: '#000000', bold: { color: '#000000' } }, // Asegura que el texto sea negrita y más grande
        }))
      );

      const edges = new DataSet<Edge>(
        filteredData
          .filter((interno) => interno.id !== prioritizedId)
          .map((interno) => ({
            from: prioritizedId as number, // Aseguramos que 'from' no sea null
            to: interno.id,
          }))
      );

      const data = { nodes, edges };
      const options = {
        nodes: {
          borderWidth: 1,
          size: 30, // Aumenta el tamaño de la imagen
          color: {
            border: '#222222',
            background: '#666666',
          },
          font: { size: 14, color: '#110505', bold: { color: '#000000' } }, // Asegura que el texto sea negrita y más grande
        },
        edges: {
          color: 'lightgray',
        },
        physics: {
          enabled: false, // Desactiva la física inicial para evitar movimientos estrambóticos
        },
      };

      const network = new Network(containerRef.current, data, options);

      // Centrar el nodo prioritario
      if (prioritizedId) {
        network.focus(prioritizedId, {
          scale: 1,
          animation: true,
        });
      }
    }
  }, [filteredData, prioritizedId]);

  const handleDownloadImage = () => {
    console.log('Descargando imagen...');
    downloadAsImage('network-graph', title.replace(/[^a-zA-Z0-9]/g, '_'), title);
  };

  const handleDownloadPDF = () => {
    console.log('Descargando PDF...');
    downloadAsPDF('network-graph', title.replace(/[^a-zA-Z0-9]/g, '_'), title);
  };

  const handleDownloadExcel = () => {
    console.log('Descargando Excel...');
    downloadAsExcel(filteredData, title.replace(/[^a-zA-Z0-9]/g, '_'));
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-white shadow-lg rounded-lg">
      <button
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
        onClick={onClose}
      >
        Cerrar
      </button>
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold mr-4">{title}</h2>
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white p-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
            onClick={handleDownloadImage}
          >
            <FaFileImage size={20} />
          </button>
          <button
            className="bg-green-500 text-white p-2 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
            onClick={handleDownloadPDF}
          >
            <FaFilePdf size={20} />
          </button>
          <button
            className="bg-green-800 text-white p-2 rounded-lg shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300"
            onClick={handleDownloadExcel}
          >
            <FaFileExcel size={20} />
          </button>
        </div>
      </div>
      <div id="network-graph" ref={containerRef} style={{ width: '100%', height: '80vh' }}></div>
    </div>
  );
};

export default NetworkGraph;