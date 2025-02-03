
 export class Event  {
    id
    name
    //flyer
    location 
    dateTime
    price
    currency
    music
    city
    dance

    /**
     * @param {string} name 
    
     * @param {string} location 
    * @param {Date} dateTime
    * @param {number} price
    * @param {string} currency
    * @param {string} music  
    * @param {string} city 
     * @param {string} dance
     */
    constructor ({id,name,location,dateTime,price,currency,music,city,dance}){
        const timestamp = new Date()
        this.id = id || String(timestamp.getTime())
        //this.flyer = flyer
        this.name = name
        this.location = location
        this.dateTime = dateTime 
        this.price = price
        this.currency = currency
        this.music = music
        this.city = city
        this.dance = dance
    }
}

export class Users  {


}




export class Basket  {
}
