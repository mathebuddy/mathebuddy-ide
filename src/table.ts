/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { hideTooltips, showTooltips } from '.';

export class Table {
  private headlines: string[] = [];
  private rows: TableRow[] = [];
  private rowButtons: TableButton[] = [];
  private inputRowButtons: TableButton[] = [];

  public addHeadline(s: string): void {
    this.headlines.push(s);
  }

  public addRow(data: string[], id = 0): void {
    this.rows.push(new TableRow(data, id));
  }

  public addInputRow(numInputFields: number, inputBaseId: string): void {
    const row = new TableRow([]);
    row.isInputRow = true;
    row.numInputFields = numInputFields;
    row.inputBaseId = inputBaseId;
    this.rows.push(row);
  }

  public addRowButton(
    text = '',
    tooltipText = '',
    fun: (id: number) => void,
  ): void {
    this.rowButtons.push(new TableButton(text, tooltipText, fun));
  }

  public addInputRowButton(
    text = '',
    tooltipText = '',
    fun: (id: number) => void,
  ): void {
    this.inputRowButtons.push(new TableButton(text, tooltipText, fun));
  }

  public populateDOM(e: HTMLElement): void {
    e.innerHTML = '';
    const table = document.createElement('table');
    e.appendChild(table);
    table.classList.add('table', 'table-striped');
    // head
    const thead = document.createElement('thead');
    table.appendChild(thead);
    const tr = document.createElement('tr');
    thead.appendChild(tr);
    for (const h of this.headlines) {
      const th = document.createElement('th');
      tr.appendChild(th);
      th.scope = 'col';
      th.innerHTML = h;
    }
    // body
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    for (const row of this.rows) {
      const tr = document.createElement('tr');
      tbody.appendChild(tr);
      let cols = 0;
      for (const d of row.data) {
        const td = document.createElement('td');
        tr.appendChild(td);
        td.innerHTML = d;
        cols++;
      }
      for (let i = 0; i < row.numInputFields; i++) {
        const td = document.createElement('td');
        tr.appendChild(td);
        const input = document.createElement('input');
        input.type = 'text';
        input.style.width = '100%';
        input.id = row.inputBaseId + '_' + i;
        td.appendChild(input);
        cols++;
      }
      for (let i = cols + 1; i < this.headlines.length; i++) {
        const td = document.createElement('td');
        tr.appendChild(td);
      }
      const td = document.createElement('td');
      tr.appendChild(td);
      const buttons = row.isInputRow ? this.inputRowButtons : this.rowButtons;
      for (const b of buttons) {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('btn', 'btn-outline-dark', 'btn-sm');
        button.setAttribute('data-bs-toggle', 'tooltip');
        button.setAttribute('data-bs-placement', 'top');
        button.title = b.tooltipText;
        button.innerHTML = b.text;
        button.onclick = function (): void {
          b.fun(row.id);
          hideTooltips();
          button.blur();
        };
        td.appendChild(button);
        const separator = document.createElement('span');
        separator.innerHTML = '&nbsp';
        td.appendChild(separator);
      }
    }
  }
}

export class TableRow {
  data: string[] = [];
  isInputRow = false;
  numInputFields = 0;
  inputBaseId = '';
  id = 0;
  constructor(data: string[], id = 0) {
    this.data = data;
    this.id = id;
  }
}

export class TableButton {
  text = '';
  tooltipText = '';
  fun: (id: number) => void;
  constructor(text: string, tooltipText: string, fun: (id: number) => void) {
    this.text = text;
    this.tooltipText = tooltipText;
    this.fun = fun;
  }
}
