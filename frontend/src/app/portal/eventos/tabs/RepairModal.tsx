"use client";
// frontend/src/app/portal/eventos/tabs/RepairModal.tsx
import Modal from "@/components/ui/Modal";

interface RepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function RepairModal({ isOpen, onClose, title, children }: RepairModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">{title}</h2>
      {children}
    </Modal>
  );
}
