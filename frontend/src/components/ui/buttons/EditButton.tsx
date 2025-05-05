// frontend/src/components/ui/buttons/EditButton.tsx

'use client';

import { useRouter } from 'next/navigation';

interface EditButtonProps {
  url: string;
}

const EditButton: React.FC<EditButtonProps> = ({ url }) => {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(url);
  };

  return (
    <button
      type="button"
      className="my-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
      onClick={handleEditClick}
    >
      Editar - Descargar
    </button>
  );
};

export default EditButton;