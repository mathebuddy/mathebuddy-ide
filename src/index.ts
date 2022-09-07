/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import axios from 'axios';

import 'codemirror/mode/clike/clike';
import 'codemirror/addon/mode/simple';
//import 'codemirror/addon/selection/active-line';  TODO: reactivate??
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/mode/overlay';
// esbuild requires 'codemirror' import AFTER modes and addons
import * as CodeMirror from 'codemirror';

export let editor: CodeMirror.EditorFromTextArea = null;
export let userEditor: CodeMirror.EditorFromTextArea = null;

export function init(): void {
  // init code editor
  CodeMirror.defineSimpleMode('sellquiz-edit', {
    // TODO: rename
    start: [
      { regex: /\$(?:[^\\]|\\.)*?(?:\$|$)/, token: 'string' },
      { regex: /\*\*(?:[^\\]|\\.)*?(?:\*\*|$)/, token: 'variable-3' },
      //{ regex: /`(?:[^\\]|\\.)*?(?:`)/, token: 'string' },
      { regex: /%.*/, token: 'comment' },
      { regex: /#.*/, token: 'keyword', sol: true },
      {
        regex:
          /---|========|Definition\.|Example\.|Theorem\.|Proof\.|Chatquestion\.|Question\.|Remark\.|JavaQuestion\.|Python\.|Authentication\.|Tikz\.|Speedreview\.|Links\.|Plot2d\.|!tex|!lang=EN|!lang=DE|!require-authentication|!require-min-score|@tags|@title|@code|@text|@solution|@given|@asserts|@options|@questions|@forbidden-keywords|@python|@matching|\/\/\/|@settings|@sage|@octave|@maxima|@answer|@database|@input|@required-keywords/,
        token: 'keyword',
      },
    ],
    comment: [],
    meta: {
      dontIndentStates: ['comment'],
      lineComment: '%',
    },
  });

  userEditor = CodeMirror.fromTextArea(
    document.getElementById('userEditor') as HTMLTextAreaElement,
    {
      mode: 'plaintext',
      lineNumbers: false,
      lineWrapping: true,
    },
  );
  userEditor.setSize(null, '100%');
  userEditor.setValue(`# USERS

admin
  admin=true

#test
#  mail=a@b.com
#  read=hm1,hm2
#  write=hm1
#  qa=hm1
`);

  editor = CodeMirror.fromTextArea(
    document.getElementById('editor') as HTMLTextAreaElement,
    {
      mode: 'sellquiz-edit', // TODO: rename
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
          alert('searching text is unimplemented!');
        },
        'Cmd-F': function () {
          alert('searching text is unimplemented!');
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
  editor.setValue(`Hello, world @intro
###################

Some text here. %This text is a comment.

---
EXERCISE My Exercise @myExerciseLabel
@code
let x = rand(1, 5);
let y = rand(1, 5);
let z = x + y;
@text
Calculate $ x + y = #z $.
---
`);
  editor.setSize(null, '100%');
}

export function openTab(id: string): void {
  // main panels
  document.getElementById('course-editor').style.display =
    id === 'course-editor' ? 'block' : 'none';
  document.getElementById('course-management').style.display =
    id === 'course-management' ? 'block' : 'none';
  document.getElementById('user-management').style.display =
    id === 'user-management' ? 'block' : 'none';
  // tabs for main panels
  document.getElementById('tab-editor').className =
    id === 'editor' ? 'nav-link active' : 'nav-link';
  document.getElementById('tab-course-management').className =
    id === 'course-management' ? 'nav-link active' : 'nav-link';
  document.getElementById('tab-user-management').className =
    id === 'user-management' ? 'nav-link active' : 'nav-link';
  // submenus for main panels
  document.getElementById('course-editor-submenu').style.display =
    id === 'course-editor' ? 'block' : 'none';
  document.getElementById('user-management-submenu').style.display =
    id === 'user-management' ? 'block' : 'none';
  document.getElementById('empty-submenu').style.display =
    id !== 'course-editor' && id !== 'user-management' ? 'block' : 'none';
  // refresh codemirror editors
  if (id === 'course-editor') {
    userEditor.refresh();
  }
  if (id === 'user-management') {
    userEditor.refresh();
  }
}
