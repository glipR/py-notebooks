import { Spring, SpringValue } from 'react-spring';
import { Stage } from '@pixi/react'
import { Sprite } from '@pixi/react-animated';
import * as utils from '@pixi/utils'
import * as PIXI from 'pixi.js'

import React from 'react';
import { TreeStructure, makeCode } from '../../components/MultiFileEditor/MultiFileEditor';

const code = `
import json
from utils.mocking import send_message

def send_cube(x, y, color):
    send_message(type="cube", x=x, y=y, color=color)

def send_multiple(updates):
    for update in updates:
        assert type(update.get("x")) == int
        assert type(update.get("y")) == int
        assert type(update.get("color")) == int
    send_message(type="cube_multiple", updates=updates)
`

const toHex = (color: string) =>
  /^#/.test(color)
    ? utils.string2hex(color)
    : utils.rgb2hex(
        color
          .replace(/^rgba?\(|\s+|\)$/g, "")
          .split(",")
          .map((val) => Number(val) / 255)
      );

const config = {
  stage: {antialias: true, background: 0x2D3032},
  spring: {duration: 150, delay: 0, precision: 0.01, ease: (t: number) => t * t * t * t * t},
}

interface GridSquareState {
  colors: string[][];
  width: number;
  height: number;
}

interface GridSquareProps {
  gridWidth: number;
  gridHeight: number;
}

export default class GridSquares extends React.Component<GridSquareProps, GridSquareState> {

  constructor(props: GridSquareProps) {
    super(props)
    this.state = {
      width: 10,
      height: 10,
      colors: Array.from(
        { length: props.gridHeight },
        () => Array.from(
          { length: props.gridWidth },
          () => "#000000"
        )
      )
    };
  }

  ingestMessage(obj: any, sendInput: (x: string) => void):void {
    const { colors } = this.state;
    if (obj.type === 'cube') {
      const newGrid = [...colors];
      newGrid[obj.y][obj.x] = `#${obj.color.toString(16).padStart(6, '0')}`;
      this.setState({ colors: newGrid});
    }
    if (obj.type === 'cube_multiple') {
      const newGrid = [...colors];
      for (const update of obj.updates) {
        newGrid[update.y][update.x] = `#${update.color.toString(16).padStart(6, '0')}`;
      }
      this.setState({ colors: newGrid});
    }
  }

  setDimensions(width: number, height: number):void {
    this.setState({ width, height });
  }

  getPythonPreamble(): TreeStructure {
    return {
      "cube.py": makeCode(code)
    };
  }

  render() {
    const { gridWidth, gridHeight } = this.props;
    const { colors, width, height } = this.state;
    return (
      <Stage options={config.stage} height={height} width={width}>
          {colors.map((row, y) => row.map((color, x) => <Spring config={config.spring} key={`${x}-${y}`} to={{
            tint: color
          }}>{(props: { tint: SpringValue<string> }) => (<><Sprite
            key={`${x}-${y}`}
            texture={PIXI.Texture.WHITE}
            x={x * width/gridWidth}
            y={y * height/gridHeight}
            anchor={{ x: 0, y: 0 }}
            width={width/gridWidth}
            height={height/gridHeight}
            tint={props.tint.to((color) => toHex(color))}
          /></>)}</Spring>))}
        </Stage>
    );
  }
}
