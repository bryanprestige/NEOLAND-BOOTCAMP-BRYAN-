
 export class Event  {
    _id
    name
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
    event_id
    boughtBy

    /**
     * @param {string} name 
     * @param {string} _id
     * @param {string} venue
    * @param {string} dateTime
    * @param {number} price
    * @param {string} currency
    * @param {string} music  
    * @param {string} city 
    * @param {string} country 
     * @param {string} dance
     * @param {string} user_id
     * @param {URL} url
     * @param {string} event_id
     * @param {Array} boughtBy
     */
    constructor ({_id,name,venue,dateTime,price,currency,music,city,country,dance,user_id,url,event_id,boughtBy}){
        const timestamp = new Date()
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
        this.event_id = event_id || String(timestamp.getTime())
        this.boughtBy = boughtBy
    }
}