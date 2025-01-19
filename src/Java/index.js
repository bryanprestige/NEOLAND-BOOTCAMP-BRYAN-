//SHOPPING LIST DATABASE
let shoppingList = [];

//MY SHOPPING LIST ITEMS
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
// ASSIGN DOM CONTENT LOADED EVENT
document.addEventListener('DOMContentLoaded', onDomContentLoaded)
//=====EVENTS=====//
function onDomContentLoaded() {
    const addButton = document.getElementById('add-button')
    const resetButton = document.getElementById('reset-button')
    const surpriseButton = document.getElementById('surprise-button')

    addButton.addEventListener('click',addToShoppingList)
    resetButton.addEventListener('click',resetShoppingList)
    surpriseButton.addEventListener('click',changeHeaderAndFooterColor)
}

//=====EVENTS=====//
function addToShoppingList(e) {
    // GET THE VALUE OF THE INPUTS
    let articleName = document.getElementById('article').value;
    let articleQty = document.getElementById('qty').value;
    let articlePrice = document.getElementById('precio').value;
    let resetButton = document.getElementById('reset-button');
    //GET ELEMENTS TO MOFIDY
    let shoppingListTableBody = document.getElementById('shopping-list-table-body');
    let shoppingListTableTotal = document.getElementById('shopping-list-table-total');
    //DEFINE THE AMOUNT 
    let totalAmount = 0;

    // VALIDATE THAT A NAME HAS BEEN INTRODUCED
    //WONT WORK WITHOUT THIS
    if (articleName === '') {
        console.error('Falta el nombre del artículo');
        return;
    }
    // ESTABLISHED THE QUANTITY AND PRICE OF YOU FAVOURITES ARTICLES
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
    // CONVERT THE QUANTITY AND PRICE TO NUMBERS
    //  CREAT THE OBJECT OF THE ARTICLE
    let newArticleObject = {
        name: articleName,
        qty: Number(articleQty),
        price: Number(articlePrice),
    }

    // ADD THE NEW ITEM CREATED TO THE SHOPPING LIST ARRAY
    shoppingList.push(newArticleObject);

    //SAVE SHOPPING LIST IN LOCAL STORAGE
   localStorage.setItem('shoppingList', JSON.stringify(shoppingList))

    // CREATE THE ELEMENTS OF THE ROW
    let newTableRow = document.createElement('tr');
    let qtyCell = document.createElement('td');
    let nameCell = document.createElement('td');
    let priceCell = document.createElement('td');
    let subtotalCell = document.createElement('td');
    let deleteCell = document.createElement('button');

    // ASSIGN VALUE TO THE CELLS
    qtyCell.innerText = newArticleObject.qty;
    nameCell.innerText = newArticleObject.name;
    priceCell.innerText = newArticleObject.price.toFixed(2) + '€';
    subtotalCell.innerText = (newArticleObject.qty * newArticleObject.price).toFixed(2) + '€';
    deleteCell.innerText = '🗑';
    deleteCell.classList.add('delete-button');

    //ADD CELLS TO THE RAW
    newTableRow.appendChild(qtyCell);
    newTableRow.appendChild(nameCell);
    newTableRow.appendChild(priceCell);
    newTableRow.appendChild(subtotalCell);
    newTableRow.appendChild(deleteCell);
   
    //SAVE THE LIST TO LOCAL STORAGE
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
    
    // Agregar la fila al cuerpo de la tabla
    shoppingListTableBody.appendChild(newTableRow);

    // ADDING EVENT TO THE DELETE RAW BUTTON
    deleteCell.addEventListener('click', function () {
            // REMOVE THE RAW FROM THE DOCUMENT
            shoppingListTableBody.removeChild(newTableRow);
        
            // SEARCH AND FIND THE ITEMTO DELETE ON THE BODY
            const indexToRemove = shoppingList.findIndex(item => 
                item.name === newArticleObject.name && 
                item.qty === newArticleObject.qty && 
                item.price === newArticleObject.price
            );

            if (indexToRemove > -1) {
                shoppingList.splice(indexToRemove, 1);
            }
        
            // RECALCULATE THE TOTAL
            let newTotal = shoppingList.reduce((acc, item) => acc + item.qty * item.price, 0);
            shoppingListTableTotal.innerText = newTotal.toFixed(2) ;
        
            // IF THE LIST IS EMPTY, HIDE THE RESET BUTTON
            if (shoppingList.length === 0) {
                resetButton.style.display = 'none';
            }
        }
    );
 
    // CALCULATE AND SHOW THE TOTAL
    totalAmount = shoppingList.reduce((total, item) => total + item.qty * item.price, 0);
    shoppingListTableTotal.innerText = totalAmount.toFixed(2) ;

    // SHOW THE RESET BUTTON IF THE LIST HAS ANY ITEMS
    if (shoppingList.length === 1) {
        resetButton.style.display = 'block';
    }
    //EMPTY THE PRODUCT
    document.getElementById('article').value = '';
}

function resetShoppingList(e) {
    // CLEAR THE ARRY OF THE SHOPPING LIST
    shoppingList = [];

    // CLEAR THE CONTENT OF THE TABLE BODY
    const shoppingListTableBody = document.getElementById('shopping-list-table-body');
    shoppingListTableBody.innerHTML = '';

    // RESET THE TOTAL OF THE SHOPPING LIST TO 0
    const shoppingListTableTotal = document.getElementById('shopping-list-table-total');
    shoppingListTableTotal.innerText = '0.00';

    // HIDE THE RESET BUTTON
    const resetButton = document.getElementById('reset-button');
    resetButton.style.display = 'none';
    // EMPTY THE VALUE OF THE INPUTS
    document.getElementById('article').value = '';
    document.getElementById('qty').value = '';
    document.getElementById('precio').value = '';
}

function changeHeaderAndFooterColor(e) {
    //GENERATE A RAMDON COLOR IN THE HEXA FORMAT
        function getRandomColor() {
            return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        }
        //GET THE HEADER AND THE FOOTER
        const header = document.querySelector('header'); 
        const footer = document.querySelector('footer'); 
    
        //GET A RAMDOM COLOR FOR THE HEADER AND ANOTHER FOR THE FOOTER
        header.style.backgroundColor = getRandomColor();
        footer.style.backgroundColor = getRandomColor(); 
    }