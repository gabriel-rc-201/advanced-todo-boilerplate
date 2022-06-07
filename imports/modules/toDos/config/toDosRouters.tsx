import React from "react";
import ToDosContainer from "../ui/pages/toDosContainer";
import { Recurso } from "./Recursos";

export const toDosRouterList = [
  {
    path: "/toDos/:screenState/:toDosId",
    component: ToDosContainer,
    isProtected: true,
    resources: [Recurso.EXEMPLO_VIEW],
  },
  {
    path: "/toDos/:screenState",
    component: ToDosContainer,
    isProtected: true,
    resources: [Recurso.EXEMPLO_CREATE],
  },
  {
    path: "/toDos",
    component: ToDosContainer,
    isProtected: true,
    resources: [Recurso.EXEMPLO_VIEW],
  },
];
