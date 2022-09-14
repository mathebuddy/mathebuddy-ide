/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

/*// TODO!!
import * as diff from 'diff';

const a = 'blubxxx\n1\n2\n3';
const b = 'blxubxx\n1\n2\n4';
console.log(diff.diffLines(a, b));*/

import * as bootstrap from 'bootstrap';

import 'codemirror/mode/clike/clike';
import 'codemirror/addon/mode/simple';
//import 'codemirror/addon/selection/active-line';  TODO: reactivate??
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/mode/overlay';
// esbuild requires 'codemirror' import AFTER modes and addons
import * as CodeMirror from 'codemirror';

import { refreshContent, refreshCourseList } from './content';
import { refreshUsers } from './users';

export let editor: CodeMirror.EditorFromTextArea = null;
let tooltipList: bootstrap.Tooltip[] = [];

export function init(): void {
  // refresh course list
  refreshCourseList();

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
          /---|========|EXERCISE |Definition\.|Example\.|Theorem\.|Proof\.|Chatquestion\.|Question\.|Remark\.|JavaQuestion\.|Python\.|Authentication\.|Tikz\.|Speedreview\.|Links\.|Plot2d\.|!tex|!lang=EN|!lang=DE|!require-authentication|!require-min-score|@tags|@title|@code|@text|@solution|@given|@asserts|@options|@questions|@forbidden-keywords|@python|@matching|\/\/\/|@settings|@sage|@octave|@maxima|@answer|@database|@input|@required-keywords/,
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
  editor.setSize(null, '90%'); // TODO
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
  document.getElementById('tab-course-editor').className =
    id === 'course-editor' ? 'nav-link active' : 'nav-link';
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
    editor.refresh();
    showTooltips();
  } else if (id === 'course-management') {
    refreshContent();
  } else if (id === 'user-management') {
    refreshUsers();
  }
}

export function showTooltips(): void {
  //hideTooltips();
  // tooltip handling
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

export function hideTooltips(): void {
  for (const tooltip of tooltipList) {
    tooltip.hide();
  }
  tooltipList = [];
}

export function openTextInputModal(
  title: string,
  text: string,
  fun: () => void,
): void {
  document.getElementById('text-input-modal-title').innerHTML = title;
  document.getElementById('text-input-modal-text').innerHTML = text;
  document.getElementById('text-input-modal-button').onclick = fun;
  const i = document.getElementById(
    'text-input-modal-input',
  ) as HTMLInputElement;
  i.value = '';
  document.getElementById('text-input-modal').style.display = 'block';
}

export function closeTextInputModal(): void {
  document.getElementById('text-input-modal').style.display = 'none';
}

export { saveFile } from './content';
