
 export class Event  {
    _id
    name
    //flyer
    venue
    dateTime
    price
    currency
    music
    city
    country
    dance
    user_id
    url

    /**
     * @param {string} name 
    
     * @param {string} venue
    * @param {Date} dateTime
    * @param {number} price
    * @param {string} currency
    * @param {string} music  
    * @param {string} city 
    * @param {string} country 
     * @param {string} dance
     * @param {string} user_id
     * @param {URL} url
     */
    constructor ({_id,name,venue,dateTime,price,currency,music,city,country,dance,user_id,url}){
        //const timestamp = new Date()
        //this.id = id || String(timestamp.getTime())
        //this.flyer = flyer
        this._id = _id
        this.name = name    
        this.venue = venue
        this.dateTime = dateTime 
        this.price = price
        this.currency = currency
        this.music = music
        this.city = city
        this.country = country
        this.dance = dance
        this.user_id = user_id
        this.url = url
    }
}
