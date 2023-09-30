class SiteSettingsServices {
    static get_carousel_images() {
        return axios.get("/api/site_settings/get_carousel_images/").then(response => response.data)
    }

    static save_carousel_images(uploaded_images, carousel_images) {
        var form_data = new FormData()
        uploaded_images['images'] = JSON.stringify(carousel_images)

        for (var key in uploaded_images) {
            form_data.append(key, uploaded_images[key]);
        }

        return axios.post("/api/site_settings/save_carousel_images/", form_data, {
            headers: {
                "X-CSRFToken": $cookies.get("csrftoken"),
            }
        }).then(response => response.data)
    }

    static get_delivery_price() {
        return axios.get("/api/site_settings/get_delivery_price/").then(response => response.data)
    }

    static get_languages() {
        return axios.get("/api/site_settings/get_languages/").then(response => response.data)
    }

    static get_tg_ids() {
        return axios.get("/api/site_settings/get_tg_ids/").then(response => response.data)
    }

    static save_delivery_price(delivery_price) {
        axios.post("/api/site_settings/save_delivery_price/", {delivery_price: delivery_price}, {
            headers: {
                "X-CSRFToken": $cookies.get("csrftoken"),
            }
        })
    }

    static save_tg_ids(tg_ids_form) {
        axios.post("/api/site_settings/save_tg_ids/", tg_ids_form, {
            headers: {
                "X-CSRFToken": $cookies.get("csrftoken"),
            }
        })
    }

    static save_languages(languages_form) {
        axios.post("/api/site_settings/save_languages/", languages_form, {
            headers: {
                "X-CSRFToken": $cookies.get("csrftoken"),
            }
        })
    }

    static get_about_us_text() {
        return axios.get("/api/site_settings/get_about_us_text/").then(response => response.data)
    }

    static save_about_us_text(text) {
        axios.post("/api/site_settings/save_about_us_text/", {text: text}, {
            headers: {
                "X-CSRFToken": $cookies.get("csrftoken"),
            }
        })
    }

    static get_guarantee_text() {
        return axios.get("/api/site_settings/get_guarantee_text/").then(response => response.data)
    }

    static save_guarantee_text(text) {
        axios.post("/api/site_settings/save_guarantee_text/", {text: text}, {
            headers: {
                "X-CSRFToken": $cookies.get("csrftoken"),
            }
        })
    }
}