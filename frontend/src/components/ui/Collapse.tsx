// frontend\src\components\ui\Collapse.tsx
import React, { useState } from "react";
import "@/../public/css/Collapse.css";

interface CollapseProps {
  title: string;
  children: React.ReactNode;
  isOpenByDefault?: boolean; // Nueva propiedad para controlar el estado inicial
}

const Collapse: React.FC<CollapseProps> = ({ title, children, isOpenByDefault = false }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="collapse-container">
      <div className="collapse-header" onClick={toggleCollapse}>
        <span>{title}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && <div className="collapse-content">{children}</div>}
    </div>
  );
};

export default Collapse;