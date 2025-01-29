
 export class EVENTCREATOR  {
    id
    name
    //flyer
    location 
    date
    time
    price
    music
    city
    dance

    /**
     * @param {string} name 
    
     * @param {string} location 
    * @param {Date} date
    * @param {number} time
    * @param {number} price
    * @param {string} music  
    * @param {string} city 
     * @param {string} dance
     */
    constructor ({name,location,date,time,price,music,city,dance}){
        const timestamp = new Date()
        this.id = String(timestamp.getTime())
        //this.flyer = flyer
        this.name = name
        this.location = location
        this.date = date 
        this.time = time 
        this.price = price
        this.music = music
        this.city = city
        this.dance = dance
    }
}


