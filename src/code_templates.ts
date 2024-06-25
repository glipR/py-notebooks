import {makeCode} from './components/MultiFileEditor/MultiFileEditor'

export const TERMINAL_CODE = {
  "code.py": makeCode(`\
print("Hello World")
name = "Jackson"
print("Hello", name, "let's count to 10!")

import time
for i in range(1, 11):
  print(i)
  time.sleep(0.5)
`)
}

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
from turtle.sense import read_color
|col = read_color()|
print(col)
forward(20)
right(90)
forward(20)
shift_left(40)
`, '|', false),
  "folder": {
    "test.py": makeCode(`\
print("Hello World")
|name = "Jackson"|
print(f"Hello {name}")
`, '|', true, true),
  }
}
