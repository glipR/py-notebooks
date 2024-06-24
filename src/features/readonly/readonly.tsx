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

const addReadonlyEffect = StateEffect.define<ReadonlyEffect>();

export const makeGetReadOnlyEffect = (startText: string, readOnlyDelimiter: string, startReadonly: boolean) => {
  // Makes the getReadOnlyEffect function by finding the location of the delimited string within the targetState string.
  const readonlyEffect = (view: ViewUpdate): void => {
    if (!view.docChanged || !view.viewportChanged) {
      return;
    }
    const effects: StateEffect<ReadonlyEffect>[] = [];
    getFields(startText, readOnlyDelimiter, view.state.doc.toString(), startReadonly).forEach(({from, to}, i) => {
      effects.push(addReadonlyEffect.of({from, to}));
    });
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
      getFields(startText, readOnlyDelimiter, state.doc.toString(), startReadonly).forEach(({from, to}, i) => {
        marks.push(Decoration.mark({
          inclusiveEnd: true,
          class: "is-readonly"
        }).range(from, to));
      });
      return start.update({
        add: marks,
      });
    },
    update(readonlyDecoration, tr) {
      let readonlyDecorationsRangeSet = readonlyDecoration.map(tr.changes);
      const marks: Range<Decoration>[] = [];
      tr.effects.forEach((effect) => {
        if (!effect.is(addReadonlyEffect)) {
          return;
        }
        const { from, to } = effect.value;

        const mark = Decoration.mark({
          inclusiveEnd: true,
          class: "is-readonly"
        }).range(from, to);

        marks.push(mark);
      });
      readonlyDecorationsRangeSet = readonlyDecorationsRangeSet.update({
        add: marks,
      });

      return readonlyDecorationsRangeSet;
    },
    provide: (f) => EditorView.decorations.from(f)
  });
}
