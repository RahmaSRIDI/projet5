window.onload = function () {

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
            var image = document.querySelector(".item__img");
            image.innerHTML = '<img src="' + data.imageUrl + '" alt="' + data.altTxt + '">';

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

            //reuperation des données envoyé par localstorage

            let addToCartButton = document.getElementById('addToCart');
            addToCartButton.onclick = function (event) {

                console.log(data.name);

                var colorSelectedTag = document.getElementById("colors");
                var colorSelected = colorSelectedTag.value;

                //var text = e.options[e.selectedIndex].text;
                console.log(colorSelected);

                var quantiteSelectedTag = document.getElementById("quantity");
                var quantiteSelected = quantiteSelectedTag.value;
                console.log(quantiteSelected);

                /*let objJson = {
                    id: idFromUrl,
                    color: colorSelected,
                    quantite: quantiteSelected
                }
                let produit = JSON.stringify(objJson);
                
                if (localStorage.getItem(idFromUrl) !== null) {
                    //element existe 
                    //donc vérification de la couleur
                    console.log(`element existe `);
                } else {
                    //inserer element car il n'existe pas
                    localStorage.setItem(idFromUrl, produit);
                }
                
                console.log(localStorage.getItem(idFromUrl));*/
            }

        })
        .catch((error) => console.log("impossible de récupérer les données"));
}