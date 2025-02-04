import fs from 'fs';



export async function filter(file, filterParams, callback) {
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, data) {
        const parsedData = JSON.parse(data.toString());
        // Filter by filterParams
        const filteredData = parsedData.filter((event) => {

          const filterSearch = filterParams.search.toLowerCase();

          return event.name.includes(filterSearch) ||
            event.city.toLowerCase().includes(filterSearch) ||
            event.dance.toLowerCase().includes(filterSearch) ||
            event.price.toLowerCase().includes(filterSearch);
        });
        if (filteredData.length === 0) {
          console.log('read', 'No se encontraron resultados');
          if (callback) {
            callback('No se encontraron resultados');
          }
          return;
        }
        // Return filtered data
        if (err) {
          console.log('read', err);
          return;
        }
        if (callback && !err) {
          callback(filteredData);
          return;
        }
      });
    } else {
      console.log('read', 'El fichero no existe');
      if (callback) {
        callback('El fichero no existe');
      }
    }
  } catch (err) {
    console.log('read', `Error: ${err}`);
  }
}