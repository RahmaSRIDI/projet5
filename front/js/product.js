function getProduct() {

    /*récupération de l'id à partir de l'URL */
    var str = document.URL;
    var url = new URL(str);
    var idFromUrl = url.searchParams.get("id");
    console.log(idFromUrl);

    //récupération du détail de l'article à partir de l'API
    var productURL = "http://localhost:3000/api/products/" + idFromUrl;
    const results = fetch(productURL)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);


            //création de l'élement de l'image
            var imageDiv = document.querySelector(".item__img");
            let image = document.createElement('img');
            image.src = data.imageUrl;
            image.alt = data.altTxt;
            imageDiv.appendChild(image);

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
            var couleur = document.getElementById('colors');
            for (const color of data.colors) {
                console.log(color);
                let option = document.createElement('option');
                option.value = color;
                option.textContent = color;
                couleur.appendChild(option);
            }

            //récupération des données envoyées par localstorage

            let addToCartButton = document.getElementById('addToCart');
            addToCartButton.addEventListener('click', function (e) {

                console.log(data.name);

                var colorSelectedTag = document.getElementById("colors");
                var colorSelected = colorSelectedTag.value;
                console.log(colorSelected);
                //var text = e.options[e.selectedIndex].text;
                var quantiteSelectedTag = document.getElementById("quantity");
                var quantiteSelected = quantiteSelectedTag.value;
                console.log(quantiteSelected);
                if (colorSelected != "" && quantiteSelected > 0) {

                    let objJson = {
                        id: idFromUrl,
                        color: colorSelected,
                        quantite: Number(quantiteSelected)
                    }
                    //check
                    if (localStorage.getItem(idFromUrl + colorSelected) !== null) {
                        let existedObjJson = JSON.parse(localStorage.getItem(idFromUrl + colorSelected));
                        //element existe 
                                            
                        objJson.quantite = Number(objJson.quantite) + Number(existedObjJson.quantite);
                    }

                    let produit = JSON.stringify(objJson);
                    localStorage.setItem(idFromUrl + objJson.color, produit);
                }
                else {
                    alert("Veuillez choisir une couleur et un nombre d'article svp");
                }


            })

        })
        .catch((error) => console.log("impossible de récupérer les données", error));
}
getProduct();