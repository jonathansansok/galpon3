// src/components/DeleteButton.tsx
"use client";

import { useState } from "react";

interface DeleteButtonProps {
  productId: string;
}

export default function DeleteButton({ productId }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?",
    );
    if (confirmDelete) {
      setIsDeleting(true);
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Product deleted successfully");
        window.location.reload();
      } else {
        alert("Error deleting product");
      }
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`text-red-600 hover:text-red-800 ${isDeleting ? "cursor-wait" : ""}`}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
