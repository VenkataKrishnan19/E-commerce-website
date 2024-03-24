let iconcart = document.querySelector('.cart-icon');
let closecart = document.querySelector('.close');
let body = document.querySelector('body');
let listproducthtml = document.querySelector('.listproducts');
let listcarthtml = document.querySelector('.listcart');
let iconcartspan = document.querySelector('.cart-icon span')

let listproducts = [];
let carts = [];

iconcart.addEventListener('click', () => {
    body.classList.toggle('showcart')
})
closecart.addEventListener('click', () => {
    body.classList.toggle('showcart')
})

const adddatatohtml = () => {
    listproducthtml.innerHTML = '';
    if(listproducts.length > 0){
        listproducts.forEach(product => {
            let newproduct = document.createElement('div');
            newproduct.classList.add('item');
            newproduct.dataset.id = product.id;
            newproduct.innerHTML = `
            <img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button class="addcart">
                Add to cart
            </button>
            `;
            listproducthtml.appendChild(newproduct);
        })
    }
}
listproducthtml.addEventListener('click', (event) => {
    let positionclick = event.target;
    if(positionclick.classList.contains('addcart')){
        let product_id = positionclick.parentElement.dataset.id;
        addtocart(product_id);
    }
})

const addtocart = (product_id) => {
    let positionthisproductincart = carts.findIndex((value) => value.product_id == product_id);
    if(carts.lenght <= 0) {
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionthisproductincart < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        carts[positionthisproductincart].quantity = carts[positionthisproductincart].quantity +1;
    }
    addcarttohtml();
    addcarttomemory();

}
const addcarttomemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}
const addcarttohtml = () => {
    listcarthtml.innerHTML = '';
    let totalquantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalquantity = totalquantity + cart.quantity;
            let newcart = document.createElement('div');
            newcart.classList.add('item');
            newcart.dataset.id = cart.product_id;
            let positionproduct = listproducts.findIndex((value) => value.id == cart.product_id);
            let info = listproducts[positionproduct];
            newcart.innerHTML = `
            <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalprice">
                    $${info.price * cart.quantity}
                </div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        listcarthtml.appendChild(newcart);    
        })
    }
    iconcartspan.innerText = totalquantity;

}
listcarthtml.addEventListener('click', (event) => {
    let positionclick = event.target;
    if(positionclick.classList.contains('minus') || positionclick.classList.contains('plus')){
        let product_id = positionclick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionclick.classList.contains('plus')){
            type = 'plus';
        }
        changequantity(product_id, type);
    }       
})
const changequantity = (product_id, type) => {
    let positionitemincart = carts.findIndex((value) => value.product_id == product_id);
    if(positionitemincart >= 0){
        switch(type) {
            case 'plus':
                carts[positionitemincart].quantity = carts[positionitemincart].quantity +1;
                break;
            default:
                let valuechange = carts[positionitemincart].quantity -  1;
                if(valuechange > 0){
                    carts[positionitemincart].quantity = valuechange;
                }else{
                    carts.splice(positionitemincart, 1);
                }
                break;    
        }
    }
    addcarttomemory();
    addcarttohtml();

}

const initapp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listproducts = data;
        adddatatohtml();

        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addcarttohtml();
        }
    }) 
}
initapp();