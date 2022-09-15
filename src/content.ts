/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import axios from 'axios';
import { closeTextInputModal, openTextInputModal } from '.';
import { editor, refreshEditor, setEditorText } from './editor';

import { Table } from './table';

let selectedCourse = '';
let selectedFile = '';

export function saveFile(): void {
  if (editor == null) return;
  if (selectCourse.length == 0 || selectFile.length == 0) {
    // TODO: error message
    return;
  }
  const text = editor.getValue();
  axios
    .post(
      '/selectDB_SaveFile',
      new URLSearchParams({
        path: selectedCourse + '/' + selectedFile,
        text: text,
      }),
    )
    .then(function (response) {
      console.log(response);
      // TODO: process response
    })
    .catch(function (error) {
      // TODO
      console.error('ERROR!!' + error);
    });
}

export function selectCourse(courseName: string): void {
  selectedCourse = courseName;
  const button = document.getElementById('courselist_button');
  button.innerHTML = courseName;
  refreshFileList(selectedCourse);
}

export function selectFile(fileName: string): void {
  selectedFile = fileName;
  const button = document.getElementById('filelist_button');
  button.innerHTML = fileName;
  // load file
  axios
    .post(
      '/selectDB_ReadFile',
      new URLSearchParams({ path: selectedCourse + '/' + selectedFile }),
    )
    .then(function (response) {
      const fileVersions = response.data['fileVersions'];
      const lastVersion = fileVersions[fileVersions.length - 1];
      const path = lastVersion['path'];
      const user = lastVersion['user'];
      const version = lastVersion['version'];
      const date = lastVersion['date'];
      const text = lastVersion['text'];
      document.getElementById('course-editor-file-status').innerHTML =
        path + ' &bull; v' + version + ' &bull; ' + user + ' &bull; ' + date;
      // TODO: old document might be unsaved!
      console.log(text);
      setEditorText(text);
      /*editor.setValue(text);
      refreshEditor();
      editor.focus();*/
    })
    .catch(function (error) {
      // TODO
      console.error('ERROR!!' + error);
    });
}

export function refreshCourseList(): void {
  axios
    .post('/selectDB_Courses', new URLSearchParams({}))
    .then(function (response) {
      // console.log(response.data['courses']);
      const ul = document.getElementById('courselist_dropdown_items');
      ul.innerHTML = '';
      for (const course of response.data['courses']) {
        const li = document.createElement('li');
        ul.appendChild(li);
        const a = document.createElement('a');
        li.appendChild(a);
        a.classList.add('dropdown-item');
        a.style.cursor = 'pointer';
        a.innerHTML = course;
        a.onclick = function (): void {
          selectCourse(course);
        };
      }
    })
    .catch(function (error) {
      // TODO
      console.error('ERROR!!' + error);
    });
}

export function refreshFileList(courseName: string): void {
  axios
    .post(
      '/selectDB_CourseFiles',
      new URLSearchParams({ courseName: courseName }),
    )
    .then(function (response) {
      // console.log(response.data['courses']);
      const ul = document.getElementById('filelist_dropdown_items');
      ul.innerHTML = '';
      for (const file of response.data['files']) {
        const li = document.createElement('li');
        ul.appendChild(li);
        const a = document.createElement('a');
        li.appendChild(a);
        a.classList.add('dropdown-item');
        a.style.cursor = 'pointer';
        a.innerHTML = file;
        a.onclick = function (): void {
          selectFile(file);
        };
      }
    })
    .catch(function (error) {
      // TODO
      console.error('ERROR!!' + error);
    });
}

export function refreshContent(): void {
  axios
    .post('/selectDB_Content', new URLSearchParams({}))
    .then(function (response) {
      const table = new Table();
      table.addHeadline('Path');
      table.addHeadline('Version');
      table.addHeadline('Last Changed');
      table.addHeadline('Bytes');
      table.addHeadline('Options');
      table.addRowButton(
        '<i class="fa-solid fa-italic"></i>',
        'rename',
        function (id: number): void {
          table.setLogHTML('');
          console.log('rename ' + id);
          openTextInputModal(
            'Change Path Name',
            'new path name:',
            function (): void {
              console.log('clicked ...');
              const i = document.getElementById(
                'text-input-modal-input',
              ) as HTMLInputElement;
              const path = i.value;
              axios
                .post(
                  '/updateDB_ContentPath',
                  new URLSearchParams({ id: '' + id, path: path }),
                )
                .then(function (response) {
                  console.log(response.data);
                  if (response.data === 'OK') {
                    closeTextInputModal();
                    refreshContent();
                  } else {
                    table.setLogHTML(
                      '<span class="text-danger">' + response.data + '</span>',
                    );
                  }
                })
                .catch(function (error) {
                  // TODO
                  console.error('ERROR!!' + error);
                });
            },
          );
        },
      );
      table.addRowButton(
        '<i class="fa-regular fa-clone"></i>',
        'clone',
        function (id: number): void {
          table.setLogHTML('');
          console.log('clone ' + id);
        },
      );
      table.addRowButton(
        '<i class="fa-solid fa-trash-can"></i>',
        'delete',
        function (id: number): void {
          table.setLogHTML('');
          console.log('delete ' + id);
        },
      );
      table.addInputRowButton(
        '<i class="fa-solid fa-square-plus"></i>',
        'create',
        function (): void {
          table.setLogHTML('');
          const path = (
            document.getElementById('create_content_0') as HTMLInputElement
          ).value;
          //console.log('create file ' + path);
          axios
            .post('/insertDB_Content', new URLSearchParams({ path: path }))
            .then(function (response) {
              console.log(response.data);
              if (response.data === 'OK') {
                refreshContent();
              } else {
                table.setLogHTML(
                  '<span class="text-danger">' + response.data + '</span>',
                );
              }
            })
            .catch(function (error) {
              // TODO
              console.error('ERROR!!' + error);
            });
        },
      );
      table.addInputRow(1, 'create_content');
      const rows = response.data['rows'];
      for (const row of rows) {
        table.addRow(
          [
            row['path'],
            row['version'],
            row['date'] + ' / ' + row['user'],
            row['bytes'],
          ],
          row['id'],
        );
      }
      table.populateDOM(document.getElementById('course-management-table'));
    })
    .catch(function (error) {
      // TODO
      console.error('ERROR!!' + error);
    });
}
