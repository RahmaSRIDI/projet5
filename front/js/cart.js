function getCard() {
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

        const results = fetch(productURL)
            .then((response) => response.json())
            .then((data) => {

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

            }).catch((error) => console.log("impossible de récupérer les données", error));



        section.appendChild(article);

    }



}

//modification de la quantité addEventListener
function onQteChange() {
    var elements = document.getElementsByClassName('itemQuantity');

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('change', function () {
            console.log(this.value);
            //récupération de l'élément article le plus proche
            const closetArticle = this.closest('article');
            const idClosetArticle = closetArticle.getAttribute('data-id') + closetArticle.getAttribute('data-color');
            console.log(idClosetArticle);
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


//modification de la quantité addEventListener
function onDelete() {
    var elements = document.getElementsByClassName('deleteItem');

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function () {
            //récupération de l'élément article le plus proche
            const closetArticle = this.closest('article');
            const idClosetArticle = closetArticle.getAttribute('data-id') + closetArticle.getAttribute('data-color');
            console.log(idClosetArticle);

            localStorage.removeItem(idClosetArticle);
            closetArticle.remove();
        });
    }


}

getCard();
setTimeout(onQteChange, 2000);
setTimeout(onDelete, 2000);
function calculTotal() { }
 /*
window.addEventListener('load', (event) => {
alert(11);
onQteChange();
alert(22);
});*/


