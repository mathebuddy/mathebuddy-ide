/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import 'codemirror/mode/clike/clike';
import 'codemirror/addon/mode/simple';
//import 'codemirror/addon/selection/active-line';  TODO: reactivate??
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/mode/overlay';
// esbuild requires 'codemirror' import AFTER modes and addons
import * as CodeMirror from 'codemirror';

export let editor: CodeMirror.EditorFromTextArea = null;

export function setEditorText(text: string): void {
  editor.setValue(text);
  refreshEditor();
}

export function refreshEditor(): void {
  document.getElementById('home').style.display = 'none';
  document.getElementById('course-editor').style.display = 'block';
  document.getElementById('course-editor').style.height = '100%';
  //editor.setSize(null, '256px'); // TODO
  editor.setSize(null, '' + (window.innerHeight - 118) + 'px');
  editor.refresh();
}

export function initEditor(): void {
  // init code editor
  CodeMirror.defineSimpleMode('mathebuddy-edit', {
    start: [
      { regex: /\$(?:[^\\]|\\.)*?(?:\$|$)/, token: 'string' },
      { regex: /\*\*(?:[^\\]|\\.)*?(?:\*\*|$)/, token: 'variable-3' },
      //{ regex: /`(?:[^\\]|\\.)*?(?:`)/, token: 'string' },
      { regex: /%.*/, token: 'comment' },
      { regex: /#.*/, token: 'keyword', sol: true },
      {
        regex:
          /---|========|EXERCISE |EQUATION|HIDDEN|SUMMARY|Definition\.|Example\.|Theorem\.|Proof\.|Chatquestion\.|Question\.|Remark\.|JavaQuestion\.|Python\.|Authentication\.|Tikz\.|Speedreview\.|Links\.|Plot2d\.|!tex|!lang=EN|!lang=DE|!require-authentication|!require-min-score|@tags|@title|@code|@text|@solution|@given|@asserts|@options|@questions|@forbidden-keywords|@python|@matching|\/\/\/|@settings|@sage|@octave|@maxima|@answer|@database|@input|@required-keywords/,
        token: 'keyword',
      },
    ],
    comment: [],
    meta: {
      dontIndentStates: ['comment'],
      lineComment: '%',
    },
  });

  editor = CodeMirror.fromTextArea(
    document.getElementById('editor') as HTMLTextAreaElement,
    {
      mode: 'mathebuddy-edit', // TODO: rename
      lineNumbers: true,
      lineWrapping: true,
      /*styleActiveLine: {  // TODO: reactivate??
          nonEmpty: true,
      },*/
      extraKeys: {
        'Ctrl-S': function () {
          //saveDocument();
        },
        'Cmd-S': function () {
          //saveDocument();
        },
        'Ctrl-F': function () {
          //alert('searching text is unimplemented!');
        },
        'Cmd-F': function () {
          //alert('searching text is unimplemented!');
        },
        F1: function () {
          //updateEmulator(true);
        },
        F2: function () {
          //updateEmulator(false);
        },
        F3: function () {
          document.getElementById('insertCodeButton').click();
        },
      },
    },
  );
  editor.setValue('');
}
