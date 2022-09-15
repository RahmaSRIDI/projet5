// Récupérer des données depuis localStorage après validation du panier
var orderId = localStorage.getItem('orderId');
if (orderId != undefined) {
    //redirection vers la page confirmation
    location.href = 'confirmation.html?orderId=' + orderId;
    // Supprimer toutes les données de localStorage

    localStorage.clear();
}


//fontion génerique pour récupérer un produit depuis l'API
async function getProductById(idProduit) {
    var productURL = "http://localhost:3000/api/products/" + idProduit;
    const response = await fetch(productURL);
    const obj = await response.json();
    return obj;
}


//remplissage des card selon le local storage (produit choisis)
async function getCard() {

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

        let data = await getProductById(elementObjJson.id);
        (async () => {




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


        })()



        section.appendChild(article);

    }


    //ajouter l'evennement (quantité changé)
    await onQteChange();
    //ajouter l'evennement (supprission d'un produit)
    await onDelete();
    //await writeTotal(totalQuantity, totalPrice);
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
            //actualiser le total après chaque modification de qte d'un produit
            calculTotal();
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
            calculTotal();
            alert("Votre produit a été supprimé");
        });
    }

    //actualiser le total après chaque supprision d'un produit
    calculTotal();
}

// affichage du total après calcul
async function writeTotal(totalQuantity, totalPrice) {
    var tagTotalQuantity = document.getElementById('totalQuantity');
    tagTotalQuantity.textContent = totalQuantity;
    var tagTotalPrice = document.getElementById('totalPrice');

    let formatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2, minimumFractionDigits: 0 });

    tagTotalPrice.textContent = formatter.format(totalPrice);
}

/*recalcul le total des prix et quantités */
async function calculTotal() {

    let qteTotal = 0;
    let priceTotal = 0;

    for (var i = 0; i < localStorage.length; i++) {

        var key = localStorage.key(i);
        var elementObjJson = JSON.parse(localStorage.getItem(key));
        qteTotal = Number(qteTotal) + Number(elementObjJson.quantite);
        let data = await getProductById(elementObjJson.id);

        let price = data.price;
        priceTotal = Number(priceTotal) + (Number(price) * Number(elementObjJson.quantite));


    }

    writeTotal(qteTotal, priceTotal);
}


//on click sur le bouton commander
function onPostForm() {

    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var address = document.getElementById('address').value;
    var city = document.getElementById('city').value;
    var email = document.getElementById('email').value;

    //expressions régulières pour la validation du form
    const regName = /^[a-zA-Z]+$/;
    const regAdress = /^[0-9]+ [a-zA-Z]+$/;
    const regEmailAdress = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    var isValidForm = true;
    //validation du form
    if (!regName.test(firstName)) {
        alert('Prénom non valide.');
        isValidForm = disableSubmit(isValidForm);


    }
    else if (!regName.test(lastName)) {
        alert('Nom non valide.');
        isValidForm = disableSubmit(isValidForm);
    }
    else if (!regAdress.test(address)) {
        alert('Adresse non valide.');
        isValidForm = disableSubmit(isValidForm);
    }
    else if (!regName.test(city)) {
        alert('Ville non valide.');
        isValidForm = disableSubmit(isValidForm);
    }
    else if (!regEmailAdress.test(email)) {
        alert('Email non valide.');
        isValidForm = disableSubmit(isValidForm);
    }
    else if (localStorage.length == 0) {
        alert('Veuillez ajouter des produits dans le panier')
        isValidForm = disableSubmit(isValidForm);
    }

    //si le formulaire est correct retourne objet de contact et tableau de produit
    if (isValidForm !== false) {
        let contact = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email

        }

// remplissage du tableau de produits à partir de localstorage
        var products = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var elementObjJson = JSON.parse(localStorage.getItem(key));
            products[i] = elementObjJson.id;
        }

//appel de l'API par la methode POST et recupération de OrderId
        (async () => {
            const fetchPromise = fetch('http://localhost:3000/api/products/order', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({ contact: contact, products: products })
            });
            fetchPromise.then(response => {
                return response.json();
            }).then(data => {

                orderId = data.orderId;
                localStorage.setItem('orderId', orderId);
            });
        })();
        // Enregistrer des données dans sessionStorage
        //localStorage.setItem('orderId', 5554);

    }
}


//arréter la progression du submit (arréter refresh de la page) //TODO ne fonctionne pas encore
function disableSubmit(isValidForm) {
    document.querySelector("#order").addEventListener("click", function (event) {
        event.stopPropagation();
    }, false);

    
    return false;
}

//ajouter l'évennent click
async function addSubmitListener() {

    var elements = document.getElementById('order');

    elements.addEventListener('click', function () {
        onPostForm();
    });
}


getCard();
addSubmitListener();

//desactiver la validation automatique de formulaire HTML5
var forms = document.querySelectorAll('.cart__order__form');
for (var i = 0; i < forms.length; i++) {
    forms[i].setAttribute('novalidate', true);
}