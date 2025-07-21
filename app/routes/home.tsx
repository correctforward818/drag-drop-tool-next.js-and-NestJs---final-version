import type { Route } from "./+types/home";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Builder from "../components/Builder/Builder";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Builder />
    </DndProvider>
  );
}
