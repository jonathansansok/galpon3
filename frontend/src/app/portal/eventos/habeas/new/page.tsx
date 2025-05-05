///frontend\src\app\portal\eventos\habeas\new\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HabeaForm } from "./HabeaForm";
import { getHabea } from "../habeas.api";

interface Props {
  params: {
    id?: string;
  };
}

async function HabeaesNewPage({ params }: Props) {
  const { id } = await params;
  let habea = null;
  if (id) {
    habea = await getHabea(id);
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Habeas Corpus" : "Crear Habeas Corpus"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HabeaForm habeas={habea} />
        </CardContent>
      </Card>
    </div>
  );
}

export default HabeaesNewPage;