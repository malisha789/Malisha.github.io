document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => displayData(data))
        .catch(error => console.error('Error fetching data:', error));
});

let total = 0;

function displayData(data) {
    const content = document.getElementById('content');

    Object.keys(data).forEach(category => {
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category;
        content.appendChild(categoryTitle);

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Header Row
        const headerRow = document.createElement('tr');
        ['Image', 'Name', 'Price', 'Quantity', 'Action'].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Data Rows
        data[category].forEach(item => {
            const row = document.createElement('tr');

            const imgCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = item.imagePath;
            img.alt = item.name;
            imgCell.appendChild(img);
            row.appendChild(imgCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            const priceCell = document.createElement('td');
            priceCell.textContent = `$${item.price}`;
            row.appendChild(priceCell);

            const quantityCell = document.createElement('td');
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = '0';
            quantityInput.value = '0';
            quantityCell.appendChild(quantityInput);
            row.appendChild(quantityCell);

            const actionCell = document.createElement('td');
            const addButton = document.createElement('button');
            addButton.textContent = 'Add Item';
            addButton.addEventListener('click', () => addItem(item, quantityInput.value));
            actionCell.appendChild(addButton);
            row.appendChild(actionCell);

            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        content.appendChild(table);
    });
}

function addItem(item, quantity) {
    if (quantity > 0) {
        const table = document.getElementById('selectedItemsTable').querySelector('tbody');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><img src="${item.imagePath}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>${quantity}</td>
        `;

        table.appendChild(row);

        total += item.price * quantity;
        document.getElementById('totalPrice').textContent = `$${total}`;
    } else {
        alert('Please enter a valid quantity.');
    }
}

function clearItems() {
    const tableBody = document.querySelector('#selectedItemsTable tbody');
    tableBody.innerHTML = ''; // Clear all table rows
    total = 0; // Reset total
    document.getElementById('totalPrice').textContent = `$${total}`; 
    alert('All selected items have been cleared.');
}

// Event Listeners
document.getElementById('buyNow').addEventListener('click', () => {
    window.location.href = 'buyNow.html';
});
document.getElementById('buyNow').addEventListener('click', () => {
    const selectedItems = [];
    const rows = document.querySelectorAll('#selectedItemsTable tbody tr');

    rows.forEach(row => {
        const img = row.querySelector('img').src;
        const name = row.children[1].textContent;
        const price = row.children[2].textContent.replace('$', '');
        const quantity = row.children[3].textContent;

        selectedItems.push({ img, name, price: parseFloat(price), quantity: parseInt(quantity) });
    });

    const total = document.getElementById('totalPrice').textContent.replace('$', '');

    // Save data to localStorage
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    localStorage.setItem('totalPrice', total);

    // Redirect to the Buy Now page
    window.location.href = 'buyNow.html';
});


