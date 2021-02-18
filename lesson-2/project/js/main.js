class Products {
    data = [];
    products = [];
    container = null;

    constructor(selector) {
        this.container = document.querySelector(selector);
        this._fetchData();
        this._render();
    }

    Sum () {
        let sum = 0;
        this.data.forEach(item => {
            sum += item.price;
        });
        return sum;
    }

    _fetchData() {
        this.data = [
            { title: 'Notebook', id: 1, price: 2000 },
            { title: 'Keyboard', id: 2, price: 200, img: 'https://picsum.photos/200/150' },
            { title: 'Mouse', id: 3, price: 100 },
            { title: 'Gamepad', id: 4, price: 87 }
        ];
    }

    _render() {
        for (let data of this.data) {
            const product = new ProductItem(data);
            this.products.push(product);
            this.container.insertAdjacentHTML('beforeend', product.render());
        }
    }
}

class ProductItem {
    title = '';
    price = 0;
    id = 0;
    img = '';

    constructor(product) {
        ({ title: this.title, price: this.price, id: this.id, img: this.img = 'https://placehold.it/200x150'} = product); //перенес изображение сюда. Ведь ссылка на изображение будет храниться в объекте продукта?
        //кстати. Мы можем в конструкторе выполнять проверку? если, например, картинки нет, или не загружается, то вставлять заглушку? я так понимаю, для этого нужно в this.img присваивать функцию, в которой будет выполняться проверка?
    }

    render() {
        return `<div class="product-item" data-id="${this.id}">//добавил id товара
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
    // data = []; - ответ сервера на запрос товара по id
    // list = []; - массив товаров в корзине
    // container = null; ссылка для вставки корзины


    // add(id товара. Получаем из data-id карточки товара) - метод добавляет товар в корзину
    //              только непонятно где этот id искать. Делать запрос к серверу?
    //              т.е. тут будет свой метод  _fetchData()?
    //              после добавления вызываем _render()

    // _render() - отрисовывает товары в корзине

    // _fetchData(id) - запрашиваем у сервера товар с нужным id

    // del(id товара. Получаем из data-id элемента корзины) - удалить товар из массива list
    //                                              после удаления вызываем _render()

    // sum() - сумма товаров в корзине



    // buy() - оформить покупку

}

class CartItem {
    // title = '';
    // price = 0;
    // id = 0;
    // img = '';
    // quantity = 0; - количество товара в корзине

    // setQuantity(quantity) - установить количество товара

    // _render() - создает разметку одного товара в корзине




}

const list = new Products('.products');
console.log('Сумма товаров в корзине: ' + list.Sum());


//что-то я совсем запутался, какой класс что должен делать. Я сдам сегодня этот черновик. А завтра ещё со свежей головой подумаю

//про бургеры ещё даже не думал, с корзиной то голову сломал ))