import { Solution } from "./Solution";
import { Step } from "./Step";
import { Figure } from "./Figure";
import { Warning } from "./Warning";
import { StopIf } from "./StopIf";
import { AdSlot } from "../AdSlot";

function AdBetween() {
  return <AdSlot position="inArticle" />;
}

export const mdxComponents = {
  Solution,
  Step,
  Figure,
  Warning,
  StopIf,
  AdBetween,
};
