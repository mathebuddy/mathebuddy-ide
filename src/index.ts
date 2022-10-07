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

import { Simulator } from '@mathebuddy/mathebuddy-simulator/lib/sim';
import { Compiler } from '@mathebuddy/mathebuddy-compiler/lib/';

import * as bootstrap from 'bootstrap';

import { refreshContent, refreshCourseList } from './content';
import { editor, initEditor, refreshEditor } from './editor';
import { refreshUsers } from './users';
import { DocContainer } from '@mathebuddy/mathebuddy-simulator/lib/interfaces';

let tooltipList: bootstrap.Tooltip[] = [];

export function init(): void {
  initEditor();
  refreshCourseList();
}

export function updateSimulator(): void {
  const data = editor.getValue();
  const compiler = new Compiler();
  compiler.run(data);
  const compiledCourse = compiler.getCourse().toJSON();
  console.log(compiledCourse);

  const deviceContentElement = document.getElementById('device-content');
  const sim = new Simulator(
    compiledCourse as any as DocContainer, // TODO: "any"
    deviceContentElement,
  );
  const ok = sim.generateDOM('intro'); // TODO
  if (ok) {
    document.getElementById('simulator-log').innerHTML = sim.getJSON();
  } else {
    document.getElementById('simulator-log').innerHTML =
      'Error: DOCUMENT NOT FOUND';
  }

  /*const sim = mathebuddySIM.createSim(documentData, deviceContent, logContent);
  if (mathebuddySIM.generateDOM(sim, 'intro') == false) {
    console.log("ERROR: there is no document 'intro'");
  }*/
}

export function openTab(id: string): void {
  // main panels
  document.getElementById('home').style.display =
    id === 'home' ? 'block' : 'none';
  document.getElementById('course-editor').style.display =
    id === 'course-editor' ? 'block' : 'none';
  document.getElementById('course-management').style.display =
    id === 'course-management' ? 'block' : 'none';
  document.getElementById('user-management').style.display =
    id === 'user-management' ? 'block' : 'none';
  // tabs for main panels
  document.getElementById('tab-home').className =
    id === 'home' ? 'nav-link active' : 'nav-link';
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
    id === 'course-editor' || id === 'user-management' ? 'none' : 'block';
  // refresh codemirror editors
  if (id === 'course-editor') {
    refreshEditor();
    //showTooltips();
  } else if (id === 'course-management') {
    refreshContent();
  } else if (id === 'user-management') {
    refreshUsers();
  }
  //hideTooltips();
  //hideTooltips();
  //showTooltips();
  //refreshTooltips();
}

export function showTooltips(): void {
  //hideTooltips();
  // tooltip handling
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, { trigger: 'hover' });
  });
  console.log('tooltips: ' + tooltipList.length);
}

export function hideTooltips(): void {
  for (const tooltip of tooltipList) {
    tooltip.hide();
  }
  //tooltipList = [];
}

export function refreshTooltips(): void {
  for (const tooltip of tooltipList) {
    tooltip.update();
  }
  //tooltipList = [];
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
