
 export class Event  {
    id
    name
    //flyer
    address 
    dateTime
    price
    currency
    music
    city
    dance

    /**
     * @param {string} name 
    
     * @param {string} address
    * @param {Date} dateTime
    * @param {number} price
    * @param {string} currency
    * @param {string} music  
    * @param {string} city 
     * @param {string} dance
     */
    constructor ({id,name,address,dateTime,price,currency,music,city,dance}){
        const timestamp = new Date()
        this.id = id || String(timestamp.getTime())
        //this.flyer = flyer
        this.name = name
        this.address = address
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
