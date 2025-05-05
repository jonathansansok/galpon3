import { FaCompress } from "react-icons/fa";
import Modal from "react-modal";
import { CSSProperties } from "react";

interface ChartModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  title: string;
}

const customStyles: { content: CSSProperties } = {
  content: {
    top: '20px',
    left: '20px',
    right: '20px',
    bottom: '20px',
    margin: '0',
    padding: '20px', // Ajustar el padding para dejar espacio para el título
    width: 'auto',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 2147483647, // Mayor z-index posible
  },
};

const doughnutContainerStyles: CSSProperties = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: 'calc(100% - 60px)', // Reducir la altura del gráfico para dejar espacio para el título
};

const headerStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'center', // Centrar el contenido
  position: 'relative', // Posicionar el icono absolutamente
};

const iconStyles: CSSProperties = {
  position: 'absolute',
  left: '0',
  color: 'black',
  cursor: 'pointer',
};

const ChartModal = ({ isOpen, onRequestClose, children, title }: ChartModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Expand Chart"
    >
      <div style={doughnutContainerStyles}>
        <div style={headerStyles}>
          <FaCompress
            onClick={onRequestClose}
            style={iconStyles} // Asegurar que el color sea negro y agregar margen derecho
          />
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
        </div>
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default ChartModal;