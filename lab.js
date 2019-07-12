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
        let _images      = data.images || ['default img'] ;
        let _ID          = data.ID || (new Date().getTime() + "" ); 
        
        ["Name", "Description", "Price", "Images"].map(prop =>
            Object.defineProperty(this, "get"+prop, { value: () => eval("_" + prop.toLowerCase()) })
        ); 

        this.getID = () => _ID;
        this.getImage = (imgName) => imgName ? _images.find(img => img === imgName) : _images[0];
        
        this.getPriceForQuantity = (qty = 1) => `$${_price * qty}`;  
        
        this.setName        = (new_name) => _name = new_name;
        this.setDescription = (desc)  => _description = desc;
        this.setPrice       = (price) => { if (parseInt(price) >= 0) _price = price }    
    }
    getFullInformation() {
        let wastedProps = ["getPriceForQuantity"];
        let getters = Object.getOwnPropertyNames(this).filter(prop => prop.startsWith('get') && !(wastedProps.includes(prop))); 
        let info = getters.map( getter => `${getter.slice(3)} -> ${this[getter]()}`);
        return info.join("\n");
    }
    getterSetter(data = "getName") {  //* {setterName: argument} or "getterName"
        if (typeof data == "string")
            return this[data]
        if (typeof data == "object")
            for (const [setter, arg] of Object.entries(data)) {
                this[setter] = arg;
            }   
    }  
}

let searchProducts = (products, query) => {
    products.filter(p => p.getName.includes(query)  || p.getDescription.includes(query));
}

let sortProducts = (products, sortRule = "price") => {
    if (sortRule === "price") {
        products.sort((a,b) => parseFloat(a[sortRule])-parseFloat(b[sortRule]));
    }
    if (sortRule == "name" || sortRule === "ID") {
        products.sort((a,b) => ( a[sortRule] > b[sortRule] ) ? 1 : -1);
    }
}
class Clothes extends AbstractProduct {
    constructor(data = {}) {
        super(data);
        let {sizes, brand, quantity, date, reviews, activeSize, material, color} = data;
        
        let _activeSize  = activeSize || 'default';         
        
        let _brand       = brand      || 'default';         //******************
        let _color       = color      || 'default color';   //
        let _date        = date       || new Date();        //
        let _material    = material   || 'default material';//  in propsToDefine
        let _reviews     = reviews    || [];                //                //
        let _sizes       = sizes      || [];                //
        let _quantity    = checkBgEqZero(quantity);         //******************
        
        let getters = ["Brand", "Sizes", "Quantity", "Date", "Reviews", "Material", "Color"];
        getters.map( prop => Object.defineProperty(this, "get"+prop, { value: () => eval("_" + prop.toLowerCase()) }) );
        
        this.getActiveSize = () => _activeSize;
        this.getReviewByID = (id) => _reviews.find(r => r.ID === id);
        
        this.getAverageRating = () => {
            return ['service', 'price', 'value', 'quality'].reduce((o, key) => 
            ({ ...o, [key]:  meanBy(_reviews, r => r.rating[key])}), {}
            );
        }
        
        let setters = ["Date", "Brand", "Color", "Material", "Quantity"];
        setters.map(prop => 
            Object.defineProperty(this, "set"+prop, { value: (el) => eval("_" + prop.toLowerCase() + '= el') })
        );
        this.setActiveSize = (el) => _sizes.includes(el) ? _activeSize = el : false; 
        
        //methods for adding size, review
        ["Sizes", "Reviews"].map(prop => 
            Object.defineProperty(this, "add"+prop.slice(0, -1), { value: (el) => eval("_" + prop.toLowerCase() + '.includes(el)') 
                                                                                ? false 
                                                                                : eval("_" + prop.toLowerCase() + '.push(el)') })
        );
        this.deleteSize = (that) => _sizes = _sizes.filter(size => size !== that);
    }
}

class Electronics extends AbstractProduct {
    constructor(data = {}) {
        super(data);
        this._warranty = data.warranty || 0;
        this._power = data.power || 0;
    }
    
    set warranty(newWarr) {
        if (0 <= newWarr && newWarr <= 10) this._warranty = newWarr;
        else throw new Error('invalid warranty');
    }

    set power(newPow) {
        this._power = newPow;
    }
    
    get warranty() {
        return this._warranty;
    }
    get power() {
        return this._power;
    }
    getFullInformation() {
        return super.getFullInformation() + "\n"
            + "Power -> " + this.power + "\n"
            + "Warranty -> " + this.warranty
    }
}

