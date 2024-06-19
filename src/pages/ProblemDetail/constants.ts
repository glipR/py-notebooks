export const CONTENT_HORIZONTAL_PADDING = 15;
export const CODE_VERTICAL_PADDING = 32;
export const DEBUGGER_VERTICAL_PADDING = 10;

export const PYTHON_PREAMBLE = `\
from utils.mocking import fake_print
print = fake_print
`

export const UTILS_CODE = `\
import json
old_print = print
def fake_print(*args, sep=' ', end='\\n'):
    content = sep.join(map(str, args)) + end
    msg_obj = { "type": "print", "content": content }
    old_print(json.dumps(msg_obj))
print = fake_print

def make_func(func):
    def inner(*args, **kwargs):
        return func(old_print, *args, **kwargs)
    inner.__name__ = func.__name__
    inner.__doc__ = func.__doc__
    return inner
`
