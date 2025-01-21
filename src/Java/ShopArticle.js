class User{
    id
    Name
    Contry
    City
    Birthday
    PaymentMethod 
    constructor (id,name,country,city,birthday,paymentMethod){
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
        this.city = City
    }
}

    //Heritage
     class Event extends User {
        eventTicket
        constructor(name,city,price,paymentMethod) {
            super(name,qty,price)
            this.eventTicket = false
        }
    }
    class Festival extends User {
        FestivalTicket
        constructor(name,country,price,paymentMethod) {
            super(name,qty,price)
            this.FestivalTicket = false
        }
    }

    //Factory
    const EVENT_TYPES = {
        USER: 'user',
        EVENT: 'event',
        FESTIVAL: 'festival',
    }
    class UserFactory {
        create(type, UserData) {
            switch(type) {
                case EVENT_TYPES.EVENT:
                    return new Event (UserData)
                case EVENT_TYPES.FESTIVAL:
                    return new Festival(UserData)
            }
        }
    }
