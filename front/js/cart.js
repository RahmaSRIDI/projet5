//expressions régulières (regex) pour la validation du form
const regName = /^[a-zA-Z]+$/;
const regAdress = /^\s*\S+(?:\s+\S+){2}/;
const regEmailAdress = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const regQteMaxAndMin = /^.{1,100}$/
var isValidForm = false;

//fontion génerique pour récupérer un produit depuis l'API
async function getProductById(idProduit) {
    var productURL = "http://localhost:3000/api/products/" + idProduit;
    const response = await fetch(productURL);
    const obj = await response.json();
    return obj;
}


//remplissage du panier selon le local storage (produit choisis)
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



            //création du tag Img
            createImgTag(data, div_cart__item__img);

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
            //création de l'élement input
            let input = CreateInputTag(elementObjJson);

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

//création de l'élement input
function CreateInputTag(elementObjJson) {
    let input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('class', 'itemQuantity');
    input.setAttribute('name', 'itemQuantity');
    input.setAttribute('min', 1);
    input.setAttribute('max', 100);
    input.setAttribute('value', elementObjJson.quantite);

    checkMaxMinQte(input);
    return input;
}
//création de l'élement Img
function createImgTag(data, div_cart__item__img) {
    let imgTag = document.createElement('img');
    imgTag.src = data.imageUrl;
    imgTag.alt = data.altTxt;
    div_cart__item__img.appendChild(imgTag);
}

//validation de la valeur max et min du qte
function checkMaxMinQte(input) {
    input.onkeypress = e => {
        //  13: enter, +: 43 , -: 45
        if (13 == e.keyCode)
            input.blur();
        if ([43, 45].includes(e.keyCode))
            return false;
    };
    const min = 1;
    const max = 100;
    input.onkeyup = e => {
        if (parseFloat(input.value) < min) {
            input.value = min;
        }
        else if (parseFloat(input.value) > max) {
            input.value = max;
        }
        else {
            input.value = parseFloat(input.value);
        }

    };
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

    if (!isValidForm)
        alert('Veuillez remplir tout le formulaire.');
    if (localStorage.length == 0) {
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

                if (orderId != undefined) {
                    //redirection vers la page confirmation
                    location.href = 'confirmation.html?orderId=' + orderId;
                    // Supprimer toutes les données de localStorage
                    localStorage.clear();
                }
            });
        })();

    }
}


//arréter la progression du submit (arréter refresh de la page)
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
validationFormulaire();
//desactiver la validation automatique de formulaire HTML5
var forms = document.querySelectorAll('.cart__order__form');
for (var i = 0; i < forms.length; i++) {
    forms[i].setAttribute('novalidate', true);
}
//changer bouton type à button à la place submit
var orderButton = document.getElementById('order');
orderButton.setAttribute('type', 'button');

//validation du formulaire
function validationFormulaire() {
    const firstNameInput = document.getElementById('firstName')

    firstNameInput.addEventListener('blur', (event) => {
        if (!regName.test(firstNameInput.value)) {
            const firstNameErrorMsg = document.getElementById('firstNameErrorMsg')
            firstNameErrorMsg.textContent = 'Prénom non valide!'
            isValidForm = false;
        }
        else {
            firstNameErrorMsg.textContent = '';
            isValidForm = true;
        }
    });
    const lastNameInput = document.getElementById('lastName')
    lastNameInput.addEventListener('blur', (event) => {
        if (!regName.test(lastNameInput.value)) {
            const lastNameErrorMsg = document.getElementById('lastNameErrorMsg')
            lastNameErrorMsg.textContent = 'Nom non valide!'
            isValidForm = false;
        }
        else {
            lastNameErrorMsg.textContent = '';
            isValidForm = true;
        }

    });
    const addressInput = document.getElementById('address')
    addressInput.addEventListener('blur', (event) => {
        if (!regAdress.test(addressInput.value)) {
            const addressErrorMsg = document.getElementById('addressErrorMsg')
            addressErrorMsg.textContent = 'Adress non valide!'
            isValidForm = false;
        }
        else {
            addressErrorMsg.textContent = '';
            isValidForm = true;
        }
    });
    const cityInput = document.getElementById('city')
    cityInput.addEventListener('blur', (event) => {
        if (!regName.test(cityInput.value)) {
            const cityErrorMsg = document.getElementById('cityErrorMsg')
            cityErrorMsg.textContent = 'Ville non valide!'
            isValidForm = false;
        }
        else {
            cityErrorMsg.textContent = '';
            isValidForm = true;
        }
    });
    const emailInput = document.getElementById('email')
    emailInput.addEventListener('blur', (event) => {

        if (!regEmailAdress.test(emailInput.value)) {
            const emailErrorMsg = document.getElementById('emailErrorMsg')
            emailErrorMsg.textContent = 'Email non valide!'
            isValidForm = false;
        }
        else {
            emailErrorMsg.textContent = '';
            isValidForm = true;
        }
    });

}



