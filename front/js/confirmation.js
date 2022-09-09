function getOrderIdFromUrl() {
    
    /*récupération de l'id à partir de l'URL */
    var str = document.URL;
    var url = new URL(str);
    var orderIdFromUrl = url.searchParams.get("orderId");
    console.log("orderIdFromUrl=="+orderIdFromUrl);
    fillOrderId(orderIdFromUrl);
}

function fillOrderId(orderId){
    var elements = document.getElementById('orderId');
    elements.textContent=orderId;
}

getOrderIdFromUrl();