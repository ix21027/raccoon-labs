var _ = require('lodash'); 

function Review(data = {}){
    let {ID, author, date, comment, rating} = data;
    let {service, price, value, quality} = rating;
    this.ID = ID || '',
    this.author =  author || '',
    this.date = date, 
    this.comment = comment || '', 
    this.rating = {
        service: service || 0, 
        price: price || 0, 
        value:  value || 0, 
        quality: quality || 0
    }
}

function Product(params = { }){
    let {sizes, name, description, price, brand, quantity, date, reviews, images, activeSize, ID} = params
    this.sizes       = sizes || [];
    this.name        = name || '';
    this.description = description || '';
    this.price       = +price || 1;
    this.brand       = brand || '';
    this.quantity    = +quantity || 1;
    this.date        = date || new Date();
    this.reviews     = reviews || [];
    this.images      = images || [];
    this.activeSize  = activeSize || '';
    this.ID          = ID || (+new Date()+"" ); 
    
    let getProps = ["Name", "Description", "Price",
                    "ID", "Brand", "Sizes", "ActiveSize",
                    "Quantity", "Date", "Reviews", "Images"];  
    let setProps = ["ActiveSize", "Date", "Brand", "Price", "Description", "Name"]          
    
    //Get Props def
    let defineGetProps = (properties = getProps) => {
        for(let prop of properties) 
            Object.defineProperty(this, "get"+prop, { value: () => this[prop.toLowerCase()] });
    }
    defineGetProps();
    
    this.getReviewByID = (id) => this.reviews.find(r => r.ID === id);
    this.getImage = (imgName) => imgName ? this.images.find(img => img === imgName) : this.images[0];
    
    //Add props def
    let defineAddProps = (properties = ["Sizes", "Reviews"]) => {
        for(let prop of properties) 
            Object.defineProperty(this, "add"+prop.slice(0, -1), { value: (el) => this[prop.toLowerCase()].includes(el) ? this[prop.toLowerCase()] : this[prop.toLowerCase()].push(el) });
    }
    defineAddProps();
    
    //Set props def
    let defineSetProps = (properties = setProps) => {
        for(let prop of properties){
            prop == "ActiveSize" 
                 ? Object.defineProperty(this, "set"+prop, { value: (el) => this.sizes.includes(el) ? this[prop.toLowerCase()] = el : this[prop.toLowerCase()] })
                 : Object.defineProperty(this, "set"+prop, { value: (el) => this[prop.toLowerCase()] = el });
        }
    }
    defineSetProps();
    

    this.deleteReview = (id) => this.reviews = this.reviews.filter(r => r.ID !== id)

    this.deleteSize = (that) => this.sizes = this.sizes.filter(size => size !== that)
    this.getAverageRating = () => ['service', 'price', 'value', 'quality'].reduce((o, key) => ({ ...o, [key]:  _.meanBy(this.reviews, r => r.rating[key])}), {})
}

let searchProducts = (products, query) => {
    products.filter(p => p.getName.includes(query)  || p.getDescription.includes(query))
}

let sortProducts = (products, sortRule = "price") => {
    if (sortRule === "price")
        products.sort((a,b) => parseFloat(a[sortRule])-parseFloat(b[sortRule]))
    if (sortRule == "name" || sortRule === "id")
        products.sort((a,b) => ( a[sortRule] > b[sortRule] ) ? 1 : -1)
}