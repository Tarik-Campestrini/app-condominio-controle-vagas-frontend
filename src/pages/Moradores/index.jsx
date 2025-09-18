import React from "react";
import ListaMoradores from "../../components/ListaMoradores";

export default function MoradoresPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestão de Moradores</h1>
      <ListaMoradores />
    </div>
  );
}
