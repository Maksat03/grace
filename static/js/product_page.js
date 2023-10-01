function product_page_loaded() {}

function open_buy_form(product_id, product_name, product_image, product_price, product_code) {
    document.getElementById("buy-form-window").style.display = "block"
    document.getElementById("product_poster").style.backgroundImage = "url(" + product_image + ")"
    document.getElementById("product_code").innerText = "Код товара: " + product_code
    document.getElementById("product_price").innerText = product_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    document.getElementById("product_name").innerText = product_name
    document.getElementById("product_count").value = 1
    document.getElementById("buy-form-product_id").value = product_id
    set_product_sum()
}

function close_buy_form(product_name, product_image) {
    document.getElementById("buy-form-window").style.display = "none"
}

function set_product_sum() {
    document.getElementById("product_sum").innerText = (Number(document.getElementById("product_count").value) * Number(parseInt(document.getElementById("product_price").innerText.replace(/\s+/g, ''), 10))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function buy_form_submit(event) {
    event.preventDefault()

    var form = event.target
    var formData = {};

    for (var i = 0; i < form.elements.length; i++) {
        var element = form.elements[i];

        if (element.tagName === 'INPUT' && element.hasAttribute('name')) {
          var name = element.getAttribute('name');
          var value = element.value;
          formData[name] = value;
        }
    }

    axios.post("/api/request/add/", formData, {
        headers: {
            "X-CSRFToken": $cookies.get("csrftoken"),
        }
    }).then((response) => {
        sweetalert("Принято, менеджеры свяжутся с вами через несколько минут")
        close_buy_form()
    })
}
