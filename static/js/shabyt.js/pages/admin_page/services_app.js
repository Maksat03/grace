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
base_service_form = {
    id: 0,
    parent_service_id: null,
    name: "",
    poster: "",
    description: "",
    images: [{image: ""}],
    on_submit: false,
}


services_app = Vue.createApp({
    data() {
        return {
            services: [],
            service_form: {},
            service_form_description_editor: null,

            categories: [],

            is_getting_services: false,
            is_getting_categories: false
        }
    },
    methods: {
        get_categories() {
            if (!this.is_getting_categories) {
                this.is_getting_categories = true

                axios("/api/service/get_categories/").then((response) => {
                    this.is_getting_categories = false
                    this.categories = []

                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i]["id"] != this.service_form["id"]) {
                            this.categories.push(response.data[i])
                        }
                    }
                })
            }
        },
        open() {
            this.open_section()

        },
        open_section() {
            if (!this.is_getting_services) {
                this.is_getting_services = true

                axios.get("/api/service/get_many/", {params: {ordering: JSON.stringify(['parent_service', '-id'])}}).then((response) => {
                    this.services = response.data
                    this.is_getting_services = false
                })
            }
        },
        close() {},
        clear_form() {
            for (var key in this.service_form) {
                if (key.startsWith("image: ") || key.startsWith("poster: ")) {
                    delete this.service_form[key]
                }
            }

            var service_form_image_inputs = document.getElementsByClassName("service_form_image_input")
            for (var i = 0; i < service_form_image_inputs.length; i++) {
                service_form_image_inputs[i].value = null

            }

            base_service_form["images"] = []
            document.getElementById("service_form").reset()
            this.service_form = Object.assign({}, base_service_form)
        },
        open_service_form(service=null) {
            this.get_categories()

            if (service) {
                this.service_form["id"] = service.id

                axios("/api/service/get/", {params:{"id": service.id}}).then((response) => {
                    this.clear_form()
                    this.service_form = Object.assign(this.service_form, response.data)

                    if (this.service_form_description_editor == null) {
                        this.service_form_description_editor = new Quill('#service_form_description_editor', {
                            theme: 'snow',
                            modules: quill_modules
                        })
                    }

                    this.service_form_description_editor.root.innerHTML = this.service_form["description"]
                })
            } else {
                if (this.service_form["id"]) {
                    this.clear_form()
                }

                if (this.service_form_description_editor == null) {
                    this.service_form_description_editor = new Quill('#service_form_description_editor', {
                        theme: 'snow',
                        modules: quill_modules
                    })
                }

                this.service_form_description_editor.root.innerHTML = this.service_form["description"]
            }

            document.getElementById("service_form_window").style.display = "block"
        },
        service_form_submit() {
            if (!this.service_form["on_submit"]) {
                this.service_form["on_submit"] = true

                if (!this.service_form["parent_service_id"]) {
                    this.service_form["parent_service_id"] = null
                } else {
                    if (this.service_form["parent_service_id"] == 'null') {
                        this.service_form["parent_service_id"] = null
                    }
                    this.service_form["parent_service_id"] = Number(this.service_form["parent_service_id"])
                }

                var service_form = Object.assign({}, this.service_form)
                service_form["images"] = JSON.stringify(this.service_form["images"])

                service_form["description"] = this.service_form_description_editor.root.innerHTML

                if (this.service_form["id"]) {
                    var url = "/api/service/edit/"
                } else {
                    var url = "/api/service/add/"
                }

                axios.post(url, service_form, {
                    headers: {
                        "X-CSRFToken": $cookies.get("csrftoken"),
                        'Content-Type': 'multipart/form-data',
                    }
                }).then((response) => {
                    document.getElementById("service_form_window").style.display = "none"
                    this.open_section()

                    this.clear_form()
                }).catch((error) => {
                    this.service_form["on_submit"] = false
                })
            }
        },
        open_file_select_window(key) {
            document.getElementById("service_image_upload_input_" + key).click()

        },
        handle_file_upload(image, event) {
            var file = event.target.files[0]
            if (file) {
                delete this.service_form[image["image"]]
                image["image"] = "image: " + (this.service_form.images.indexOf(image) + 1) + ". " + file.name
                this.service_form[image["image"]] = file
            } else {
                if (image["image"]) {
                    delete this.service_form[image["image"]]
                    image["image"] = ""
                }
            }
        },
        image_is_uploaded_to_input(image) {
            if (image.image) {
                return !(image.image.startsWith("/media/"))
            }
        },
        add_image() {
            this.service_form.images.push({image: ""})

        },
        delete_image(image) {
            delete this.service_form[image["image"]]
            this.service_form["images"].splice(this.service_form["images"].indexOf(image), 1)
        },
        delete_service() {
            swal({
              title: "Подтвердите ваше действия. Вы хотите удалить товар?",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((will) => {
                if (will) {
                    axios.post("/api/service/delete/", {id: this.service_form["id"]}, {
                        headers: {
                            "X-CSRFToken": $cookies.get("csrftoken")
                        }
                    }).then((response) => {
                        document.getElementById("service_form_window").style.display = "none"
                        this.open_section()
                        this.service_form = Object.assign({}, base_service_form)
                    })
                }
            })
        },
        window_scroll_down_event_listener() {},
        service_poster_is_uploaded_to_input() {
            if (this.service_form.poster) {
                return !(this.service_form.poster.startsWith("/media/"))
            }
        },
        handle_service_poster_upload(event) {
            var file = event.target.files[0]
            if (file) {
                delete this.service_form[this.service_form["poster"]]
                this.service_form["poster"] = "poster: " + file.name
                this.service_form[this.service_form["poster"]] = file
            } else {
                if (this.service_form["poster"]) {
                    delete this.service_form[this.service_form["poster"]]
                    this.service_form["poster"] = ""
                }
            }
        },
    },
    mounted() {
        this.service_form = Object.assign({}, base_service_form)

    }
})


services_app.config.compilerOptions.delimiters = ["${", "}"];
mounted_services_app = services_app.mount("#services")
