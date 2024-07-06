import { TreeStructure } from "../MultiFileEditor/MultiFileEditor";

export default interface GameWindow {
  ingestMessage?(obj: any, sendInput: (x: string) => void): void;
  setDimensions?(width: number, height: number): void;
  getPythonPreamble?(): TreeStructure;
  setStdout?(stdout: string): void;
  resetWindow?(self: any): void;
  terminalDisabled?: boolean;
}
