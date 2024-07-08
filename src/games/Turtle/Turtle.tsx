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

def read_color_rgb():
    send_message(type="color_sense")
    return wait_for_message("color_read")["color"]

def read_color():
    cols = read_color_rgb()
    if max(cols) < 20:
        return "black"
    elif max(cols) - min(cols) < 20 and min(cols) > 200:
        return "white"
    elif cols[0] > max(cols[1:]) + 50:
        return "red"
    elif cols[1] > max(cols[::2]) + 50:
        return "green"
    elif cols[2] > max(cols[:2]) + 50:
        return "blue"
    return "unknown"

def read_distance():
    send_message(type="distance_sense")
    return wait_for_message("distance_read")["distance"]
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
  customState?: any;

  computedSplotches: ColorSplotch[];
  computedWalls: Wall[];
  computedButtons: Button[];
}

interface BoundingRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ColorSplotch extends BoundingRect {
  color: string;
}

interface Wall extends BoundingRect {
  color: string;
}

interface Button extends BoundingRect {
  onPress: (customState: any) => any;
}

interface Transform {
  x?: number;
  y?: number;
  bearing?: number;
}

interface TurtleProps {
  areaWidth: number;
  areaHeight: number;
  // TODO: Allow these to be functions, so resets can use random generation.
  splotches?: ColorSplotch[] | ((state: any) => ColorSplotch[]);
  walls?: Wall[] | ((state: any) => Wall[]);
  buttons?: Button[] | ((state: any) => Button[]);
  beginTransform?: Transform | ((state: any) => Transform);
  initialCustomState?: any;
}

const hex2rgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  return [bigint >> 16, (bigint >> 8) & 255, bigint & 255];
}

export default class Turtles extends React.Component<TurtleProps, TurtleState> {

  constructor(props: TurtleProps) {
    super(props)
    const customState = typeof props.initialCustomState === 'function' ? props.initialCustomState() : props.initialCustomState;
    const transform = typeof props.beginTransform === 'function' ? props.beginTransform(customState) : props.beginTransform;
    const computedSplotches = (typeof props.splotches === 'function' ? props.splotches(customState) : props.splotches) || [];
    const computedWalls = (typeof props.walls === 'function' ? props.walls(customState) : props.walls) || [];
    const computedButtons = (typeof props.buttons === 'function' ? props.buttons(customState) : props.buttons) || [];
    this.state = {
      turtleBearing: 90 + (transform?.bearing ?? 0),
      turtleX: transform?.x ?? props.areaWidth / 2,
      turtleY: transform?.y ?? props.areaHeight / 2,
      width: 10,
      height: 10,
      springConfig: {...config.spring},
      customState,
      computedSplotches,
      computedWalls,
      computedButtons,
    };
  }

  resetWindow(self: any) {
    const { initialCustomState, beginTransform, areaWidth, areaHeight } = self.props;
    const customState = typeof initialCustomState === 'function' ? initialCustomState() : initialCustomState;
    const transform = typeof beginTransform === 'function' ? beginTransform(customState) : beginTransform;
    this.setState((prevState: TurtleState) =>({
      ...prevState,
      turtleBearing: 90 + (transform?.bearing ?? 0),
      turtleX: transform?.x ?? areaWidth / 2,
      turtleY: transform?.y ?? areaHeight / 2,
      customState,
    }))
  }

  onRest(self: any) {
    const { sendInput } = self.state;
    sendInput?.(JSON.stringify({"type": "movement_complete"}));
  }

  setDuration(duration: number) {
    this.setState({ springConfig: { ...config.spring, duration } });
  }

  findObstruction(turtleX: number, turtleY: number, bearing: number, obstructions: BoundingRect[]) {
    const WALL_DIST = 10000;
    const newX = turtleX + WALL_DIST * Math.cos(deg2rad(bearing));
    const newY = turtleY - WALL_DIST * Math.sin(deg2rad(bearing));
    let curX = newX;
    let curY = newY;
    let curObstruction: BoundingRect | null = null;
    if (newX !== turtleX || newY !== turtleY) {
      let grad = 0;
      if (newX !== turtleX) {
        grad = (newY - turtleY) / (newX - turtleX);
      }
      for (let obstruction of obstructions ?? []) {
        if (curX === turtleX) {
          if (obstruction.x <= turtleX && turtleX <= obstruction.x + obstruction.width) {
            if (turtleY < obstruction.y && curY >= obstruction.y) {
              curY = obstruction.y;
              curObstruction = obstruction;
            } else if (turtleY > obstruction.y + obstruction.height && curY <= obstruction.y + obstruction.height) {
              curY = obstruction.y + obstruction.height;
              curObstruction = obstruction;
            }
          }
          continue;
        }
        if (curY === turtleY) {
          if (obstruction.y <= turtleY && turtleY <= obstruction.y + obstruction.height) {
            if (turtleX < obstruction.x && curX >= obstruction.x) {
              curX = obstruction.x;
              curObstruction = obstruction;
            } else if (turtleX < obstruction.x + obstruction.width && curX >= obstruction.x + obstruction.width) {
              curX = obstruction.x + obstruction.width;
              curObstruction = obstruction;
            }
          }
          continue;
        }
        // Now we can use grad.
        for (let posx of [obstruction.x, obstruction.x + obstruction.width]) {
          if ((turtleX < posx && curX >= posx) || (turtleX > posx && curX <= posx)){
            let y = grad * (posx - turtleX) + turtleY;
            if (obstruction.y <= y && y <= obstruction.y + obstruction.height) {
              curX = posx;
              curY = y;
              curObstruction = obstruction;
            }
          }
        }
        for (let posy of [obstruction.y, obstruction.y + obstruction.height]) {
          if ((turtleY < posy && curY >= posy) || (turtleY > posy && curY <= posy)) {
            let x = 1 / grad * (posy - turtleY) + turtleX;
            if (obstruction.x <= x && x <= obstruction.x + obstruction.width) {
              curX = x;
              curY = posy;
              curObstruction = obstruction;
            }
          }
        }
      }
    }
    return { x: curX, y: curY, obstruction: curObstruction };
  }

  wallDist() {
    const { turtleX, turtleY, turtleBearing, computedWalls } = this.state;
    const { x, y } = this.findObstruction(turtleX, turtleY, turtleBearing, computedWalls);
    const dist = Math.sqrt((x - turtleX) ** 2 + (y - turtleY) ** 2);
    return dist;
  }

  tryMoveTurtle(dist: number, bearing: number) {
    const { turtleX, turtleY, computedButtons, computedWalls } = this.state;
    const newX = turtleX + dist * Math.cos(deg2rad(bearing));
    const newY = turtleY - dist * Math.sin(deg2rad(bearing));
    const { x, y } = this.findObstruction(turtleX, turtleY, bearing, computedWalls);
    const moveDist = Math.sqrt((newX - turtleX) ** 2 + (newY - turtleY) ** 2);
    const wallDist = Math.sqrt((x - turtleX) ** 2 + (y - turtleY) ** 2);
    for (let button of computedButtons ?? [])  {
      const { x: bX, y: bY, obstruction } = this.findObstruction(turtleX, turtleY, bearing, [button]);
      const buttonDist = Math.sqrt((bX - turtleX) ** 2 + (bY - turtleY) ** 2);
      if (obstruction !== null && buttonDist < moveDist && buttonDist < wallDist) {
        const self = this;
        const scopedButton = button;
        setTimeout(() => {
          self.setState((oldState: TurtleState) => {
            const customState = scopedButton.onPress(oldState.customState);
            return {
              ...oldState,
              customState
            }
          })
        }, buttonDist / MOVEMENT_SPEED)
      }
    }
    if (moveDist > wallDist) {
      this.setDuration(wallDist / MOVEMENT_SPEED);
      this.setState({ turtleX: x, turtleY: y });
    } else {
      this.setDuration(moveDist / MOVEMENT_SPEED);
      this.setState({ turtleX: newX, turtleY: newY });
    }
  }

  ingestMessage(obj: any, sendInput: (x: string) => void):void {
    const { turtleBearing } = this.state;
    if (obj.type === 'forward') {
      const dist = obj.dist;
      this.tryMoveTurtle(dist, turtleBearing);
    } else if (obj.type === 'backward') {
      const dist = obj.dist;
      this.tryMoveTurtle(dist, 180 + turtleBearing);
    } else if (obj.type === "right") {
      const angle = obj.angle;
      this.setDuration(Math.abs(angle) / ROTATION_SPEED);
      this.setState({
        turtleBearing: turtleBearing - angle,
      });
    }
    else if (obj.type === "left") {
      const angle = obj.angle;
      this.setDuration(Math.abs(angle) / ROTATION_SPEED);
      this.setState({
        turtleBearing: turtleBearing + angle,
      });
    }
    else if (obj.type === "shift_move") {
      const angle = obj.angle;
      const dist = obj.dist;
      this.tryMoveTurtle(dist, angle);
    }
    else if (obj.type === "color_sense") {
      const { turtleX, turtleY, computedSplotches } = this.state;
      const splotch = computedSplotches.find((splotch) => (
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
    else if (obj.type === "distance_sense") {
      const dist = this.wallDist();
      sendInput?.(JSON.stringify({type: "distance_read", distance: dist}));
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

  componentDidUpdate(prevProps: Readonly<TurtleProps>, prevState: Readonly<TurtleState>, snapshot?: any): void {
    const newProps = this.props;
    const newState = this.state;
    if (prevState.customState !== newState.customState) {
      console.log(newState.customState)
      this.setState((s) => ({
        ...s,
        computedSplotches: (typeof newProps.splotches === 'function' ? newProps.splotches(newState.customState) : newProps.splotches) ?? [],
        computedWalls: (typeof newProps.walls === 'function' ? newProps.walls(newState.customState) : newProps.walls) ?? [],
        computedButtons: (typeof newProps.buttons === 'function' ? newProps.buttons(newState.customState) : newProps.buttons) ?? [],
      }))
    }
  }

  render() {
    const { width, height, turtleBearing, turtleX, turtleY, springConfig, computedSplotches, computedWalls } = this.state;
    const { areaWidth, areaHeight } = this.props;
    const actualHeight = Math.min(height, width / PREFERRED_SCALE);
    const actualWidth = Math.min(width, height * PREFERRED_SCALE);

    return (
      <Stage options={config.stage} height={actualHeight} width={actualWidth}>
          {computedSplotches.map((splotch, i) => (
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
          {computedWalls.map((wall, i) => (
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
            texture={PIXI.Texture.from('/py-notebooks/turtle.svg')}
            x={props.turtleX.to((x) => x * actualWidth / areaWidth)}
            y={props.turtleY.to((y) => y * actualHeight / areaHeight)}
            rotation={props.turtleBearing.to(deg => -deg2rad(deg - 90))}
            anchor={{ x: 0.5, y: 0.5 }}
            width={8 * actualWidth / areaWidth}
            height={8 * actualHeight / areaHeight}
            tint={'#DDDDDD'}
          />)}</Spring>
        </Stage>
    );
  }
}
