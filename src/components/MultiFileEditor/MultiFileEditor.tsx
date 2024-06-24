import React from "react"
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { Extension } from "@uiw/react-codemirror";

import styles from './MultiFileEditor.module.css'
import { cn } from "../../utils/cn";
import { createRoot } from "react-dom/client";
import { makeGetReadOnlyEffect, makeGetReadOnlyRanges, makeReadonlyDecorationField } from "../../features/readonly/readonly";
import readOnlyRangesExtension from "codemirror-readonly-ranges";

// TODO:
// Download files as zip, folders and files add this to context menu.

interface MultiFileEditorProps {
  tree: TreeStructure
  onChange?: (tree: TreeStructure) => void;
  height: string;
  theme: Extension;
  extensions: Extension[];
  defaultFile?: string;
}

export interface CodeBlock {
  type: 'code';
  code: string;
  templateCode?: string;
  delimiter?: string;
  startReadonly?: boolean;
}

export const makeCode = (code: string, delimiter?: string, startReadonly?: boolean): CodeBlock => {
  return {
    type: 'code',
    code: delimiter ? code.replaceAll(delimiter, '') : code,
    templateCode: code,
    delimiter,
    startReadonly,
  }
}

export interface TreeStructure {
  [key: string]: TreeStructure | CodeBlock;
}

export interface TreeStructureProps {
  tree: TreeStructure;
  prefix?: string;
  fileSelected?: (absPath: string) => void;
  activeFile?: string;
  contextRef: React.RefObject<HTMLDivElement>;
  treeUpdated: (tree: TreeStructure) => void;
}

const TreeRenderer: React.FC<TreeStructureProps> = ({tree, prefix, fileSelected, activeFile, contextRef, treeUpdated}) => {
  const absPath = (key: string) => prefix ? `${prefix}/${key}` : key;

  const [folded, setFolded] = React.useState<{[key: string]: boolean}>({});
  const [editing, setEditing] = React.useState<{[key: string]: boolean}>({});

  const toggleFolded = (key: string) => {
    setFolded({...folded, [key]: !folded[key]});
  }

  const editRefs = Array.from({length: Object.keys(tree).length}, () => React.createRef<HTMLInputElement>());
  return <div className={styles.treeRender}>
    {Object.keys(tree).map((key, index) => {
      if ('type' in tree[key] && tree[key].type === 'code') {
        return <div
          className={cn(styles.fileKey, absPath(key) === activeFile && styles.active)}
          key={key}
          onClick={() => fileSelected?.(absPath(key))}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            contextRef.current?.style.setProperty('display', 'block');
            contextRef.current?.style.setProperty('left', e.pageX + 'px');
            contextRef.current?.style.setProperty('top', e.pageY + 'px');
            const root = createRoot(contextRef.current?.children[0]!);
            root.render(<ul>
              <li onClick={()=>{
                contextRef.current?.style.setProperty('display', 'none');
                // TODO: This only disables editing in the current folder.
                setEditing({[key]: true}); // Disable editing for all other files/folders
                setTimeout(() => {
                  (document.getElementsByClassName('renameInput')[0] as HTMLInputElement)?.focus()
                }, 30)
              }}>Rename File</li>
              <li onClick={()=>{
                contextRef.current?.style.setProperty('display', 'none');
                const {
                  [key]: _,
                  ...newTree
                } = tree;
                treeUpdated(newTree)
              }}>Delete File</li>
            </ul>);
          }}
        >
          {(!editing[key] && !!key) ? <span>{key}</span> : <form onSubmit={(e) =>{
            const newVal = ((e.target as HTMLFormElement).children[0] as HTMLInputElement).value
            e.preventDefault();
            if (newVal === '' || (newVal in tree && newVal !== key)) return;
            setEditing({...editing, [key]: false});
            const {
              [key]: _,
              ...oldTree
            } = tree;
            treeUpdated({...oldTree, [newVal]: tree[key]});
          }}><input className="renameInput" defaultValue={key} ref={editRefs[index]} /></form>}
        </div>
      } else {
        return <div className={styles.folder} key={key}>
          <div
            onClick={() => toggleFolded(key)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              contextRef.current?.style.setProperty('display', 'block');
              contextRef.current?.style.setProperty('left', e.pageX + 'px');
              contextRef.current?.style.setProperty('top', e.pageY + 'px');
              const root = createRoot(contextRef.current?.children[0]!);
              root.render(<ul>
                <li onClick={()=>{
                  contextRef.current?.style.setProperty('display', 'none');
                  // TODO: This only disables editing in the current folder.
                  setEditing({[key]: true}); // Disable editing for all other files/folders
                  setTimeout(() => {
                    (document.getElementsByClassName('renameInput')[0] as HTMLInputElement)?.focus()
                  }, 30)
                }}>Rename Folder</li>
                <li onClick={()=>{
                  contextRef.current?.style.setProperty('display', 'none');
                  const {
                    [key]: _,
                    ...newTree
                  } = tree;
                  treeUpdated(newTree)
                }}>Delete Folder</li>
                <li onClick={()=>{
                  contextRef.current?.style.setProperty('display', 'none');
                  // TODO: This only disables editing in the current folder.
                  const newTree = {...tree, [key]: {...tree[key], '': makeCode('')}}
                  treeUpdated(newTree)
                  setTimeout(() => {
                    (document.getElementsByClassName('renameInput')[0] as HTMLInputElement)?.focus()
                  }, 30)
                }}>Add File</li>
                <li onClick={()=>{
                  contextRef.current?.style.setProperty('display', 'none');
                  // TODO: This only disables editing in the current folder.
                  const newTree = {...tree, [key]: {...tree[key], '': {}}}
                  treeUpdated(newTree)
                  setTimeout(() => {
                    (document.getElementsByClassName('renameInput')[0] as HTMLInputElement)?.focus()
                  }, 30)
                }}>Add Folder</li>
              </ul>);
            }}
          >
            {(!editing[key] && !!key) ? <span className={cn(styles.folderKey, !!folded[key] && styles.folded)}>{key}</span> : <form onSubmit={(e) =>{
              const newVal = ((e.target as HTMLFormElement).children[0] as HTMLInputElement).value
              e.preventDefault();
              if (newVal === '') return;
              setEditing({...editing, [key]: false});
              const {
                [key]: _,
                ...oldTree
              } = tree;
              treeUpdated({...oldTree, [newVal]: tree[key]});
            }}><input className="renameInput" defaultValue={key} ref={editRefs[index]} /></form>}
          </div>

          {!folded[key] &&
            <TreeRenderer
              tree={tree[key] as TreeStructure}
              prefix={absPath(key)}
              fileSelected={fileSelected}
              activeFile={activeFile}
              contextRef={contextRef}
              treeUpdated={(newTree) => {
                treeUpdated({...tree, [key]: newTree});
              }}
            />
          }
        </div>
      }
    })}
  </div>
}

const readonlyExtensions = (startText: string, delimiter?: string, startReadonly?: boolean): Extension[] => {
  if (!delimiter) return []
  const readonlyEffect = makeGetReadOnlyEffect(startText, delimiter, !!startReadonly);
  const ranges = makeGetReadOnlyRanges(startText, delimiter, !!startReadonly);
  const decoration = makeReadonlyDecorationField(startText, delimiter, !!startReadonly);

  return [
    readOnlyRangesExtension(ranges),
    EditorView.updateListener.of(readonlyEffect),
    decoration,
    EditorView.theme({
      ".is-readonly": {
        backgroundColor: "red"
      }
    })
  ];
}

export const getCodeFromFolder = (totalTree: TreeStructure, folderPath: string) : CodeBlock | undefined => {
  var p = folderPath;
  var obj = totalTree;
  while (p.includes('/')) {
    var i = p.indexOf('/');
    var splits = [p.slice(0,i), p.slice(i+1)];
    var folder = splits[0];
    p = splits[1];
    // Test if obj[folder] is a CodeBlock
    if (!(folder in obj)) {
      return undefined;
    }
    if ('type' in obj[folder] && obj[folder].type === 'code') {
      return obj[folder] as CodeBlock;
    } else {
      obj = obj[folder] as TreeStructure;
    }
  }
  if (p in obj) {
    if ('type' in obj[p] && obj[p].type === 'code') return obj[p] as CodeBlock;
  }
}

const MultiFileEditor: React.FC<MultiFileEditorProps> = ({ tree, onChange, height, theme, extensions, defaultFile }) => {
  const [currentFile, setCurrentFile] = React.useState(defaultFile || Object.keys(tree).filter((key) => 'type' in tree[key] && tree[key].type === 'code')[0]);

  const processCodeUpdate = (value: string) => {
    const newTree = {...tree};
    if (currentFile !== undefined) {
      var p = currentFile;
      var obj = newTree;
      while (p.includes('/')) {
        var i = p.indexOf('/');
        var splits = [p.slice(0,i), p.slice(i+1)];
        var folder = splits[0];
        p = splits[1];
        // Test if obj[folder] is a CodeBlock
        if ('type' in obj[folder] && obj[folder].type === 'code') {
          obj[folder] = {...obj[folder] as CodeBlock, code: value};
        } else {
          obj = obj[folder] as TreeStructure;
        }
      }
      if (p in obj) {
        if ('type' in obj[p] && obj[p].type === 'code') {
          obj[p] = {...obj[p] as CodeBlock, code: value};
        }
      }
      onChange?.(newTree);
    }
  }

  const contextRef = React.useRef<HTMLDivElement>(null);
  const currentCode = getCodeFromFolder(tree, currentFile);

  return <div className={styles.editorView}>
    <div
      className={styles.folderView}
      onClick={()=>{contextRef.current?.style.setProperty('display', 'none')}}
      onContextMenu={(e) => {
        e.preventDefault();
        contextRef.current?.style.setProperty('display', 'block');
        contextRef.current?.style.setProperty('left', e.pageX + 'px');
        contextRef.current?.style.setProperty('top', e.pageY + 'px');
        const root = createRoot(contextRef.current?.children[0]!);
        root.render(<ul>
          <li onClick={()=>{
            contextRef.current?.style.setProperty('display', 'none');
            const newTree = {...tree, '': makeCode('')}
            onChange?.(newTree)
            setTimeout(() => {
              (document.getElementsByClassName('renameInput')[0] as HTMLInputElement)?.focus()
            }, 30)
          }}>Add File</li>
          <li onClick={()=>{
            contextRef.current?.style.setProperty('display', 'none');
            // TODO: This only disables editing in the current folder.
            const newTree = {...tree, '': {}}
            onChange?.(newTree)
            setTimeout(() => {
              (document.getElementsByClassName('renameInput')[0] as HTMLInputElement)?.focus()
            }, 30)
          }}>Add Folder</li>
        </ul>);
      }}
    >
      <div ref={contextRef} className={styles.contextMenu} id="contextMenu"><ul></ul></div>
      <TreeRenderer
        tree={tree}
        contextRef={contextRef}
        fileSelected={setCurrentFile}
        activeFile={currentFile}
        treeUpdated={onChange || (() => {})}
      />
    </div>
    {currentFile !== undefined && <CodeMirror
    className={styles.codeView}
    height={height}
    value={currentCode?.code || ''}
    theme={theme}
    extensions={currentCode?.delimiter ? [...extensions, readonlyExtensions(currentCode.templateCode!, currentCode.delimiter, currentCode.startReadonly)] : extensions}
    onChange={(value) => processCodeUpdate(value)}
  />}
  </div>
}

export default MultiFileEditor;
