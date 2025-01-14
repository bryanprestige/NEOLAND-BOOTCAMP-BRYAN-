let shoppingList = [];


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
    //add to shopping list as a string
    let articleName = document.getElementById ('article').value 
    let articleQty = document.getElementById ('qty').value
    let articlePrice = document.getElementById ('precio').value
    let logText = document.getElementById ('log')
    let shoppingListTable = document.getElementById('shopping-list-table') 
    let shoppingListTableBody = document.getElementById ('shopping-list-table-body')
    let shoppingListTableTotal = document.getElementById ('shopping-list-table-total')
    let resetButton = document.getElementById('reset-button')
    let totalAmount = 0;

   
    //Define new article object
     let newArticleObject = {
        qty:0,
        name:'',
        price: 0
    }

    if (articleName === '') {
    console.error('Falta el nombre del articulo')
    return
    }

    //Depending on article type, assign default qty and price
    switch (articleName) {
    case PRODUCTS.MILK:
        articleQty = 1 
        articlePrice = 5.10       
        break;
    case PRODUCTS.BANANA:
        articleQty = 1
        articlePrice = 1.25   
        break
    case PRODUCTS.BAGUETTE:
        articleQty = 1
        articlePrice = 0.50  
        break
    case PRODUCTS.BREAD:
        articleQty = 1
        articlePrice = 1.25   
        break
    case PRODUCTS.CAT_LITTER:
        articleQty = 2
        articlePrice = 2.80
        break
    case PRODUCTS.CHICKEN:
        articleQty = 1
        articlePrice = 3.95  
        break
    case PRODUCTS.GARLIC:
        articleQty = 1
        articlePrice = 1.63  
        break
    case PRODUCTS.NUTELLA:
        articleQty = 1
        articlePrice = 3.95   
        break
    case PRODUCTS.OLIVE_OIL:
        articleQty = 1
        articlePrice = 6.35
        break
    case PRODUCTS.ONION:
        articleQty = 1
        articlePrice = 1.55  
        break
    case PRODUCTS.PASTA:
        articleQty = 2
        articlePrice = 2.80
        break
    case PRODUCTS.PORK:
        articleQty = 1
        articlePrice = 3.22   
        break
    case PRODUCTS.RICE:
        articleQty = 2
        articlePrice = 1.82   
        break
    case PRODUCTS.SUNFLOWER_OIL:
        articleQty = 1
        articlePrice = 1.79   
        break
    case PRODUCTS.TOILET_PAPER:
        articleQty = 12
        articlePrice = 4.70   
        break
    }

    console.log (newArticleObject)    


    //Cast to numbers when needed
    articleQty = Number(articleQty)
    articlePrice = Number(articlePrice)

    //Update declared new article object with final values
    newArticleObject = {
    qty:articleQty,
    name:articleName,
    price: articlePrice
    }

    //ADD TO SHOPPING LIST AS OBJECT
    shoppingList.push(newArticleObject)


    //1.
    let newTableRow = document.createElement ('tr')
    //2.
    let qtyCell = document.createElement ('td')
    let nameCell = document.createElement ('td')
    let priceCell = document.createElement ('td')
    let subtotalCell = document.createElement ('td')
    //3.
    qtyCell.innerText = newArticleObject.qty
    nameCell.innerText = newArticleObject.name
    priceCell.innerText = newArticleObject.price
    subtotalCell.innerText = (newArticleObject.qty * newArticleObject.price) + '€'
    //4.
    newTableRow.appendChild(qtyCell)
    newTableRow.appendChild(nameCell)
    newTableRow.appendChild(priceCell)
    newTableRow.appendChild(subtotalCell)
    //5.
    shoppingListTableBody.appendChild(newTableRow)
    //CALCULATE TOTAL AMOUNT    
    totalAmount = 0; // Reinicia el total antes de calcularlo
    for (let i = 0; i < shoppingList.length; i++) {
        let shoppingListItem = shoppingList[i];
        let shoppingListItemSubtotal = shoppingListItem.qty * shoppingListItem.price;
        totalAmount += shoppingListItemSubtotal; // Suma el subtotal al total
    }
    shoppingListTableTotal.innerText = totalAmount.toFixed(2) + '$';

    //LOG
    if (shoppingList.length === 1) {
        resetButton.style.display = 'block'; // Cambia el estilo a visible
    }
    console.log('addToShoppinglist NEW ARTICLE',newArticleObject)
    console.log('addToShoppingList SHOPPING LIST',shoppingList)
    console.log('parrafo de logs',logText)
    console.log(''),shoppingListTable
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
    shoppingListTableTotal.innerText = '0.00$';

    // Oculta el botón de reset
    const resetButton = document.getElementById('reset-button');
    resetButton.style.display = 'none';

    console.log('La lista de la compra ha sido reiniciada.');
}


/*function resetShoppingList() {
    shoppingList = []; // Vacía la lista
    updateOutput(); // Limpia la salida
    console.log('resetShoppingList', shoppingList);
}
// function addToShoppingList() {
    // let newArticleInput = document.querySelector('input[placeholder="nuevo articulo"]');
    // let newArticle = newArticleInput.value.trim(); // Captura y limpia el valor del input

    // if (newArticle) {
        // shoppingList.push(newArticle); // Agrega el artículo a la lista
        // newArticleInput.value = ''; // Limpia el campo de texto
        // updateOutput(); // Actualiza la visualización de la lista
    // }
    // console.log('addToShoppingList', shoppingList);
// }



/*
function updateOutput() {
    let outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Limpia el contenido previo
    shoppingList.forEach(article => {
        let p = document.createElement('p'); // Crea un elemento <p> para cada artículo
        p.textContent = article; // Agrega el texto del artículo
        outputDiv.appendChild(p); // Añade el <p> al contenedor
    });
}

function resetShoppingList() {
    shoppingList = []; // Vacía la lista
    updateOutput(); // Limpia la salida visual
    let newArticleInput = document.querySelector('input[placeholder="nuevo articulo"]');
    newArticleInput.value = ''; // Limpia el campo de texto
    console.log('resetShoppingList', shoppingList);
}

function updateOutput() {
    let outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Limpia el contenido previo
    shoppingList.forEach(article => {
        let p = document.createElement('p');
        p.textContent = article;
        outputDiv.appendChild(p);
    });
}
*/
