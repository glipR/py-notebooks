import { TreeStructure } from "../MultiFileEditor/MultiFileEditor";

export default interface GameWindow {
  ingestMessage(obj: any): void;
  setDimensions(width: number, height: number): void;
  getPythonPreamble(): TreeStructure;
}
