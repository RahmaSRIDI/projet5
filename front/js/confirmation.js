
   //recuperation de l'orderId à partir de l'URL 
function getOrderIdFromUrl() {
    var str = document.URL;
    var url = new URL(str);
    var orderIdFromUrl = url.searchParams.get("orderId");
    fillOrderId(orderIdFromUrl);
}
function fillOrderId(orderId) {
    var elements = document.getElementById('orderId');
    elements.textContent = orderId;
}

getOrderIdFromUrl();