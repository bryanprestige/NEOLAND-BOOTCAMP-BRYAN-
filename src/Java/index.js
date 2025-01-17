let shoppingList = [];

//const storeData = JSON.parse(localStorage.getItem('shoppingList'))
//storeData.forEach(savedArticle => {
  //  shoppingList.push(savedArticle)

//TO DO: define my shopping list items 
const PRODUCTS = {
    MILK: 'leche',
    BANANA: 'platano',
    CHICKEN: 'pollo',
    CAT_LITTER: 'arena gato',
    TOILET_PAPER: 'papel higienico',
    PASTA: 'pasta',
    RICE: 'arroz',
    PORK:'cerdo',
    NUTELLA: 'nutella',
    BAGUETTE: 'pan',
    BREAD: 'pan de molde',
    ONION: 'cebolla',
    GARLIC: 'ajo',
    OLIVE_OIL: 'aceite oliva',
    SUNFLOWER_OIL: 'aceite girasol'
}



function addToShoppingList() {
    // Obtener los valores de los inputs
    let articleName = document.getElementById('article').value;
    let articleQty = document.getElementById('qty').value;
    let articlePrice = document.getElementById('precio').value;
    
    let shoppingListTableBody = document.getElementById('shopping-list-table-body');
    let shoppingListTableTotal = document.getElementById('shopping-list-table-total');
    let resetButton = document.getElementById('reset-button');
    let totalAmount = 0;

    // Validar que se haya ingresado un nombre
    if (articleName === '') {
        console.error('Falta el nombre del artículo');
        return;
    }

    // Establecer valores predeterminados según el artículo
    switch (articleName) {
        case PRODUCTS.MILK:
            articleQty = 1;
            articlePrice = 2.10;
            break;
        case PRODUCTS.BANANA:
            articleQty = 1;
            articlePrice = 1.25;
            break;
        case PRODUCTS.CHICKEN:
            articleQty = 1;
            articlePrice = 4.50;
            break;
        case PRODUCTS.NUTELLA:
            articleQty = 1;
            articlePrice = 7.10;
            break;
        case PRODUCTS.PORK:
            articleQty = 1;
            articlePrice = 6.99;
            break;
        case PRODUCTS.ONION:
            articleQty = 1;
            articlePrice = 6.7;
            break;
        // Agregar más casos según sea necesario
    }

    // Convertir a números los valores de cantidad y precio
    articleQty = Number(articleQty);
    articlePrice = Number(articlePrice);

    // Crear el objeto del artículo
    let newArticleObject = {
        qty: articleQty,
        name: articleName,
        price: articlePrice
    };

    // Agregar el artículo al array
    shoppingList.push(newArticleObject);

    //Save shoppinh list in localstorage 
   // localStorage.setItem('shoppingList', JSON.stringify(shoppingList))

    // Crear los elementos de la fila
    let newTableRow = document.createElement('tr');
    let qtyCell = document.createElement('td');
    let nameCell = document.createElement('td');
    let priceCell = document.createElement('td');
    let subtotalCell = document.createElement('td');
    let borrarCell = document.createElement('button');

    // Asignar valores a las celdas
    qtyCell.innerText = newArticleObject.qty;
    nameCell.innerText = newArticleObject.name;
    priceCell.innerText = newArticleObject.price.toFixed(2) + '€';
    subtotalCell.innerText = (newArticleObject.qty * newArticleObject.price).toFixed(2) + '€';
    borrarCell.innerText = '🗑';
    borrarCell.classList.add('delete-button');

    // Agregar evento de clic al botón de borrar
    borrarCell.addEventListener('click', function () {
        // Elimina la fila del DOM
        shoppingListTableBody.removeChild(newTableRow);
    
        // Busca y elimina el objeto correspondiente en shoppingList
        const indexToRemove = shoppingList.findIndex(item => 
            item.name === newArticleObject.name && 
            item.qty === newArticleObject.qty && 
            item.price === newArticleObject.price
        );
    
        if (indexToRemove > -1) {
            shoppingList.splice(indexToRemove, 1);
        }
    
        // Recalcula el total
        let newTotal = shoppingList.reduce((acc, item) => acc + item.qty * item.price, 0);
        shoppingListTableTotal.innerText = newTotal.toFixed(2) ;
    
        // Si la lista queda vacía, oculta el botón de reset
        if (shoppingList.length === 0) {
            resetButton.style.display = 'none';
        }

        //localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
    
        //console.log('Artículo eliminado. Nueva lista:', shoppingList);
    });

    // Agregar celdas a la fila
    newTableRow.appendChild(qtyCell);
    newTableRow.appendChild(nameCell);
    newTableRow.appendChild(priceCell);
    newTableRow.appendChild(subtotalCell);
    newTableRow.appendChild(borrarCell);

    // Agregar la fila al cuerpo de la tabla
    shoppingListTableBody.appendChild(newTableRow);

    // Calcular y mostrar el total
    totalAmount = shoppingList.reduce((total, item) => total + item.qty * item.price, 0);
    shoppingListTableTotal.innerText = totalAmount.toFixed(2) ;

    // Mostrar el botón de reset si la lista tiene elementos
    if (shoppingList.length === 1) {
        resetButton.style.display = 'block';
    }

    console.log('Artículo agregado:', newArticleObject);
    console.log('Lista de la compra:', shoppingList);
}

function getRandomColor() {
    // Genera un color aleatorio en formato hexadecimal
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function changeHeaderAndFooterColor() {
    const header = document.querySelector('header'); // Selecciona el header
    const footer = document.querySelector('footer'); // Selecciona el footer
    const randomColor = getRandomColor(); // Genera un color aleatorio

    header.style.backgroundColor = randomColor; // Cambia el fondo del header
    footer.style.backgroundColor = randomColor; // Cambia el fondo del footer
    console.log(`Nuevo color del header y footer: ${randomColor}`); // Opcional para depuración
}

function resetShoppingList() {
    // Limpia el array de la lista de la compra
    shoppingList = [];

    // Limpia el contenido del cuerpo de la tabla
    const shoppingListTableBody = document.getElementById('shopping-list-table-body');
    shoppingListTableBody.innerHTML = '';

    // Reinicia el total a 0 y actualiza el campo correspondiente
    const shoppingListTableTotal = document.getElementById('shopping-list-table-total');
    shoppingListTableTotal.innerText = '0.00';

    // Oculta el botón de reset
    const resetButton = document.getElementById('reset-button');
    resetButton.style.display = 'none';

    document.getElementById('article').value = '';
    document.getElementById('qty').value = '';
    document.getElementById('precio').value = '';

    console.log('La lista de la compra ha sido reiniciada.');
}
