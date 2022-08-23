function loadArticles() {
    //récupération de l'élement html items selon l'id
    var item = document.getElementById('items');
    //appel à l'API pour récupérer tout les éléments
    const results = fetch("http://localhost:3000/api/products")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            for (const obj of data) {
                console.log(obj._id);

                //création de l'élement a
                let aTag = document.createElement('a');
                aTag.href = './product.html?id='+obj._id;
                //création de l'élement article
                let articleTag = document.createElement('article');
                //création de l'élement img
                let imageTag = document.createElement('img');
                imageTag.src=obj.imageUrl;
                imageTag.alt=obj.altTxt;
                articleTag.appendChild(imageTag);
                //création de l'élement h3
                let h3Tag = document.createElement('h3');
                h3Tag.class='productName';
                h3Tag.innerHTML=obj.name;
                articleTag.appendChild(h3Tag);

                //création de l'élement p
                let pTag = document.createElement('p');
                pTag.class='productDescription';
                pTag.innerHTML=obj.description;
                articleTag.appendChild(pTag);

                aTag.appendChild(articleTag);
                item.appendChild(aTag);

            }
        })
        .catch((error) => console.log("impossible de récupérer les données"));
}
