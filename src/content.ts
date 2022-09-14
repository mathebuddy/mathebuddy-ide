/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import axios from 'axios';
import { closeTextInputModal, openTextInputModal } from '.';

import { Table } from './table';

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
                  'updateDB_ContentPath',
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
            .post('insertDB_Content', new URLSearchParams({ path: path }))
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
      //showTooltips();
    })
    .catch(function (error) {
      // TODO
      console.error('ERROR!!' + error);
    });
}
