document.addEventListener("DOMContentLoaded", function() {
  loadCDMNTableTypes();
  loadCDMNTables();
});

function addCDMNTableType() {
  const name = document.getElementById('cdmn-table-type-name').value;
  const columnCount = parseInt(document.getElementById('cdmn-table-fixed-columns').value);
  if (name && !isNaN(columnCount)) {
    let cdmnTableTypes = JSON.parse(localStorage.getItem('cdmnTableTypes')) || [];
    let columns = [];
    for (let i = 1; i <= columnCount; i++) {
      columns.push(`Kolom ${i}`);
    }
    cdmnTableTypes.push({ name, columns });
    localStorage.setItem('cdmnTableTypes', JSON.stringify(cdmnTableTypes));
    document.getElementById('cdmn-table-type-name').value = '';
    document.getElementById('cdmn-table-fixed-columns').value = '';
    loadCDMNTableTypes();
  }
}

function loadCDMNTableTypes() {
  const cdmnTableTypes = JSON.parse(localStorage.getItem('cdmnTableTypes')) || [];
  const list = document.getElementById('cdmn-table-types-list');
  const select = document.getElementById('cdmn-table-type-select');
  list.innerHTML = '';
  select.innerHTML = '';
  cdmnTableTypes.forEach((type, index) => {
    const li = document.createElement('li');
    li.textContent = `${type.name} (Kolommen: ${type.columns.length})`;
    list.appendChild(li);

    const option = document.createElement('option');
    option.value = index;
    option.textContent = type.name;
    select.appendChild(option);
  });
}

function createCDMNTable() {
  const typeIndex = document.getElementById('cdmn-table-type-select').value;
  if (typeIndex !== '') {
    let cdmnTables = JSON.parse(localStorage.getItem('cdmnTables')) || [];
    cdmnTables.push({ typeIndex: parseInt(typeIndex), rows: [] });
    localStorage.setItem('cdmnTables', JSON.stringify(cdmnTables));
    loadCDMNTables();
  }
}

function loadCDMNTables() {
  const cdmnTables = JSON.parse(localStorage.getItem('cdmnTables')) || [];
  const cdmnTableTypes = JSON.parse(localStorage.getItem('cdmnTableTypes')) || [];
  const list = document.getElementById('cdmn-tables-list');
  list.innerHTML = '';
  cdmnTables.forEach((table, tableIndex) => {
    const type = cdmnTableTypes[table.typeIndex];
    const div = document.createElement('div');
    div.className = 'table-container';
    div.innerHTML = `<h3>${type.name} Tabel</h3>`;

    const tableElement = document.createElement('table');
    const header = document.createElement('tr');
    type.columns.forEach((columnName, colIndex) => {
      const th = document.createElement('th');
      th.classList.add('editable-header');
      const inputContainer = document.createElement('div');
      inputContainer.style.display = 'flex';
      inputContainer.style.alignItems = 'center';

      const input = document.createElement('input');
      input.type = 'text';
      input.value = columnName;
      input.disabled = true;
      input.classList.add('header-input');
      input.onchange = () => updateColumnName(table.typeIndex, colIndex, input.value);

      const editButton = document.createElement('button');
      editButton.textContent = '✏️';
      editButton.onclick = () => input.disabled = false;

      inputContainer.appendChild(input);
      inputContainer.appendChild(editButton);
      th.appendChild(inputContainer);
      header.appendChild(th);
    });
    tableElement.appendChild(header);

    table.rows.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      row.forEach((cell, cellIndex) => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = cell;
        input.disabled = true;
        input.classList.add('cell-input');
        input.onchange = () => updateCell(tableIndex, rowIndex, cellIndex, input.value);
        td.appendChild(input);
        tr.appendChild(td);
      });
      tableElement.appendChild(tr);
    });

    const addRowButton = document.createElement('button');
    addRowButton.textContent = 'Rij toevoegen';
    addRowButton.onclick = () => addRow(tableIndex, type.columns.length);

    const editButton = document.createElement('button');
    editButton.textContent = '✏️';
    editButton.onclick = () => enableEditing(tableIndex);

    div.appendChild(tableElement);
    div.appendChild(addRowButton);
    div.appendChild(editButton);
    list.appendChild(div);
  });
}

function addRow(tableIndex, columnCount) {
  let cdmnTables = JSON.parse(localStorage.getItem('cdmnTables'));
  let newRow = Array(columnCount).fill('');
  cdmnTables[tableIndex].rows.push(newRow);
  localStorage.setItem('cdmnTables', JSON.stringify(cdmnTables));
  loadCDMNTables();
}

function updateCell(tableIndex, rowIndex, cellIndex, value) {
  let cdmnTables = JSON.parse(localStorage.getItem('cdmnTables'));
  cdmnTables[tableIndex].rows[rowIndex][cellIndex] = value;
  localStorage.setItem('cdmnTables', JSON.stringify(cdmnTables));
}

function updateColumnName(typeIndex, colIndex, value) {
  let cdmnTableTypes = JSON.parse(localStorage.getItem('cdmnTableTypes'));
  cdmnTableTypes[typeIndex].columns[colIndex] = value;
  localStorage.setItem('cdmnTableTypes', JSON.stringify(cdmnTableTypes));
  loadCDMNTableTypes();
  loadCDMNTables();
}

function enableEditing(tableIndex) {
  const tableElement = document.querySelectorAll('#cdmn-tables-list div')[tableIndex].querySelector('table');
  const inputs = tableElement.querySelectorAll('.cell-input');
  inputs.forEach(input => {
    input.disabled = false;
  });
}

function clearLocalStorage() {
  localStorage.clear();
  loadCDMNTableTypes();
  loadCDMNTables();
}
