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

export const SANDPILES_CODE = {
  "code.py": makeCode(`\
from cube import send_multiple
colours = [
  0x222222,
  0xaa7711,
  0x994444,
  0xccbb88,
  0xeeeeee
]

grid_size = 25
grid = [
  [0 for _ in range(grid_size)]
  for _ in range(grid_size)
]
grid[grid_size//2][grid_size//2] = 2000

import time
finished = False
iter = 0
while not finished:
    finished = True
    new_grid = [
      [0 for _ in range(grid_size)]
      for _ in range(grid_size)
    ]
    for x in range(grid_size):
      for y in range(grid_size):
        if grid[x][y] >= 4:
          finished = False
          new_grid[x][y] += grid[x][y] - 4
          if x > 0:
            new_grid[x-1][y] += 1
          if x < grid_size - 1:
            new_grid[x+1][y] += 1
          if y > 0:
            new_grid[x][y-1] += 1
          if y < grid_size - 1:
            new_grid[x][y+1] += 1
        else:
          new_grid[x][y] += grid[x][y]
    grid = new_grid

    if iter % 10 == 0:
      send_multiple([
        { "x": x, "y": y, "color": colours[min(grid[x][y], len(colours)-1)] }
        for y in range(grid_size)
        for x in range(grid_size)
      ])
      time.sleep(0.25)

    iter += 1
`)
}
