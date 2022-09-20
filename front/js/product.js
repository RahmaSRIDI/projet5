//récupération du produit
function getProduct() {
    /*récupération de l'id à partir de l'URL */
    var str = document.URL;
    var url = new URL(str);
    var idFromUrl = url.searchParams.get("id");

    //récupération du détail de l'article à partir de l'API
    var productURL = "http://localhost:3000/api/products/" + idFromUrl;
    const results = fetch(productURL)
        .then((response) => response.json())
        .then((data) => {

            //création de l'élement de l'image
            var imageDiv = document.querySelector(".item__img");
            createImageTag(data, imageDiv);

            //création de l'élement title
            var title = document.getElementById('title');
            title.textContent = data.name;

            //création de l'élement prix
            var prix = document.getElementById('pre');
            prix.textContent = data.price;

            //création de l'élement description
            var description = document.getElementById('description');
            description.textContent = data.description;

            //création de l'élement couleur
            createColorTag(data);

            //récupération des données envoyées par localstorage
            let addToCartButton = document.getElementById('addToCart');
            addToCartButton.addEventListener('click', function (e) {


                var colorSelectedTag = document.getElementById("colors");
                var colorSelected = colorSelectedTag.value;
                var quantiteSelectedTag = document.getElementById("quantity");
                var quantiteSelected = quantiteSelectedTag.value;
                console.log((Number(quantiteSelected)));

                if (((Number(quantiteSelected) > 0 && Number(quantiteSelected) < 100) && !colorSelectedTag.getElementsByTagName('option')[0].selected)) {
                    StoreProduct(idFromUrl, colorSelected, quantiteSelected);
                    colorSelectedTag.getElementsByTagName('option')[0].selected = 'selected'
                    quantiteSelectedTag.value = 0;
                    
                }
                else {
                    alert("Veuillez choisir une couleur et un nombre d'article entre 1 et 100 svp");
                }
            })
            console.log(4);
        })
        .catch((error) => console.log("impossible de récupérer les données", error));
}

getProduct();

//enregistrer produit dans le local storage
function StoreProduct(idFromUrl, colorSelected, quantiteSelected) {
    let objJson = {
        id: idFromUrl,
        color: colorSelected,
        quantite: Number(quantiteSelected)
    };
    //vérification element existe dans le local storage
    if (localStorage.getItem(idFromUrl + colorSelected) !== null) {
        //element existe 
        let existedObjJson = JSON.parse(localStorage.getItem(idFromUrl + colorSelected));
        objJson.quantite = Number(objJson.quantite) + Number(existedObjJson.quantite);
    }

    let produit = JSON.stringify(objJson);
    localStorage.setItem(idFromUrl + objJson.color, produit);
    alert("Votre produit a été ajouté");
}

//création de l'élement couleur
function createColorTag(data) {
    var couleur = document.getElementById('colors');
    for (const color of data.colors) {
        let option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        couleur.appendChild(option);
    }
}

//création de l'élement de l'image
function createImageTag(data, imageDiv) {
    let image = document.createElement('img');
    image.src = data.imageUrl;
    image.alt = data.altTxt;
    imageDiv.appendChild(image);
}
