// On définit la fonction pour appeler l'API de récupération des Products
function getProducts() {

    //récupération de l'élement html items selon l'id
    var item = document.getElementById('items');
    //appel à l'API pour récupérer tout les éléments
    const results = fetch("http://localhost:3000/api/products")
        .then((response) => response.json())
        .then((data) => {
            for (const obj of data) {
                createPoductElement(item, obj);
            }
        })
        .catch((error) => console.log("impossible de récupérer les données", error));
}

// création des balises (a, image, h3 et p )
function createPoductElement(item, produit) {

    //création de l'élement a
    let aTag = document.createElement('a');
    aTag.href = './product.html?id=' + produit._id;

    //création de l'élement article
    let articleTag = document.createElement('article');

    //création de l'élement article
    createImageTag(produit, articleTag);

    //création de l'élement h3
    createH3Tag(produit, articleTag);

    //création de l'élement p
    createPTag(produit, articleTag);

    aTag.appendChild(articleTag);
    item.appendChild(aTag);
}

getProducts();

//création de l'élement article
function createImageTag(produit, articleTag) {
    let imageTag = document.createElement('img');
    imageTag.src = produit.imageUrl;
    imageTag.alt = produit.altTxt;
    articleTag.appendChild(imageTag);
}

//création de l'élement h3
function createH3Tag(produit, articleTag) {
    let h3Tag = document.createElement('h3');
    h3Tag.class = 'productName';
    h3Tag.textContent = produit.name;
    articleTag.appendChild(h3Tag);
}

//création de l'élement p
function createPTag(produit, articleTag) {
    let pTag = document.createElement('p');
    pTag.class = 'productDescription';
    pTag.textContent = produit.description;
    articleTag.appendChild(pTag);
}



