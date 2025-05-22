import { title } from "@/components/primitives";
import React from "react";

function Title({ titre, description }: { titre: string; description: string }) {
  return (
    <>
      <h2 className={title({ color: "violet", size: "md" })}>{titre}</h2>
      <p className="text-lg">{description}</p>
    </>
  );
}

export default Title;
