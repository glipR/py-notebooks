export const CONTENT_HORIZONTAL_PADDING = 15;
export const CODE_VERTICAL_PADDING = 32;
export const DEBUGGER_VERTICAL_PADDING = 10;

export const PYTHON_PREAMBLE = `\
import json
old_print = print
def fake_print(*args, sep=' ', end='\\n'):
    content = sep.join(map(str, args)) + end
    msg_obj = { "type": "print", "content": content }
    old_print(json.dumps(msg_obj))
print = fake_print

def send_cube(x, y, color):
    msg_obj = { "type": "cube", "x": x, "y": y, "color": color }
    old_print(json.dumps(msg_obj))

`
