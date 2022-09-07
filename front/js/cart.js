async function getApi(idProduit) {
    var productURL = "http://localhost:3000/api/products/" + idProduit;
    const response = await fetch(productURL);
    const obj = await response.json();
    return obj;
}



async function getCard() {
    let totalQuantity = 0;
    let totalPrice = 0;
    var section = document.getElementById('cart__items');

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var elementObjJson = JSON.parse(localStorage.getItem(key));

        let article = document.createElement('article');
        article.setAttribute('class', 'cart__item');
        article.setAttribute('data-id', elementObjJson.id);
        article.setAttribute('data-color', elementObjJson.color);

        let div_cart__item__img = document.createElement('div');
        div_cart__item__img.setAttribute('class', 'cart__item__img');

        var productURL = "http://localhost:3000/api/products/" + elementObjJson.id;
        let data = await getApi(elementObjJson.id);
        (async () => {


            console.log(elementObjJson.color);

            let imgTag = document.createElement('img');
            imgTag.src = data.imageUrl;
            imgTag.alt = data.altTxt;
            div_cart__item__img.appendChild(imgTag);

            article.appendChild(div_cart__item__img);

            let div_cart__item__content = document.createElement('div');
            div_cart__item__content.setAttribute('class', 'cart__item__content');
            let div_cart__item__content__description = document.createElement('div');
            div_cart__item__content__description.setAttribute('class', 'cart__item__content__description');
            let h2 = document.createElement('h2');
            h2.textContent = data.name;
            let pColor = document.createElement('p');
            pColor.textContent = elementObjJson.color;

            let pPrix = document.createElement('p');
            //convert string to amount
            let price = data.price;
            totalPrice = totalPrice + Number(price);
            let priceText = price.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
            pPrix.textContent = priceText;

            div_cart__item__content__description.appendChild(h2);
            div_cart__item__content__description.appendChild(pColor);
            div_cart__item__content__description.appendChild(pPrix);
            div_cart__item__content.appendChild(div_cart__item__content__description);


            //cart__item__content__settings
            let div_cart__item__content__settings = document.createElement('div');
            let div_cart__item__content__settings__quantity = document.createElement('div');
            let pQte = document.createElement('p');
            pQte.textContent = "Qté : ";
            let input = document.createElement('input');
            input.setAttribute('type', 'number');
            input.setAttribute('class', 'itemQuantity');
            input.setAttribute('name', 'itemQuantity');
            input.setAttribute('min', 1);
            input.setAttribute('max', 100);
            input.setAttribute('value', elementObjJson.quantite);
            totalQuantity = totalQuantity + Number(elementObjJson.quantite);
            div_cart__item__content__settings__quantity.appendChild(pQte);
            div_cart__item__content__settings__quantity.appendChild(input);
            div_cart__item__content__settings.appendChild(div_cart__item__content__settings__quantity);



            //cart__item__content__settings__delete
            let div_cart__item__content__settings__delete = document.createElement('div');
            div_cart__item__content__settings__delete.setAttribute('class', 'cart__item__content__settings__delete');
            let pDelete = document.createElement('p');
            pDelete.setAttribute('class', 'deleteItem');
            pDelete.textContent = 'Supprimer';
            div_cart__item__content__settings__delete.appendChild(pDelete);
            div_cart__item__content__settings.appendChild(div_cart__item__content__settings__delete);


            article.appendChild(div_cart__item__content);
            article.appendChild(div_cart__item__content__settings);


        })()



        section.appendChild(article);

    }


    await onQteChange();
    await onDelete();
    await calculTotal(totalQuantity, totalPrice);
}

//modification de la quantité addEventListener
async function onQteChange() {
    var elements = document.getElementsByClassName('itemQuantity');

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('change', function () {
            //récupération de l'élément article le plus proche
            const closetArticle = this.closest('article');
            const idClosetArticle = closetArticle.getAttribute('data-id') + closetArticle.getAttribute('data-color');

            let objJson = {
                id: closetArticle.getAttribute('data-id'),
                color: closetArticle.getAttribute('data-color'),
                quantite: Number(this.value)
            }
            let produit = JSON.stringify(objJson);
            localStorage.setItem(idClosetArticle, produit);
        });
    }


}


//suppression de la quantité addEventListener
async function onDelete() {
    var elements = document.getElementsByClassName('deleteItem');

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function () {
            //récupération de l'élément article le plus proche
            const closetArticle = this.closest('article');
            const idClosetArticle = closetArticle.getAttribute('data-id') + closetArticle.getAttribute('data-color');

            localStorage.removeItem(idClosetArticle);
            closetArticle.remove();
        });
    }


}

getCard();


async function calculTotal(totalQuantity, totalPrice) {
    var tagTotalQuantity = document.getElementById('totalQuantity');
    tagTotalQuantity.textContent = totalQuantity;
    var tagTotalPrice = document.getElementById('totalPrice');

    let formatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2, minimumFractionDigits: 0 });

    tagTotalPrice.textContent = formatter.format(totalPrice);
}


async function onPostForm() {
    console.log("onPostForm");
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var address = document.getElementById('address').value;
    var city = document.getElementById('city').value;
    var email = document.getElementById('email').value;




    let contact = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email

    }


    var products = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var elementObjJson = JSON.parse(localStorage.getItem(key));
        products[i] = elementObjJson.id;
    }

    console.log("1");
    (async () => {
        console.log("2");
        const rawResponse = await fetch('http://localhost:3000/api/products/order', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contact: contact, products: products })
        });
        console.log("3");
        const content = await rawResponse.json();
        console.log("4");
        console.log(content);
    })();
    console.log("5");

}

//suppression de la quantité addEventListener
async function addSubmitListener() {
    console.log("addSubmitListener");
    var elements = document.getElementById('order');

    elements.addEventListener('click', function () {
        onPostForm();
    });
}

addSubmitListener();
