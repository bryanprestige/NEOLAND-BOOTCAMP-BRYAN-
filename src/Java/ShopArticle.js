export class User{
    id
    Name
    Contry
    Birthday
    PaymentMethod 
    constructor (id,name,country,birthday,paymentMethod){
        const timestamp = new Date ()
        if(id !== undefined){
            this.id = id
        } else{
            this.id = Name + '_' + String(timestamp.getTime())
        }
        this.Name = Name
        this.Country= Country
        this.Birthday = Birthday
        this.PaymentMethod = PaymentMethod
    }
}

    
    export class UsualProduct extends Article {
        bought
        constructor(name,qty,price) {
            super(name,qty,price)
            this.bought = false
        }
    }

    export const ARTICLE_TYPES = {
        USUAL: 'usual',
        BASIC: 'basic'
    }

    export class UserFactory {
        createArticle(type,name,qty,) {
            switch(type) {
                case ARTICLE_TYPES.USUAL:
                    break
                case ARTICLE_TYPES.BASIC:
                    return new User (name,country,birthday)
            }
        }
    }
