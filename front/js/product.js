function getProductDetails() {

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
            let imgTag = document.createElement('div');
            imgTag.innerHTML = '<img src="' + data.imageUrl + '" alt="' + data.altTxt + '">';
            image.appendChild(imgTag);

            //création de l'élement title
            var title = document.getElementById('title');
            title.append(data.name);

            
           //création de l'élement prix
            var prix = document.getElementById('pre');
            prix.append(data.price);

            //création de l'élement description
            var description = document.getElementById('description');
            description.append(data.description);


        })
        .catch((error) => console.log("impossible de récupérer les données"));
}