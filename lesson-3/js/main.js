
const API = `https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses`;

let getRequest = (url) => {
    return new Promise((resolve) => {
        let xhr = new XMLHttpRequest();
        // window.ActiveXObject -> new ActiveXObject();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
            return;
            }
            if (xhr.status !== 200) {
                console.log('some error');
                return;
            }
        resolve(xhr.responseText);
        };
        xhr.send();
    });
};

getRequest(`${API}/catalogData.json`)
    .then((x) => {
        let myRequest = JSON.parse(x); //здесь x почему-то подчеркнут, хотя всё работает
        console.log(myRequest);
    });

class Products {
    products = [];
    container = null;
    cart = null; //объект корзины

    constructor(selector) {
        this.container = document.querySelector(selector);
        this._fetchData()
            .then(() => {
                this._render();
                this.calcSum();
                this.cart = new Cart('.cart', '.btn-cart', '.buy-btn');
                this.cart.products = this.products;
            });
    }

    calcSum() {
        return this.products.reduce((accum, item) => accum += item.price, 0);
    }

    _fetchData() {
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .then(data => {
                for (let product of data) {
                    this.products.push(new ProductItem(product));
                }
            })
    }

    _render() {
        for (let product of this.products) {
            if (product.rendered) {
                continue;
            }

            this.container.insertAdjacentHTML('beforeend', product.render());
        }
    }
}

class ProductItem {
    title = '';
    price = 0;
    id = 0;
    img = '';
    rendered = false;

    constructor(product, img = 'https://placehold.it/200x150') {
        ({ product_name: this.title, price: this.price, id_product: this.id } = product);
        this.img = img;
    }

    render() {
        this.rendered = true;
        return `<div class="product-item" data-id="${this.id}">
                 <img src="${this.img}" alt="${this.title}">
                 <div class="desc">
                     <h3>${this.title}</h3>
                     <p>${this.price}</p>
                     <button class="buy-btn">Купить</button>
                 </div>
             </div>`
    }
}


class Cart {
    container = null; //место вставки корзины
    btnCart = null; //кнопка отображения корзины
    cartShow = false; //Показать корзину
    cartItems = []; //Массив товаров в корзине
    products = null; //ссылка на продукты

    constructor(container, buttonCart, buttonBuy) {
        this.container = document.querySelector(container);
        this.btnCart = document.querySelector(buttonCart);
        document.querySelector(buttonCart).addEventListener('click', this._showCart.bind(this));//вот тут затупил с this. Сначала не мог понять почему не работает. Вспомнил про bind. Потом вспоминал как его использовать :)
            this.btnBuy = document.querySelectorAll(buttonBuy);
            this.btnBuy.forEach(button => button.addEventListener('click', this.add.bind(this)));


    }

    _render(){
        this.cartItems.forEach(item => {
            if (item.added === false){
                this.container.insertAdjacentHTML('beforeend', item.render());
            }

        })
    }

    //Показать и скрыть корзину
    _showCart(){
        if (this.cartShow === false) {
            this.container.style.display = 'flex';
            this.cartShow = true;
            return;
        }

        if (this.cartShow === true) {
            this.container.style.display = 'none';
            this.cartShow = false;
        }

    }

    //добавить товар в корзину
    add(button){
        //добавляю первый товар
        if(this.cartItems.length === 0){
            this.cartItems.push(new CartItem(this.products, Number(button.target.parentNode.parentNode.dataset.id)));
            this._render();
            //this.cartItems[this.cartItems.push(new CartItem(this.products, Number(button.target.parentNode.parentNode.dataset.id)))].render();

            return;
        }
        let isAdd = false;
        this.cartItems.forEach(item => {
            if (item.id === Number(button.target.parentNode.parentNode.dataset.id)){
                isAdd = true;
            }
        });
        if (isAdd === false){
            this.cartItems.push(new CartItem(this.products, Number(button.target.parentNode.parentNode.dataset.id)));
            this._render();
            //this.cartItems[this.cartItems.push(new CartItem(this.products, Number(button.target.parentNode.parentNode.dataset.id)))].render();
        }
    }

    //удалить товар из корзины
    delete(){

    }
}

class CartItem {
    title = '';
    price = 0;
    id = 0;
    img = '';
    added = false; //товар добавлен в корзину
    quantity = 0; //количество

    // some - cartItems array

    constructor(products, productId) {
        products.forEach(item => {
            if (item.id === productId){
                ({ title: this.title, price: this.price, id: this.id, img: this.img } = item);

            }
        });


    }
    // someMethod() - метод делает то-то
    render() {
        this.added = true;
        return `<div class="product-item" data-id="${this.id}">
                 <img src="${this.img}" alt="${this.title}">
                 <div class="desc">
                     <h3>${this.title}</h3>
                     <p>${this.price}</p>
                 </div>
             </div>`
    }
}

setTimeout(()=>console.log(list.calcSum()), 5000);

const list = new Products('.products');
//const  cart = new Cart('.cart', '.btn-cart', '.buy-btn');










