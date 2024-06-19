import { Spring, SpringValue } from 'react-spring';
import { Stage } from '@pixi/react'
import { Sprite } from '@pixi/react-animated';
import * as PIXI from 'pixi.js'

import React from 'react';
import { TreeStructure, makeCode } from '../../components/MultiFileEditor/MultiFileEditor';

function deg2rad(degrees: number) : number
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

const code = `
import time
import json
from utils.mocking import make_func

FIXED_SLEEP = 0.5
@make_func
def forward(old_print, dist):
    msg_obj = { "type": "forward", "dist": dist }
    old_print(json.dumps(msg_obj))
    time.sleep(FIXED_SLEEP)

@make_func
def backward(old_print, dist):
    msg_obj = { "type": "backward", "dist": dist }
    old_print(json.dumps(msg_obj))
    time.sleep(FIXED_SLEEP)

@make_func
def right(old_print, angle):
    msg_obj = { "type": "right", "angle": angle }
    old_print(json.dumps(msg_obj))
    time.sleep(FIXED_SLEEP)

@make_func
def left(old_print, angle):
    msg_obj = { "type": "left", "angle": angle }
    old_print(json.dumps(msg_obj))
    time.sleep(FIXED_SLEEP)

@make_func
def shift_move(old_print, angle, dist):
    msg_obj = { "type": "shift_move", "angle": angle, "dist": dist }
    old_print(json.dumps(msg_obj))
    time.sleep(FIXED_SLEEP)

def shift_left(dist):
    shift_move(180, dist)

def shift_right(dist):
    shift_move(0, dist)

def shift_up(dist):
    shift_move(90, dist)

def shift_down(dist):
    shift_move(270, dist)
`

const config = {
  stage: {antialias: true, background: 0x2D3032},
  spring: {duration: 500, delay: 0, precision: 0.01, ease: (t: number) => t * t * t * t},
}

interface TurtleState {
  turtleBearing: number;
  turtleX: number;
  turtleY: number;
  width: number;
  height: number;
}

interface TurtleProps {
  areaWidth: number;
  areaHeight: number;
}

export default class Turtles extends React.Component<TurtleProps, TurtleState> {

  constructor(props: TurtleProps) {
    super(props)
    this.state = {
      turtleBearing: 0,
      turtleX: props.areaWidth / 2,
      turtleY: props.areaHeight / 2,
      width: 10,
      height: 10,
    };
  }

  ingestMessage(obj: any):void {
    const { turtleBearing, turtleX, turtleY } = this.state;
    if (obj.type === 'forward') {
      const dist = obj.dist;
      this.setState({
        turtleX: turtleX + dist * Math.cos(deg2rad(turtleBearing)),
        turtleY: turtleY + dist * Math.sin(deg2rad(turtleBearing)),
      });
    } else if (obj.type === 'backward') {
      const dist = obj.dist;
      this.setState({
        turtleX: turtleX - dist * Math.cos(deg2rad(turtleBearing)),
        turtleY: turtleY - dist * Math.sin(deg2rad(turtleBearing)),
      });
    } else if (obj.type === "right") {
      const angle = obj.angle;
      this.setState({
        turtleBearing: turtleBearing - angle,
      });
    }
    else if (obj.type === "left") {
      const angle = obj.angle;
      this.setState({
        turtleBearing: turtleBearing + angle,
      });
    }
    else if (obj.type === "shift_move") {
      const angle = obj.angle;
      const dist = obj.dist;
      this.setState({
        turtleX: turtleX + dist * Math.cos(deg2rad(angle)),
        turtleY: turtleY + dist * Math.sin(deg2rad(angle)),
      });
    }
  }

  setDimensions(width: number, height: number):void {
    this.setState({ width, height });
  }

  getPythonPreamble(): TreeStructure {
    return {
      "turtle": {
        "movement.py": makeCode(code)
      }
    };
  }

  render() {
    const { width, height, turtleBearing, turtleX, turtleY } = this.state;
    const { areaWidth, areaHeight } = this.props;
    return (
      <Stage options={config.stage} height={height} width={width}>
          <Spring config={config.spring} to={{
            turtleBearing, turtleX, turtleY
          }}>{(props: { turtleBearing: SpringValue<number>, turtleX: SpringValue<number>, turtleY: SpringValue<number> }) => (<Sprite
            texture={PIXI.Texture.WHITE}
            x={props.turtleX.to((x) => x * width / areaWidth)}
            y={props.turtleY.to((y) => y * height / areaHeight)}
            rotation={props.turtleBearing.to(deg2rad)}
            anchor={{ x: 0.5, y: 0.5 }}
            width={4 * width / areaWidth}
            height={4 * height / areaHeight}
            tint={'#00FF00'}
          />)}</Spring>
        </Stage>
    );
  }
}
