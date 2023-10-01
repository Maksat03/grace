quill_modules = {
    'syntax': true,
    'toolbar': [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote'],

        [{'header': 1}, {'header': 2}],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],
        [{'indent': '-1'}, {'indent': '+1'}],
        [{'direction': 'rtl'}],

        [{'size': ['small', false, 'large', 'huge']}],
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],
        [{'font': []}],
        [{'align': []}],

        ['link']
    ],
    "imageResize": {
        "modules": ['Resize', 'DisplaySize', 'Toolbar']
    }
}
base_product_form = {
    category: "",
    name: "",
    poster: "",
    description: "",
    price: 0,
    code: "",
    brand: "",
    on_submit: false,
}


products_app = Vue.createApp({
    data() {
        return {
            products: [],
            product_form: {},
            product_form_description_editor: null,

            categories: [],
            brands: [],

            search_input: "",
            is_getting_products: false,
            searching_completed: false,
            is_getting_brands: false,
            is_getting_categories: false
        }
    },
    methods: {
        search_products() {
            if (!this.search_input) {return}

            if (!this.is_getting_products) {
                if (this.searching_completed == true) {
                    this.searching_completed = false
                    this.search_input = ""
                    this.open_section()
                } else {
                    this.is_getting_products = true

                    axios.get("/api/store/get_many/", {
                        params: {
                            "searching": JSON.stringify({
                                "text": this.search_input,
                                "searching_fields": [
                                    {
                                        "field_name": "name_lower",
                                        "with__icontains": true
                                    },
                                    {
                                        "field_name": "code_lower",
                                        "with__icontains": true
                                    },
                                ]
                            }),
                            ordering: JSON.stringify(['-id']),
                        }
                    }).then((response) => {
                        this.is_getting_products = false
                        this.searching_completed = true
                        this.products = response.data
                    })
                }
            }
        },
        search_input_changed(event) {
            if (!this.is_getting_products) {
                this.search_input = event.target.value
                this.searching_completed = false
            }
        },
        get_categories() {
            if (!this.is_getting_categories) {
                this.is_getting_categories = true

                axios("/api/store/get_categories/").then((response) => {
                    this.is_getting_categories = false
                    this.categories = response.data
                })
            }
        },
        get_brands(category) {
            if (!this.is_getting_brands) {
                this.is_getting_brands = true

                axios("/api/store/get_brands/", {params:{category: category}}).then((response) => {
                    this.is_getting_brands = false
                    this.brands = response.data
                })
            }
        },
        open() {
            this.open_section()

        },
        open_section() {
            if (!this.is_getting_products) {
                this.is_getting_products = true

                axios.get("/api/store/get_many/", {params: {ordering: JSON.stringify(['-id'])}}).then((response) => {
                    this.products = response.data
                    this.is_getting_products = false
                })
            }
        },
        close() {},
        clear_form() {
            for (var key in this.product_form) {
                if (key.startsWith("poster: ")) {
                    delete this.product_form[key]
                    break
                }
            }

            document.getElementById("product_form").reset()
            this.product_form = Object.assign({}, base_product_form)
        },
        open_product_form(product=null) {
            this.get_categories()

            if (product) {
                axios("/api/store/get/", {params:{"id": product.id}}).then((response) => {
                    this.clear_form()
                    this.product_form = Object.assign(this.product_form, response.data)

                    if (this.product_form_description_editor == null) {
                        this.product_form_description_editor = new Quill('#product_form_description_editor', {
                            theme: 'snow',
                            modules: quill_modules
                        })
                    }

                    this.product_form_description_editor.root.innerHTML = this.product_form["description"]
                    this.get_brands(this.product_form["category"])
                })
            } else {
                if (this.product_form["id"]) {
                    this.clear_form()
                }

                if (this.product_form_description_editor == null) {
                    this.product_form_description_editor = new Quill('#product_form_description_editor', {
                        theme: 'snow',
                        modules: quill_modules
                    })
                }

                this.product_form_description_editor.root.innerHTML = this.product_form["description"]
            }

            document.getElementById("product_form_window").style.display = "block"
        },
        product_form_submit() {
            if (!this.product_form["on_submit"]) {
                this.product_form["on_submit"] = true
                this.product_form["description"] = this.product_form_description_editor.root.innerHTML

                if (this.product_form["id"]) {
                    var url = "/api/store/edit/"
                } else {
                    var url = "/api/store/add/"
                }

                axios.post(url, this.product_form, {
                    headers: {
                        "X-CSRFToken": $cookies.get("csrftoken"),
                        'Content-Type': 'multipart/form-data',
                    }
                }).then((response) => {
                    document.getElementById("product_form_window").style.display = "none"
                    this.open_section()

                    this.clear_form()
                }).catch((error) => {
                    this.product_form["on_submit"] = false
                })
            }
        },
        delete_product() {
            swal({
              title: "Подтвердите ваше действия. Вы хотите удалить товар?",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((will) => {
                if (will) {
                    axios.post("/api/store/delete/", {id: this.product_form["id"]}, {
                        headers: {
                            "X-CSRFToken": $cookies.get("csrftoken")
                        }
                    }).then((response) => {
                        document.getElementById("product_form_window").style.display = "none"
                        this.open_section()
                        this.product_form = Object.assign({}, base_product_form)
                    })
                }
            })
        },
        window_scroll_down_event_listener() {},
        product_poster_is_uploaded_to_input() {
            if (this.product_form.poster) {
                return !(this.product_form.poster.startsWith("/media/"))
            }
        },
        handle_product_poster_upload(event) {
            var file = event.target.files[0]
            if (file) {
                delete this.product_form[this.product_form["poster"]]
                this.product_form["poster"] = "poster: " + file.name
                this.product_form[this.product_form["poster"]] = file
            } else {
                if (this.product_form["poster"]) {
                    delete this.product_form[this.product_form["poster"]]
                    this.product_form["poster"] = ""
                }
            }
        },
    },
    mounted() {
        this.product_form = Object.assign({}, base_product_form)

    }
})


products_app.config.compilerOptions.delimiters = ["${", "}"];
mounted_products_app = products_app.mount("#products")
