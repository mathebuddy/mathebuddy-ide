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

export function refreshUsers(): void {
  axios
    .post('/readDB_User', new URLSearchParams({}))
    .then(function (response) {
      const table = new Table();
      table.addHeadline('Login');
      table.addHeadline('Mail');
      table.addHeadline('Created');
      table.addHeadline('Last Login');
      table.addHeadline('Admin');
      table.addHeadline('Options');
      table.addRowButton(
        '<i class="fa-solid fa-trash-can"></i>',
        'delete',
        function (id: number): void {
          console.log('delete ' + id);
        },
      );
      table.addRowButton(
        '<i class="fa-solid fa-key"></i>',
        'change password',
        function (id: number): void {
          console.log('change password ' + id);
        },
      );
      table.addRowButton(
        '<i class="fa-solid fa-crown"></i>',
        'toggle admin',
        function (id: number): void {
          console.log('toggle admin ' + id);
        },
      );
      const rows = response.data['rows'];
      for (const row of rows) {
        table.addRow(
          [
            row['login'],
            row['mail'],
            row['createDate'],
            row['loginDate'],
            row['admin'] == 1 ? 'YES' : 'NO',
          ],
          row['id'],
        );
      }
      table.populateDOM(document.getElementById('user-management-table'));
      refreshUserPrivileges();
    })
    .catch(function (error) {
      // TODO
      console.error('ERROR!!' + error);
    });
}

function refreshUserPrivileges(): void {
  axios
    .post('/readDB_Access', new URLSearchParams({}))
    .then(function (response) {
      const table = new Table();
      table.addHeadline('Login');
      table.addHeadline('Root Directory');
      table.addHeadline('Read');
      table.addHeadline('Write');
      table.addHeadline('QA');
      table.addHeadline('Options');
      table.addRowButton(
        '<i class="fa-solid fa-glasses"></i>',
        'toggle read access',
        function (id: number): void {
          console.log('toggle read access ' + id);
        },
      );
      table.addRowButton(
        '<i class="fa-solid fa-pen"></i>',
        'toggle write access',
        function (id: number): void {
          console.log('toggle write access ' + id);
        },
      );
      table.addRowButton(
        '<i class="fa-solid fa-star"></i>',
        'toggle QA access',
        function (id: number): void {
          console.log('toggle QS access ' + id);
        },
      );
      table.addInputRowButton(
        '<i class="fa-solid fa-square-plus"></i>',
        'create',
        function (): void {
          console.log('create ');
        },
      );
      const rows = response.data['rows'];
      for (const row of rows) {
        table.addRow(
          [
            row['user'],
            row['path'],
            row['read'] == 1 ? 'YES' : 'NO',
            row['write'] == 1 ? 'YES' : 'NO',
            row['qa'] == 1 ? 'YES' : 'NO',
          ],
          row['id'],
        );
      }
      table.addInputRow(2, 'create_privilege_item');
      table.populateDOM(document.getElementById('user-privileges-table'));
      //showTooltips();
    })
    .catch(function (error) {
      // TODO
      console.error('ERROR!!' + error);
    });
}
