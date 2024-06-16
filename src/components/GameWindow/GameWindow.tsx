export default interface GameWindow {
  ingestMessage(obj: any): void;
  setDimensions(width: number, height: number): void;
  getPythonPreamble(): string;
}
