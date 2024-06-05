// scripts/index.js
let columnTypes = [];
let tableTypes = [];
let tables = [];
let currentTableIndex;

const setup = () => {
    // Initialiseer gegevens uit Local Storage of maak lege arrays
    columnTypes = JSON.parse(localStorage.getItem('columnTypes')) || [];
    tableTypes = JSON.parse(localStorage.getItem('tableTypes')) || [];
    tables = JSON.parse(localStorage.getItem('tables')) || [];

    // Initialiseer DOM-elementen
    document.getElementById('addColumnTypeButton').addEventListener('click', addColumnType);
    document.getElementById('addTableTypeButton').addEventListener('click', addTableType);
    document.getElementById('addTableButton').addEventListener('click', addTable);
    document.getElementById('addColumnButton').addEventListener('click', addColumn);
    document.getElementById('addRowButton').addEventListener('click', addRow);
    document.getElementById('saveTableButton').addEventListener('click', saveTable);

    displayColumnTypes();
    displayTableTypes();
    displayTables();
};

const addColumnType = () => {
    const name = document.getElementById('columnTypeName').value;
    const description = document.getElementById('columnTypeDescription').value;

    if (name && description) {
        columnTypes.push({ name, description });
        localStorage.setItem('columnTypes', JSON.stringify(columnTypes));
        displayColumnTypes();
        document.getElementById('columnTypeName').value = '';
        document.getElementById('columnTypeDescription').value = '';
    }
};

const addTableType = () => {
    const name = document.getElementById('tableTypeName').value;
    const isFixed = document.getElementById('tableTypeFixed').value === 'fixed';
    const columnCount = document.getElementById('tableTypeColumnCount').value;

    if (name && (isFixed && columnCount > 0 || !isFixed)) {
        tableTypes.push({ name, isFixed, columnCount });
        localStorage.setItem('tableTypes', JSON.stringify(tableTypes));
        displayTableTypes();
        document.getElementById('tableTypeName').value = '';
        document.getElementById('tableTypeFixed').value = 'fixed';
        document.getElementById('tableTypeColumnCount').value = '';
    }
};

const addTable = () => {
    const name = document.getElementById('tableName').value;
    const typeIndex = document.getElementById('tableTypeSelect').selectedIndex;

    if (name && typeIndex >= 0) {
        const tableType = tableTypes[typeIndex];
        tables.push({ name, type: tableType, columns: [], rows: [] });
        localStorage.setItem('tables', JSON.stringify(tables));
        displayTables();
        document.getElementById('tableName').value = '';
        document.getElementById('tableTypeSelect').selectedIndex = 0;
    }
};

const displayColumnTypes = () => {
    const columnTypesList = document.getElementById('columnTypesList');
    columnTypesList.innerHTML = '';

    columnTypes.forEach((type, index) => {
        const li = document.createElement('li');
        li.textContent = `${type.name} - ${type.description}`;
        li.appendChild(createDeleteButton(index, 'columnTypes'));
        columnTypesList.appendChild(li);
    });
};

const displayTableTypes = () => {
    const tableTypesList = document.getElementById('tableTypesList');
    const tableTypeSelect = document.getElementById('tableTypeSelect');
    tableTypesList.innerHTML = '';
    tableTypeSelect.innerHTML = '';

    tableTypes.forEach((type, index) => {
        const li = document.createElement('li');
        li.textContent = `${type.name} - ${type.isFixed ? 'Vast' : 'Variabel'} ${type.isFixed ? `(${type.columnCount} kolommen)` : ''}`;
        li.appendChild(createDeleteButton(index, 'tableTypes'));
        tableTypesList.appendChild(li);

        const option = document.createElement('option');
        option.textContent = type.name;
        tableTypeSelect.appendChild(option);
    });
};

const displayTables = () => {
    const tablesList = document.getElementById('tablesList');
    tablesList.innerHTML = '';

    tables.forEach((table, index) => {
        const li = document.createElement('li');
        li.textContent = `${table.name} (${table.type.name})`;
        const editButton = document.createElement('button');
        editButton.textContent = 'Bewerken';
        editButton.onclick = () => editTable(index);
        li.appendChild(editButton);
        li.appendChild(createDeleteButton(index, 'tables'));
        tablesList.appendChild(li);
    });
};

const createDeleteButton = (index, type) => {
    const button = document.createElement('button');
    button.textContent = 'Verwijderen';
    button.onclick = () => {
        if (type === 'columnTypes') {
            columnTypes.splice(index, 1);
            localStorage.setItem('columnTypes', JSON.stringify(columnTypes));
            displayColumnTypes();
        } else if (type === 'tableTypes') {
            tableTypes.splice(index, 1);
            localStorage.setItem('tableTypes', JSON.stringify(tableTypes));
            displayTableTypes();
        } else if (type === 'tables') {
            tables.splice(index, 1);
            localStorage.setItem('tables', JSON.stringify(tables));
            displayTables();
        }
    };
    return button;
};

const editTable = (index) => {
    currentTableIndex = index;
    const table = tables[index];
    document.getElementById('editTableName').textContent = table.name;
    displayColumns();
    displayRows();
    document.getElementById('editTableSection').style.display = 'block';
};

const addColumn = () => {
    const name = document.getElementById('columnName').value;
    const type = columnTypes[document.getElementById('columnTypeSelect').selectedIndex]?.name;

    if (name && type) {
        tables[currentTableIndex].columns.push({ name, type });
        localStorage.setItem('tables', JSON.stringify(tables));
        displayColumns();
        document.getElementById('columnName').value = '';
        document.getElementById('columnTypeSelect').selectedIndex = 0;
    }
};

const displayColumns = () => {
    const table = tables[currentTableIndex];
    const columnsList = document.getElementById('columnsList');
    columnsList.innerHTML = '';

    table.columns.forEach((column, index) => {
        const li = document.createElement('li');
        li.textContent = `${column.name} (${column.type})`;
        li.appendChild(createDeleteButton(index, 'columns'));
        columnsList.appendChild(li);
    });
};

const addRow = () => {
    const table = tables[currentTableIndex];
    const row = table.columns.map(() => '');
    table.rows.push(row);
    localStorage.setItem('tables', JSON.stringify(tables));
    displayRows();
};

const displayRows = () => {
    const table = tables[currentTableIndex];
    const rowsList = document.getElementById('rowsList');
    rowsList.innerHTML = '';

    table.rows.forEach((row, rowIndex) => {
        const li = document.createElement('li');
        row.forEach((cell, cellIndex) => {
            const input = document.createElement('input');
            input.value = cell;
            input.onchange = (e) => {
                table.rows[rowIndex][cellIndex] = e.target.value;
                localStorage.setItem('tables', JSON.stringify(tables));
            };
            li.appendChild(input);
        });
        li.appendChild(createDeleteButton(rowIndex, 'rows'));
        rowsList.appendChild(li);
    });
};

const saveTable = () => {
    localStorage.setItem('tables', JSON.stringify(tables));
    document.getElementById('editTableSection').style.display = 'none';
    displayTables();
};

window.addEventListener("load", setup);
