var ordering_select = null
var category_select = null
var min_price_input = null
var max_price_input = null
var pagination_el = null
var price_range_minimum_difference = 0

function set_values_of_get_many_request_params() {
    ordering_select = document.getElementById("ordering_select")
    category_select = document.getElementById("category_select")
    min_price_input = document.getElementById("min_price_input")
    max_price_input = document.getElementById("max_price_input")
}

function store_page_loaded() {
    var filter_details = document.getElementsByClassName("filter_details")[0];

    filter_details.getElementsByTagName("summary")[0].addEventListener("click", function(event) {
        event.preventDefault()

        if (filter_details.hasAttribute("data-open")) {
            filter_details.removeAttribute("data-open")
            filter_details.classList.remove('open_details');
        } else {
            filter_details.setAttribute("data-open", "true")
            filter_details.classList.add('open_details');
        }
    });

    pagination_el = $('#pagination')
    pagination_el.pagination({dataSource: [], callback: function(data, pagination) {}})

    set_values_of_get_many_request_params()
    price_range_minimum_difference = max_price_input.value * 0.1

    get_products()
}

function get_products() {
    var checked_brands_elements = document.querySelectorAll(".brands_checkbox input:checked")
    var brands = []

    for (var i = 0; i < checked_brands_elements.length; i++) {
        brands.push(checked_brands_elements[i].value)
    }

    set_values_of_get_many_request_params()
    var get_products_query_params = {
        "category": category_select.options[category_select.selectedIndex].value,
        "ordering": [ordering_select.options[ordering_select.selectedIndex].value],
        "min_price": min_price_input.value,
        "max_price": max_price_input.value,
    }

    if (brands.length > 0) {
        get_products_query_params["brands"] = JSON.stringify(brands)
    }

    var url = new URL(window.location.href);
    var queryParams = url.searchParams;

    for (var key in get_products_query_params) {
        queryParams.set(key, get_products_query_params[key]);
    }

    history.pushState({}, "", url.href);

    var filtration = {
        "category": get_products_query_params["category"],
        "price__lte": get_products_query_params["max_price"],
        "price__gte": get_products_query_params["min_price"]
    }

    if (brands.length > 0) {
        filtration["brand__in"] = brands
    }

    axios("/api/store/get_many/", {
        params: {
            "filtration": JSON.stringify(filtration),
            "ordering": JSON.stringify(get_products_query_params["ordering"])
        }
    }).then((response) => {
        pagination_el.pagination("destroy")

        pagination_el.pagination({
            dataSource: response.data,
            pageSize: 12,
            callback: function(data, pagination) {
                var html = "";

                for (var i = 0; i < data.length; i++) {
                    var product = data[i]
                    html += `
                        <a href="/product/${ product.id }/" class="product_card" onclick="custom_anchors_click_event(event)">
                            <div class="product_img" style="background-image: url(${ product.poster });"></div>
                            <div class="text">
                                <div class="pre_product_name_block">
                                    <h4>${ product.name }</h4>
                                </div>
                                <div class="pre_product_code_block">
                                    <p>Код товара: ${ product.code }</p>
                                </div>
                                <div class="after_product_name_block">
                                    <h3>${ product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') } тг</h3>
                                    <button onclick="open_buy_form(${ product.id }, '${ product.name }', '${ product.poster }', '${ product.price }', '${ product.code }')" onmouseover="disable_anchors()" onmouseout="enable_anchors()"><span>купить</span></button>
                                </div>
                            </div>
                        </a>
                    `
                }

                document.getElementsByClassName("products_list")[0].innerHTML = html;
            }
        })

        if (response.data.length <= 12) {
            document.getElementById("pagination").style.display = "none"
        }
    })
}

function slide_min_price() {
    set_values_of_get_many_request_params()

    if(parseInt(max_price_input.value) - parseInt(min_price_input.value) <= price_range_minimum_difference){
        min_price_input.value = parseInt(max_price_input.value) - price_range_minimum_difference;
    }

    min_price_input.value = Number(min_price_input.value)
    document.getElementById("min_price_text").innerText = min_price_input.value
}

function slide_max_price() {
    set_values_of_get_many_request_params()

    if(parseInt(max_price_input.value) - parseInt(min_price_input.value) <= price_range_minimum_difference){
        max_price_input.value = parseInt(min_price_input.value) + price_range_minimum_difference;
    }

    max_price_input.value = Number(max_price_input.value)
    document.getElementById("max_price_text").innerText = max_price_input.value
}

function open_category() {
    set_values_of_get_many_request_params()

    window.history.pushState({}, "", "/store/?category=" + category_select.value);
    load_page("/store/?category=" + category_select.value)
}
