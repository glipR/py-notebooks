import {makeCode} from './components/MultiFileEditor/MultiFileEditor'

export const CUBES_CODE = {
  "code.py": makeCode(`\
from cube import send_cube
colours = [
  0xFF0000,
  0xFFFF00,
  0x00FF00,
  0x00FFFF,
  0x0000FF,
  0xFF00FF
]

import time

for t in range(4):
  for a in range(30):
    prev = (a-3) % 30
    px, py = prev % 10, prev // 10
    x, y = a % 10, a // 10
    send_cube(x, y, colours[a % len(colours)] if t % 2 == 0 else 0)
    time.sleep(0.05)
  time.sleep(1)
`)}

export const TURTLE_CODE = {
  "code.py": makeCode(`\
from turtle.movement import *
forward(20)
right(90)
forward(20)
shift_left(40)
`),
  "folder": {
    "test.py": makeCode('print("Hello World")'),
  }
}
