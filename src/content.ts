/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import axios from 'axios';
import { showTooltips } from '.';

import { Table } from './table';

export function refreshContent(): void {
  axios
    .post('/readDB_Content', new URLSearchParams({}))
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
          console.log('rename ' + id);
        },
      );
      table.addRowButton(
        '<i class="fa-regular fa-clone"></i>',
        'clone',
        function (id: number): void {
          console.log('clone ' + id);
        },
      );
      table.addRowButton(
        '<i class="fa-solid fa-trash-can"></i>',
        'delete',
        function (id: number): void {
          console.log('delete ' + id);
        },
      );
      table.addInputRowButton(
        '<i class="fa-solid fa-square-plus"></i>',
        'create',
        function (): void {
          console.log(
            (document.getElementById('create_content_0') as HTMLInputElement)
              .value,
          );
          console.log('create ');
        },
      );
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
      table.addInputRow(1, 'create_content');
      table.populateDOM(document.getElementById('course-management-table'));
      //showTooltips();
    })
    .catch(function (error) {
      // TODO
      console.error('ERROR!!' + error);
    });
}
