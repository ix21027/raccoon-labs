var _ = require('lodash'); 

function Review(data = {}){
    this.ID = data.ID,
    this.author =  data.author,
    this.date = data.date, 
    this.comment = data.comment, 
    this.rating = {
        service: data.rating.service, 
        price: data.rating.price, 
        value:  data.rating.value, 
        quality: data.rating.quality
    }
}

function Product(params = { }){
    this.sizes       = params.sizes;
    this.name        = params.name;
    this.description = params.description;
    this.price       = +params.price;
    this.brand       = params.brand;
    this.quantity    = +params.quantity;
    this.date        = params.date;
    this.reviews     = params.reviews;
    this.images      = params.images;
    this.activeSize  = params.activeSize;
    this.ID          = params.ID; 
    
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
    this.getAverageRating = (key) => _.meanBy(this.reviews, r => r.rating[key])
}

let data = {
                name: "Lodka", description: "Veslovat' ochen' veselo", price: 900, brand: "LodDka", quantity: 5, date: new Date(),
                reviews:[{ID:1, author: "kek", date: new Date(), comment: "some comment", rating: {service:4, price:4, value: 10, quality: 2} },
                         {ID:2, author: "kek", date: new Date(), comment: "some comment", rating: {service:4, price:8, value: 10, quality: 2} }             
                        ],
                images: ["url/img1", "url/img2"], activeSize: "",
                sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], ID: (+new Date()+"" )
            }

let p = new Product(data);

console.log(p.getName());
console.log(p.getDescription());
console.log(p.getSizes());
console.log(p.getQuantity());
console.log(p.getReviewByID(1).comment);
console.log(p.getImage("url/img1"));
console.log(p.addSize("XXS"));
console.log(p.getSizes());
console.log(p.setActiveSize('XS'));
console.log(p.getActiveSize());
console.log(p.deleteSize("XS"));
console.log(p.getSizes());
console.log(p.getAverageRating('price'));


let searchProducts = (products, query) => {
    products.filter(p => p.getName.includes(query)  || p.getDescription.includes(query))
}

let sortProducts = (products, sortRule = "price") => {
    if (sortRule === "price" || sortRule === "id")
        products.sort((a,b) => parseFloat(a[sortRule])-parseFloat(b[sortRule]))
    if (sortRule == "name")
        products.sort((a,b) => ( a[sortRule] > b[sortRule] ) ? 1 : -1)
}