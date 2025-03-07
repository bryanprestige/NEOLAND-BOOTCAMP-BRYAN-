

/**
 * Multiplica dos numeros y devuelve el resultado.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function multiplicate(a, b) {
  return a * b
}

/**
 * Devuelve un string en mayusculas
 * @param {string} str
 */
  export function toUpperCase(str) {
    return str.toUpperCase();
}


/**
 * Filtra la data por el filterValue
 * @param {string} filterValue
 * @param {object} data
 */
export function onFilterButtonClick(filterValue,events) {
    if (!filterValue) {
        return
    }

    return events.filter(item => 
      item.name.toLowerCase().includes(filterValue.toLowerCase())
    )
}