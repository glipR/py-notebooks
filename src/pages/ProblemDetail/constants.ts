export const CONTENT_HORIZONTAL_PADDING = 15;
export const CODE_VERTICAL_PADDING = 32;
export const DEBUGGER_VERTICAL_PADDING = 10;

export const PYTHON_PREAMBLE = ``

export const UTILS_CODE = `\
import json
import sys

def send_message(type: str, **kwargs):
    obj = json.dumps({"type": type, **kwargs})
    print(f"message=" + obj, file=sys.stderr)

MESSAGES = []
def wait_for_message(type: str, ingest: bool = True):
    for message in MESSAGES:
        if message.get("type") == type:
            if ingest:
                MESSAGES.remove(message)
            return message
    while True:
        i = input()
        try:
            message = json.loads(i)
        except:
            raise ValueError(f"Error reading internal game communications. {i}")
        if message.get("type") == type:
            if not ingest:
                MESSAGES.append(message)
            return message
        MESSAGES.append(message)
`
