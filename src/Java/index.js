let shoppingList = ['carne', 'pescado', 'fruta'];

function addToShoppingList() {
    let newArticleInput = document.querySelector('input[placeholder="nuevo articulo"]');
    let newArticle = newArticleInput.value.trim(); // Captura y limpia el valor del input

    if (newArticle) {
        shoppingList.push(newArticle); // Agrega el artículo a la lista
        newArticleInput.value = ''; // Limpia el campo de texto
        updateOutput(); // Actualiza la visualización de la lista
    }
    console.log('addToShoppingList', shoppingList);
}

function resetShoppingList() {
    shoppingList = []; // Vacía la lista
    updateOutput(); // Limpia la salida
    console.log('resetShoppingList', shoppingList);
}

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