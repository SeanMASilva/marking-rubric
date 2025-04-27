import type { Route } from "./+types/home";
import { RubricTree } from "../welcome/main";
export function meta({}) {
  return [
    { title: "Marking Rubric" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  
  return (
    <>
      <RubricTree/>
    </>
  );
}
