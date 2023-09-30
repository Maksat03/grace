class ProductServices {
    static get_products(GetProductsRequestSchema) {
        return axios.get("/api/product/get_products/", {
            params: GetProductsRequestSchema
        }).then((response) => {
            for (var i = 0; i < response.data.length; i++) {
                mounted_products_app.products.push(response.data[i])
            }
            return {success: true, data: response.data}
        }).catch((error) => {
            console.log(error)
            return {success: false, data: {}}
        })
    }

    static get_product(product_id) {
        return axios.get("/api/product/get_product/?product_id=" + product_id).then(response => response.data)
        
    }

    static edit_product(product_form) {
        var form_data = new FormData()
        for (var key in product_form) {
            if (key == "images" || key == "options") {
                form_data.append(key, JSON.stringify(product_form[key]));
            } else {
                form_data.append(key, product_form[key]);
            }
        }

        return axios.post("/api/product/edit_product/", form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                "X-CSRFToken": $cookies.get("csrftoken"),
            }
        }).then((response) => {
            return {success: true}
        }).catch((error) => {
            swal("Упс", "Что-то пошло не так!")
            return {success: false}
        }).finally(() => {
            product_form["on_submit"] = false
        })
    }

    static add_product(product_form) {
        var form_data = new FormData()
        for (var key in product_form) {
            if (key == "images" || key == "options") {
                form_data.append(key, JSON.stringify(product_form[key]));
            } else {
                form_data.append(key, product_form[key]);
            }
        }

        return axios.post("/api/product/add_product/", form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                "X-CSRFToken": $cookies.get("csrftoken"),
            }
        }).then((response) => {
            return {success: true, product_id: response.data["product_id"]}
        }).catch((error) => {
            swal("Упс", "Что-то пошло не так!")
            return {success: false}
        }).finally(() => {
            product_form["on_submit"] = false
        })
    }

    static delete_product(product_id) {
        return axios.post("/api/product/delete_product/", {product_id: product_id}, {
            headers: {
                "X-CSRFToken": $cookies.get("csrftoken"),
            }
        }).then((response) => response.data)
    }
}