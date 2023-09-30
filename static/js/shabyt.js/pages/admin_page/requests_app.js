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
                    })
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
        }
    }
})


requests_app.config.compilerOptions.delimiters = ["${", "}"];
mounted_requests_app = requests_app.mount("#requests")
