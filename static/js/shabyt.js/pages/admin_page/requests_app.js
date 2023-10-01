requests_app = Vue.createApp({
    data() {
        return {
            requests: [],
            current_section: "store",
            prev_section: "",
        }
    },
    methods: {
        open() {
            this.open_category(this.current_section)

        },
        open_category(category) {
            this.current_section = category

            if (this.prev_section != "") {
                document.getElementById(this.prev_section + "_requests_category").style.color = "black"
            }
            document.getElementById(this.current_section + "_requests_category").style.color = "#0070c9"

            this.prev_section = this.current_section

            axios.get("/api/request/get_many/", {
                params: {
                    filtration: JSON.stringify({
                        category: this.current_section
                    }),
                    ordering: JSON.stringify(['-id'])
                }
            }).then((response) => {
                this.requests = response.data
            })
        },
        close() {},
        window_scroll_down_event_listener() {},
        accept_request(request) {
            axios.post("/api/request/update_fields/", {"id": request.id, "is_accepted": true}, {
                headers: {
                    "X-CSRFToken": $cookies.get("csrftoken"),
                }
            }).then((response) => {
                request.is_accepted = true
                request.answered_at = new Date()
                this.get_new_requests_count()
            })
        },
        get_request_data(request_id, data) {
            if ("text" in data) {
                return data["text"]
            }
        },
        get_valid_at(dt) {
            if (dt) {
                return moment(dt).format('DD-MM-YYYY, HH:mm')
            }
            return ""
        },
        get_new_requests_count() {
            axios("/api/request/get_new_requests_count/").then((response) => {
                var count = response.data["total"]
                var count_for_store = response.data["count_for_store"]
                var count_for_services = response.data["count_for_services"]

                var el_store = document.getElementById("new_requests_count_for_store")
                var el_services = document.getElementById("new_requests_count_for_services")
                var el = document.getElementById("new_requests_count")

                if (count != 0) {
                    el.className = ""
                    el.innerText = count
                    this.open_category(this.current_section)
                } else {
                    el.className = "new_requests_not_found"
                }

                if (count_for_store != 0) {
                    el_store.className = ""
                    el_store.innerText = count_for_store
                } else {
                    el_store.className = "new_requests_not_found"
                }

                if (count_for_services != 0) {
                    el_services.className = ""
                    el_services.innerText = count_for_services
                } else {
                    el_services.className = "new_requests_not_found"
                }
            })
        }
    },
    mounted() {
        this.get_new_requests_count()
        setInterval(this.get_new_requests_count, 30000);
    }
})


requests_app.config.compilerOptions.delimiters = ["${", "}"];
mounted_requests_app = requests_app.mount("#requests")
