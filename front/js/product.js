window.onload = function() {

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

            // création de l'élément bouton
          


            
        })
        .catch((error) => console.log("impossible de récupérer les données"));
}