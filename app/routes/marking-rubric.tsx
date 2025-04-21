import type { Route } from "./+types/home";
import { RubricTree } from "../welcome/main";
import testRubric from "~/testRubric";
export function meta({}) {
  return [
    { title: "Marking Rubric" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  
  return (
    <>
      <RubricTree rubric={testRubric}/>
    </>
  );
}
