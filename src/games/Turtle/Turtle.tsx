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

const movement_code = `
from utils.mocking import send_message, wait_for_message

FIXED_SLEEP = 0.5
def forward(dist):
    send_message(type="forward", dist=dist)
    wait_for_message("movement_complete")

def backward(dist):
    send_message(type="backward", dist=dist)
    wait_for_message("movement_complete")

def right(angle):
    send_message(type="right", angle=angle)
    wait_for_message("movement_complete")

def left(angle):
    send_message(type="left", angle=angle)
    wait_for_message("movement_complete")

def shift_move(angle, dist):
    send_message(type="shift_move", angle=angle, dist=dist)
    wait_for_message("movement_complete")

def shift_left(dist):
    shift_move(180, dist)

def shift_right(dist):
    shift_move(0, dist)

def shift_up(dist):
    shift_move(90, dist)

def shift_down(dist):
    shift_move(270, dist)
`

const sense_code = `\
from utils.mocking import send_message, wait_for_message

def read_color():
    send_message(type="color_sense")
    return wait_for_message("color_read")["color"]
`

const MOVEMENT_SPEED = 0.025;
const ROTATION_SPEED = 0.1;
const PREFERRED_SCALE = 2; // Twice the width as height.

const config = {
  stage: {antialias: true, background: 0x2D3032},
  spring: {duration: 1000, delay: 0, precision: 0.01, ease: (t: number) => t},
}

interface TurtleState {
  turtleBearing: number;
  turtleX: number;
  turtleY: number;
  width: number;
  height: number;
  springConfig: any;
  sendInput?: (x: string) => void;
}

interface ColorSplotch {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface TurtleProps {
  areaWidth: number;
  areaHeight: number;
  splotches?: ColorSplotch[];
  walls?: Wall[];
}

const hex2rgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  return [bigint >> 16, (bigint >> 8) & 255, bigint & 255];
}

export default class Turtles extends React.Component<TurtleProps, TurtleState> {

  constructor(props: TurtleProps) {
    super(props)
    this.state = {
      turtleBearing: -90,
      turtleX: props.areaWidth / 2,
      turtleY: props.areaHeight / 2,
      width: 10,
      height: 10,
      springConfig: {...config.spring},
    };
  }

  onRest(self: any) {
    const { sendInput } = self.state;
    sendInput?.(JSON.stringify({"type": "movement_complete"}));
  }

  setDuration(duration: number) {
    this.setState({ springConfig: { ...config.spring, duration } });
  }

  ingestMessage(obj: any, sendInput: (x: string) => void):void {
    const { turtleBearing, turtleX, turtleY } = this.state;
    if (obj.type === 'forward') {
      this.setDuration(obj.dist / MOVEMENT_SPEED);
      const dist = obj.dist;
      this.setState({
        turtleX: turtleX + dist * Math.cos(deg2rad(turtleBearing)),
        turtleY: turtleY + dist * Math.sin(deg2rad(turtleBearing)),
      });
    } else if (obj.type === 'backward') {
      this.setDuration(obj.dist / MOVEMENT_SPEED);
      const dist = obj.dist;
      this.setState({
        turtleX: turtleX - dist * Math.cos(deg2rad(turtleBearing)),
        turtleY: turtleY - dist * Math.sin(deg2rad(turtleBearing)),
      });
    } else if (obj.type === "right") {
      this.setDuration(obj.angle / ROTATION_SPEED);
      const angle = obj.angle;
      this.setState({
        turtleBearing: turtleBearing + angle,
      });
    }
    else if (obj.type === "left") {
      this.setDuration(obj.angle / ROTATION_SPEED);
      const angle = obj.angle;
      this.setState({
        turtleBearing: turtleBearing - angle,
      });
    }
    else if (obj.type === "shift_move") {
      this.setDuration(obj.dist / MOVEMENT_SPEED);
      const angle = obj.angle;
      const dist = obj.dist;
      this.setState({
        turtleX: turtleX + dist * Math.cos(- deg2rad(angle)),
        turtleY: turtleY + dist * Math.sin(- deg2rad(angle)),
      });
    }
    else if (obj.type === "color_sense") {
      const { turtleX, turtleY } = this.state;
      const { splotches } = this.props;
      const splotch = splotches?.find((splotch) => (
        turtleX >= splotch.x &&
        turtleX <= splotch.x + splotch.width &&
        turtleY >= splotch.y &&
        turtleY <= splotch.y + splotch.height
      ));
      if (splotch !== undefined) {
        sendInput?.(JSON.stringify({type: "color_read", color: hex2rgb(splotch.color)}));
      } else {
        sendInput?.(JSON.stringify({type: "color_read", color: [0, 0, 0]}));
      }
    }
    this.setState({ sendInput });
  }

  setDimensions(width: number, height: number):void {
    this.setState({ width, height });
  }

  getPythonPreamble(): TreeStructure {
    return {
      "turtle": {
        "movement.py": makeCode(movement_code),
        "sense.py": makeCode(sense_code),
      }
    };
  }

  render() {
    const { width, height, turtleBearing, turtleX, turtleY, springConfig } = this.state;
    const { areaWidth, areaHeight } = this.props;
    const actualHeight = Math.min(height, width / PREFERRED_SCALE);
    const actualWidth = Math.min(width, height * PREFERRED_SCALE);
    return (
      <Stage options={config.stage} height={actualHeight} width={actualWidth}>
          {this.props.splotches?.map((splotch, i) => (
            <Sprite
              key={`splotch-${i}`}
              texture={PIXI.Texture.WHITE}
              x={splotch.x * actualWidth / areaWidth}
              y={splotch.y * actualHeight / areaHeight}
              width={splotch.width * actualWidth / areaWidth}
              height={splotch.height * actualHeight / areaHeight}
              tint={splotch.color}
            />
          ))}
          {this.props.walls?.map((wall, i) => (
            <Sprite
              key={`wall-${i}`}
              texture={PIXI.Texture.WHITE}
              x={wall.x * actualWidth / areaWidth}
              y={wall.y * actualHeight / areaHeight}
              width={wall.width * actualWidth / areaWidth}
              height={wall.height * actualHeight / areaHeight}
              tint={wall.color}
            />
          ))}
          <Spring onRest={() => this.onRest(this)} config={springConfig} to={{
            turtleBearing, turtleX, turtleY
          }}>{(props: { turtleBearing: SpringValue<number>, turtleX: SpringValue<number>, turtleY: SpringValue<number> }) => (<Sprite
            texture={PIXI.Texture.from('/turtle.svg')}
            x={props.turtleX.to((x) => x * actualWidth / areaWidth)}
            y={props.turtleY.to((y) => y * actualHeight / areaHeight)}
            rotation={props.turtleBearing.to(deg => deg2rad(deg + 90))}
            anchor={{ x: 0.5, y: 0.5 }}
            width={8 * actualWidth / areaWidth}
            height={8 * actualHeight / areaHeight}
            tint={'#DDDDDD'}
          />)}</Spring>
        </Stage>
    );
  }
}
