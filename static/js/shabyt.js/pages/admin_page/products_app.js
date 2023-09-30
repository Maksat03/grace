quill_modules = {
    'syntax': true,
    'toolbar': [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],

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

        ['link', 'image', 'video']
    ],
    "imageResize": {
        "modules": ['Resize', 'DisplaySize', 'Toolbar']
    }
}
base_product_form = {
    category: "",
    name: "",
    author: "",
    poster: "",
    description: "",
    price: 0,
    options: [{label: "Категория", value: ""}, {label: "Автор", value: ""}, {label: "Мұқаба", value: ""}],
    on_submit: false,
}


products_app = Vue.createApp({
    data() {
        return {
            current_section: "kz",
            products: [],
            product_form: {},
            product_form_description_editor: null,
        }
    },
    methods: {
        open() {
            if (this.products.length == 0) {
                this.open_section()
            }
        },
        close() {},
        open_section() {
            this.products = []

            ProductServices.get_products({products_filtration: JSON.stringify({})})
        },
        clear_form() {
            for (var key in this.product_form) {
                if (key.startsWith("image: ") || key.startsWith("poster: ")) {
                    delete this.product_form[key]
                }
            }

            document.getElementById("product_form").reset()
            base_product_form["images"] = []
            base_product_form["options"] = []

            this.product_form = Object.assign({}, base_product_form)
        },
        open_product_form(product=null) {
            if (product) {
                ProductServices.get_product(product.id).then((data) => {
                    this.clear_form()
                    this.product_form = Object.assign(this.product_form, data)

                    if (this.product_form_description_editor == null) {
                        this.product_form_description_editor = new Quill('#product_form_description_editor', {
                            theme: 'snow',
                            modules: quill_modules
                        })
                    }

                    this.product_form_description_editor.root.innerHTML = this.product_form["description"]
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
                    var submit_function = ProductServices.edit_product
                } else {
                    var submit_function = ProductServices.add_product
                }

                submit_function(this.product_form).then((result) => {
                    if (result["success"]) {
                        document.getElementById("product_form_window").style.display = "none"
                        this.open_section()

                        this.clear_form()
                    }
                })
            }
        },
        handle_file_upload(image, event) {
            var file = event.target.files[0]
            if (file) {
                delete this.product_form[image["image"]]
                image["image"] = "image: " + (this.product_form.images.indexOf(image) + 1) + ". " + file.name
                this.product_form[image["image"]] = file
            } else {
                if (image["image"]) {
                    delete this.product_form[image["image"]]
                    image["image"] = ""
                }
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
                    ProductServices.delete_product(this.product_form["id"]).then((response) => {
                        document.getElementById("product_form_window").style.display = "none"
                        this.open_section()
                        this.product_form = Object.assign({}, base_product_form)
                    })
                }
            })
        },
        image_is_uploaded_to_input(image) {
            if (image.image) {
                return !(image.image.startsWith("/media/"))
            }
        },
        add_image() {
            this.product_form.images.push({image: ""})

        },
        delete_image(image) {
            delete this.product_form[image["image"]]
            this.product_form["images"].splice(this.product_form["images"].indexOf(image), 1)
        },
        open_file_select_window(key) {
            document.getElementById("product_image_upload_input_" + key).click()

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
        delete_option(option) {
            this.product_form["options"].splice(this.product_form["options"].indexOf(option), 1)

        },
        add_product_option() {
            this.product_form["options"].push({label: "", value: ""})

        }
    },
    mounted() {
        this.product_form = Object.assign({}, base_product_form)

    }
})


products_app.config.compilerOptions.delimiters = ["${", "}"];
mounted_products_app = products_app.mount("#products")
