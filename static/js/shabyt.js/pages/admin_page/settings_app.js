settings_app = Vue.createApp({
    data() {
        return {
            carousel_images_form_is_opened: false,
            delivery_price_setting_form_is_opened: false,
            information_on_site_form_is_opened: false,
            tg_ids_form_is_opened: false,
            guarantee_form_is_opened: false,
            guarantee_quill: null,
            about_us_form_is_opened: false,
            about_us_quill: null,
            carousel_images: [],
            uploaded_images: {},
            delivery_price: 0,
            tg_ids_form: "",
            information_on_site_form: {
                address: "",
                contacts: {
                    insta: "",
                    email: "",
                    phone_number: ""
                },
                statistics: {
                    ceil1: "",
                    ceil2: "",
                    ceil3: "",
                    ceil4: ""
                }
            },
        }
    },
    methods: {
        open() {},
        close() {},
        window_scroll_down_event_listener() {},
        open_about_us_form() {
            this.about_us_form_is_opened = true
            SiteSettingsServices.get_about_us_text().then((data) => {
                document.getElementById("about_us_quill").innerHTML = data["about_us"]
                this.about_us_quill = new Quill('#about_us_quill', {
                    theme: 'snow',
                    modules: quill_modules
                })
            })
        },
        about_us_form_submit() {
            SiteSettingsServices.save_about_us_text(this.about_us_quill.root.innerHTML)
            this.about_us_form_is_opened = false
        },
        open_guarantee_form() {
            this.guarantee_form_is_opened = true
            SiteSettingsServices.get_guarantee_text().then((data) => {
                document.getElementById("guarantee_quill").innerHTML = data["guarantee"]
                this.guarantee_quill = new Quill('#guarantee_quill', {
                    theme: 'snow',
                    modules: quill_modules
                })
            })
        },
        guarantee_form_submit() {
            SiteSettingsServices.save_guarantee_text(this.guarantee_quill.root.innerHTML)
            this.guarantee_form_is_opened = false
        },
        open_carousel_images_form() {
            this.carousel_images_form_is_opened = true
            SiteSettingsServices.get_carousel_images().then((data) => {
                this.carousel_images = data
            })
            this.uploaded_images = {}
        },
        open_delivery_price_setting_form() {
            this.delivery_price_setting_form_is_opened = true
            SiteSettingsServices.get_delivery_price().then((data) => {
                this.delivery_price = data["delivery_price"]
            })
        },
        open_information_on_site_form() {
            this.information_on_site_form_is_opened = true

            axios("/api/settings/information_on_site/").then((response) => {
                this.information_on_site_form = response.data
            })
        },
        open_tg_ids_form() {
            this.tg_ids_form_is_opened = true

            axios("/api/settings/tg_ids").then((response) => {
                var data = response.data
                var tg_ids = ""

                for (var i = 0; i < data.length; i++) {
                    tg_ids += `${ data[i] }`
                }

                this.tg_ids_form = tg_ids
            })
        },
        save_carousel_images() {
            SiteSettingsServices.save_carousel_images(this.uploaded_images, this.carousel_images).then((data) => {
                this.carousel_images = []
                this.carousel_images_form_is_opened = false
                this.uploaded_images = {}
                this.open()
            })
        },
        save_delivery_price() {
            SiteSettingsServices.save_delivery_price(this.delivery_price)
            this.delivery_price_setting_form_is_opened = false
        },
        save_information_on_site() {
            axios.post("/api/settings/information_on_site/", {information_on_site: this.information_on_site_form},
                {
                    headers: {
                        "X-CSRFToken": $cookies.get("csrftoken"),
                    }
                }
            )
            this.information_on_site_form_is_opened = false
        },
        save_tg_ids() {
            var tg_ids = this.tg_ids_form.split("\n")
            var result_tg_ids = []

            for (var i = 0; i < tg_ids.length; i++) {
                if (tg_ids[i]) {
                    result_tg_ids.push(tg_ids[i])
                }
            }

            axios.post("/api/settings/tg_ids/", {"tg_ids": result_tg_ids}, {
                headers: {
                    "X-CSRFToken": $cookies.get("csrftoken"),
                }
            })
            this.tg_ids_form_is_opened = false
        },
        handle_file_upload(image, event) {
            var file = event.target.files[0]
            if (file) {
                image["image"] = file.name
                this.uploaded_images["image: " + file.name] = file
            }
        },
        image_is_uploaded_to_input(image) {
            return !(image.image.startsWith("/media/"))

        },
        add_image() {
            this.carousel_images.push({image: "", link: ""})

        },
        delete_image(key) {
            this.carousel_images.splice(key, 1)

        }
    },
    computed: {
        settings_section_is_opened() {
            return (this.carousel_images_form_is_opened || this.delivery_price_setting_form_is_opened || this.information_on_site_form_is_opened || this.tg_ids_form_is_opened || this.about_us_form_is_opened || this.guarantee_form_is_opened)
        }
    }
})


settings_app.config.compilerOptions.delimiters = ["${", "}"];
mounted_settings_app = settings_app.mount("#settings")
