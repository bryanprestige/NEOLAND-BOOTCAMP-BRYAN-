1//SOLUCION RAPIDA Y MODERNA PERO NO ES EFICIENTE
import POKEMONS from '../pokemon/pokedex.json' with {type:'json'}

  console.log ('datos de bulbasaur',POKEMONS)
  
  readPokemonsList()

  //**HOISTING */


  /**
   * Leemos los datos POKEMONS y con ellos construimos la tabla html
   */
  function readPokemonsList() {
    // 15 DE ENERO: ESTO ESTÁ MAL
    const LISTA = document.getElementsByClassName('pokemon-gallery')[0]
    // 1. Por cada elemento en la lista de pokemons,
    //    añadimos un nuevo elemento a la lista
    // for (let i = 0; i < POKEMONS.length; i++){
    for (let i = 0; i < POKEMONS.length; i++){
      let pokemonId = POKEMONS[i].id
      // 2. Crear un nuevo nodo LI
      let liElement = document.createElement('li')
      liElement.className = 'pokemon-card'
      // 2.1. Crear el link a la ficha
      let aElement = document.createElement('a')
      aElement.href = './ficha.html?id=' + pokemonId
      // 2.2.1. Crear el figure
      let figureElement = document.createElement('figure')
      // 2.2.1.1. Crear la imagen
      let imgElement = document.createElement('img')
      // Arreglar los id's que están mal en la carpeta images
    
      const numeroImagen = String(pokemonId).padStart(3, '0')
      imgElement.src = './pokemon/images/' + numeroImagen + '.png'
      // 2.2.1.2. Añadir la imagen al figure
      figureElement.appendChild(imgElement)
      // 2.2.1.3. Crear el figcaption
      let figcaptionElement = document.createElement('figure')
      figcaptionElement.innerText = 'Nº ' + numeroImagen
      // 2.2.1.4. Añadir el figcaption al figure
      figureElement.appendChild(figcaptionElement)
      // 2.2.2. Añadir el figure al link
      aElement.appendChild(figureElement)
      // 2.2. Añadir el link al LI
      liElement.appendChild(aElement)
      // 2.3. Crear el nombre del pokemon
      let h1Element = document.createElement('h1')
      h1Element.innerText = POKEMONS[i].name.english
      // 2.4. Añadir el nombre al LI
      liElement.appendChild(h1Element)
      // 2.5. Crear la lista de tags
      // 2.5.1. Crear los tags
      // 2.5.2. Añadir los tags
      // 2.6. Añadir la lista de tags
      // 3. Añadir el LI a la LISTA
      LISTA.appendChild(liElement)
    }
  }
