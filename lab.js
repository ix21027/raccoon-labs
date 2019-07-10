"use strict";
import { meanBy } from 'lodash'; 

let checkBgEqZero = (n) => parseInt(n) >= 0 ? parseInt(n) : 0

function Review(data = {}){
    let {ID, author, date, comment, rating} = data;
    let {service, price, value, quality} = rating;
    
    this.ID = ID || '',
    this.author =  author || '',
    this.date = date, 
    this.comment = comment || '', 
    this.rating = {
        service: service || 0, 
        price: checkBgEqZero(price), 
        value:  value || 0, 
        quality: quality || 0
    }
}
class AbstractProduct {    
    constructor(data = {}) {
        if (this.constructor === AbstractProduct) {
            throw new Error('Cannot instantiate abstractclass');
        }

        let _name        = data.name || 'lol';
        let _description = data.description || '';
        let _price       = checkBgEqZero(data.price);
        let _images      = data.images || [];
        let _ID          = data.ID || (new Date().getTime() + "" ); 
        
        ["Name", "Description", "Price", "Images"].map(prop =>
            Object.defineProperty(this, "get"+prop, { value: () => eval("_" + prop.toLowerCase()) })
        ); 

        this.getID = () => _ID;
        this.getImage = (imgName) => imgName ? _images.find(img => img === imgName) : _images[0];

        this.setName        = (new_name) => _name = new_name;
        this.setDescription = (desc)  => _description = desc;
        this.setPrice       = (price) => parseInt(price) >= 0 ? _price = price : false    
    }
}
let searchProducts = (products, query) => {
    products.filter(p => p.getName.includes(query)  || p.getDescription.includes(query));
}

let sortProducts = (products, sortRule = "price") => {
    if (sortRule === "price")
        products.sort((a,b) => parseFloat(a[sortRule])-parseFloat(b[sortRule]))
    if (sortRule == "name" || sortRule === "ID")
        products.sort((a,b) => ( a[sortRule] > b[sortRule] ) ? 1 : -1)
}


