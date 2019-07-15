"use strict";
//@ts-check

let meanBy = (review, key) => (review.reduce((acc, val) => acc.rating[key] + val.rating[key]) / review.length).toFixed(1);
let checkBgEqZero = (n) => parseFloat(n) >= 0 ? parseFloat(n) : 0

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
        if (new.target === AbstractProduct) {
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
        this.setPrice       = (price) => { if (parseFloat(price) >= 0) _price = price }    
        
        this.getterSetter = (data = "getName") => {  //* {setterName: argument} or "getterName"
        if (typeof data == "string")
            return this[data];
        if (typeof data == "object")
            for (const [setter, arg] of Object.entries(data)) {
                if(setter === "price") { 
                    if (parseFloat(arg) >= 0){
                        _price = arg;
                    } else {
                        throw new Error("price should be bigger or equal then 0")
                    } 
                }
                this[setter] = arg;
            }   
        } 
        this.getProductTileHTML = () => {
            let li = document.createElement('li');
            
            let productOverlayDIV = document.createElement('div');
            let productOverlayANCOR = document.createElement('a');
            let productOverlayAncorIMG = document.createElement('img');
            
            let imgOverlayDIV = document.createElement('div');
            let imgOverlayAnchor = document.createElement('a');
            let imgOverlayAreaDIV = document.createElement('div');
            let imgOverlayAreaH2 = document.createElement('h2');
            let headingHolderDIV = document.createElement('div');
            let priceSTRONG = document.createElement('strong');
            let priceBoxDIV = document.createElement('div');
            let regularPriceSPAN = document.createElement('span');
            let priceSPAN = document.createElement('span');
            let overlayTXTdiv = document.createElement('div');
            let holderDIV = document.createElement('div');
            let quickViewA = document.createElement('div');
            
            let productNameH3 = document.createElement('h3');
            let productNameA = document.createElement('a');
            
            let priceDIV = document.createElement('div');
            let regpriceSPAN = document.createElement('span');
            let boxpriceSPAN = document.createElement('span');
    
            productOverlayDIV.className = "product-overlay";
            productOverlayANCOR.href = '#';
            productOverlayAncorIMG.src= "http://placehold.it/225/cccccc/0000&amp;text=I";
            productOverlayAncorIMG.alt = _name;
            productOverlayAncorIMG.height = 225;
            productOverlayAncorIMG.width = 225;
    
            imgOverlayDIV.className = "img-overlay";
            imgOverlayAnchor.href = "#";
            imgOverlayAnchor.title = _name;
            imgOverlayAreaDIV.className = "img-overlay-area";
            imgOverlayAreaH2.className = "heading";
            imgOverlayAreaH2.innerText = _name;
            headingHolderDIV.className = "heading-holder";
            priceSTRONG.className = "price";
            priceBoxDIV.className = "price-box";
            regularPriceSPAN.className = "regular-price";
            priceSPAN.className = "price";
            priceSPAN.innerHTML = "&euro;" + _price;
            overlayTXTdiv.className = "overlay-txt";
            holderDIV.className = "holder";
            quickViewA.className = "quickview";
            quickViewA.rel = "nofollow";
            quickViewA.href = "#"; 
            quickViewA.innerText = "Quickview";
            
            productNameH3.className = "product-name";
            productNameA.href = "#";
            
            productNameA.innerText = _name;
            priceDIV.className = "price-box";
            regpriceSPAN.className = "regular-price";
            boxpriceSPAN.className = "price";
            boxpriceSPAN.innerHTML = "&euro;" + _price;
    
            li.appendChild(productOverlayDIV);
            productOverlayDIV.appendChild(productOverlayANCOR);
            productOverlayANCOR.appendChild(productOverlayAncorIMG);
            
            productOverlayDIV.appendChild(imgOverlayDIV);
            imgOverlayDIV.appendChild(imgOverlayAnchor);
            imgOverlayAnchor.appendChild(imgOverlayAreaDIV);
            imgOverlayAreaDIV.appendChild(imgOverlayAreaH2)
            
            imgOverlayAreaDIV.appendChild(headingHolderDIV);
            headingHolderDIV.appendChild(priceSTRONG);
            priceSTRONG.appendChild(priceBoxDIV);
            priceBoxDIV.appendChild(regularPriceSPAN);
            regularPriceSPAN.appendChild(priceSPAN);
    
            imgOverlayDIV.appendChild(overlayTXTdiv);
    
            imgOverlayAreaDIV.appendChild(holderDIV);
            holderDIV.appendChild(quickViewA);
    
            li.appendChild(productNameH3);
            productNameH3.appendChild(productNameA);
    
            li.appendChild(priceDIV);
            priceDIV.appendChild(regpriceSPAN);
            regpriceSPAN.appendChild(boxpriceSPAN);
    
            return li;
        }
    }
    getFullInformation() {
        let wastedProps = ["getPriceForQuantity", "getProductTileHTML"];
        let getters = Object.getOwnPropertyNames(this).filter(prop => prop.startsWith('get') && !(wastedProps.includes(prop))); 
        let info = getters.map( getter => `${getter.slice(3)} -> ${this[getter]()}`);
        return info.join("\n");
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
            if(_reviews.length) return ['service', 'price', 'value', 'quality'].reduce((o, key) => ({ ...o, [key]:  meanBy(_reviews, key)}), {});
            else return NaN;
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

// class Electronics extends AbstractProduct {
//     constructor(data = {}) {
//         super(data);
//         this._warranty = data.warranty || 0;
//         this._power = data.power || 0;
//     }
    
//     set warranty(newWarranty) {
//         if (0 <= newWarr && newWarr <= 10) this._warranty = newWarranty;
//         else throw new Error('invalid warranty');
//     }

//     set power(newPower) {
//         this._power = newPower;
//     }

//     get warranty() {
//         return this._warranty;
//     }
//     get power() {
//         return this._power;
//     }
//     getFullInformation() {
//         return super.getFullInformation() + "\n"
//             + "Power -> " + this.power + "\n"
//             + "Warranty -> " + this.warranty
//     }
// }

function extend(child, parent) { 
    for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key]; 
    } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor(); 
    child.__super__ = parent.prototype; 
    return child; 
}
extend(Electronics, AbstractProduct);
function Electronics(data = {}) {
    this._warranty = data.warranty || 0;
    this._power = data.power || 0;
}
Object.defineProperty(Electronics.prototype, "warranty", {
    get: function () {
        return this._warranty;
    },
    set: function (newWarranty) {
        if (0 <= newWarr && newWarr <= 10)
        this._warranty = newWarranty;
        else
        throw new Error('invalid warranty');
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(Electronics.prototype, "power", {
    get: function () {
        return this._power;
    },
    set: function (newPower) {
        this._power = newPower;
    },
    enumerable: true,
    configurable: true
});
Electronics.prototype.getFullInformation = function() {
    return Electronics.__super__.getFullInformation.apply(this) + "\n"
        + "Power -> " + this.power + "\n"
        + "Warranty -> " + this.warranty;
};

const check = {
    mail(email) {
        return /(^[A-Za-z\d]{1})([^@]{1,19})@([\w.!$%\&;’*+\/=?\^_-]{1,15})\.([A-Za-z]{1,5}$)/.test(email)
    },
    pass(pass) {
        return /^(?=.*\d)(?=.*[!@#\$%\^&\*_-])(?=.*\w)[\d\w\s]{8,24}$/.test(pass) 
    },
    phone(phone) {
        return /^(\+[\d]{2})?(([\s-]*)(\()?([\s-]*)(\d)([\s-]*)(\d)([\s-]*)(\d)(\))?)(([\s-]*[\d][\s-]*){7})$/.test(phone)
    }
}

var plp = (function(my){
    let url = "http://10.0.1.43:8887/product-feed.json";
    
    my.getProducts = async () => await $.ajax(url);
    
    my.renderProduct = (clothes,ulSlides) => {
        for (let i=0; i < Math.ceil(clothes.length/4); i++) {
            let li = document.createElement('li');
            let ul = document.createElement('ul');
            ul.className = "products-grid";
            ulSlides.appendChild(li);
            li.appendChild(ul);
            clothes.splice(0, 4).map(c => ul.appendChild(c.getProductTileHTML()) );
        }
    }

    return my;

})(plp || {});
