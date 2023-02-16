import React from "react";
import AppAppBar from "../HomeFiles/AppAppBar";
import ProductHero from "../HomeFiles/ProductHero";
import TechStackInfo from "./techStackInfo";
import ProjectInfo from "./projectInfo";
import TeamInfo from "./teamInfo";
import AppFooter from "../HomeFiles/AppFooter";

export default function MediChain() {
  console.log("here");
  return (
    <React.Fragment>
      <AppAppBar />
      <ProductHero />
      <TechStackInfo />
      <ProjectInfo />
      <TeamInfo />
      <AppFooter />
    </React.Fragment>
  );
}
