import { Decoration, DecorationSet, EditorState, EditorView, Range, StateEffect, StateField, ViewUpdate } from "@uiw/react-codemirror";

const getFields = (delimitedText: string, delimiter: string, stateString: string, startReadonly: boolean): {from: number, to: number}[] => {
  const splits = delimitedText.split(delimiter);
  const ranges:Array<{from: number, to: number}> = [];
    let targetText = stateString;
    let bad = false;
    let prevIndex = 0;
    for (let splitIndex = startReadonly ? 0 : 1, i = 0; splitIndex < splits.length; splitIndex += 2, i += 1) {
      const fromIndex = targetText.indexOf(splits[splitIndex]);
      if (fromIndex === -1) {
        bad = true;
        break;
      }
      const toIndex = fromIndex + splits[splitIndex].length;
      ranges.push({
        from: fromIndex + prevIndex,
        to: toIndex + prevIndex
      })
      prevIndex += toIndex
      targetText = targetText.slice(toIndex)
    }
    if (bad) {
      // Make no ranges.
      return [];
    }
    return ranges;
}

export const makeGetReadOnlyRanges = (startText: string, readOnlyDelimiter: string, startReadonly: boolean) => {
  // Makes the getReadOnlyRanges function by finding the location of the delimited string within the targetState string.
  const getReadOnlyRanges = (targetState:EditorState):Array<{from:number|undefined, to:number|undefined}> => {
    return getFields(startText, readOnlyDelimiter, targetState.doc.toString(), startReadonly);
  }
  return getReadOnlyRanges;
}

type ReadonlyEffect = {
  from: number;
  to: number;
};
type EditableEffect = {
  from: number;
  to: number;
};

const addReadonlyEffect = StateEffect.define<ReadonlyEffect>();
const addEditableEffect = StateEffect.define<EditableEffect>();

export const makeGetReadOnlyEffect = (startText: string, readOnlyDelimiter: string, startReadonly: boolean) => {
  // Makes the getReadOnlyEffect function by finding the location of the delimited string within the targetState string.
  const readonlyEffect = (view: ViewUpdate): void => {
    if (!view.docChanged || !view.viewportChanged) {
      return;
    }
    const effects: StateEffect<ReadonlyEffect>[] = [];
    const fields = getFields(startText, readOnlyDelimiter, view.state.doc.toString(), startReadonly);
    fields.forEach(({from, to}, i) => {
      effects.push(addReadonlyEffect.of({from, to}));
    });
    if (fields.length > 0 && fields[0].from !== 0) {
      effects.push(addEditableEffect.of({from: 0, to: fields[0].from}));
    }
    for (let i = 0; i < fields.length - 1; i += 1) {
      const {to} = fields[i];
      const {from} = fields[i + 1];
      effects.push(addEditableEffect.of({from: to, to: from}));
    }
    if (fields.length > 0 && fields[fields.length - 1].to !== view.state.doc.length) {
      effects.push(addEditableEffect.of({from: fields[fields.length - 1].to, to: view.state.doc.length}));
    }

    if (effects.length > 0) {
      view.view.dispatch({ effects });
    }
  }
  return readonlyEffect
}

export const makeReadonlyDecorationField = (startText: string, readOnlyDelimiter: string, startReadonly: boolean) => {
  return StateField.define<DecorationSet>({
    create(state: EditorState) {
      const start = Decoration.none;
      const marks: Range<Decoration>[] = [];
      const fields = getFields(startText, readOnlyDelimiter, state.doc.toString(), startReadonly);
      fields.forEach(({from, to}, i) => {
        marks.push(Decoration.mark({
          inclusiveEnd: true,
          class: "is-readonly"
        }).range(from, to));
      });
      if (fields.length > 0 && fields[0].from !== 0) {
        marks.push(Decoration.mark({
          inclusiveEnd: true,
          class: "is-editable"
        }).range(0, fields[0].from));
      }
      for (let i = 0; i < fields.length - 1; i += 1) {
        const {to} = fields[i];
        const {from} = fields[i + 1];
        if (to === from) continue;
        marks.push(Decoration.mark({
          inclusiveEnd: true,
          class: "is-editable"
        }).range(to, from));
      }
      if (fields.length > 0 && fields[fields.length - 1].to !== state.doc.length) {
        marks.push(Decoration.mark({
          inclusiveEnd: true,
          class: "is-editable"
        }).range(fields[fields.length - 1].to, state.doc.length));
      }
      marks.sort((a, b) => a.from - b.from);
      return start.update({
        add: marks,
      });
    },
    update(readonlyDecoration, tr) {
      let readonlyDecorationsRangeSet = readonlyDecoration.map(tr.changes);
      const marks: Range<Decoration>[] = [];
      tr.effects.forEach((effect) => {
        if (effect.is(addReadonlyEffect)) {
          const { from, to } = effect.value;
          if (from === to) {
            return
          }

          const mark = Decoration.mark({
            inclusiveEnd: true,
            class: "is-readonly"
          }).range(from, to);

          marks.push(mark);
        } else if (effect.is(addEditableEffect)) {
          const { from, to } = effect.value;

          const mark = Decoration.mark({
            inclusiveEnd: true,
            class: "is-editable"
          }).range(from, to);

          marks.push(mark);
        }
      });
      marks.sort((a, b) => a.from - b.from);
      readonlyDecorationsRangeSet = readonlyDecorationsRangeSet.update({
        add: marks,
      });

      return readonlyDecorationsRangeSet;
    },
    provide: (f) => EditorView.decorations.from(f)
  });
}
