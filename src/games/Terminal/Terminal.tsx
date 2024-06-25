import React from 'react';
import styles from './Terminal.module.css';

interface TerminalState {
  stdout: string;
  width: number;
  height: number;
}

interface TerminalProps {
}

export default class Terminals extends React.Component<TerminalProps, TerminalState> {

  constructor(props: TerminalProps) {
    super(props)
    this.state = {
      stdout: "",
      width: 10,
      height: 10,
    };
  }

  terminalDisabled = true;

  setStdout(stdout: string) {
    this.setState({ stdout });
    const term = document.getElementsByClassName(styles.terminal)[0];
    setTimeout(() => term.scrollTo(0, term.scrollHeight), 10);
  }

  setDimensions(width: number, height: number):void {
    this.setState({ width, height });
  }

  render() {
    const { stdout, width, height } = this.state;
    return (
      <div className={styles.terminal} style={{width, height}}>
        <code className={styles.terminal_code}>
        {stdout}
        </code>
      </div>
    );
  }
}
