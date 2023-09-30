requests_app = Vue.createApp({
    data() {
        return {
            requests: [],
            current_section: "books"
        }
    },
    methods: {
        open() {
            this.open_section()

        },
        open_section() {
            axios.get(`/api/request/get_requests/?category=${this.current_section}`).then((response) => {
                this.requests = response.data
            })
        },
        close() {},
        window_scroll_down_event_listener() {},
        accept_request(request) {
            axios.post("/api/request/accept_request/" + request.id + "/", {}, {
                headers: {
                    "X-CSRFToken": $cookies.get("csrftoken"),
                }
            }).then((response) => {
                request.is_accepted = true
                request.accepted_at = response.data["accepted_at"]
            })
        }
    }
})


requests_app.config.compilerOptions.delimiters = ["${", "}"];
mounted_requests_app = requests_app.mount("#requests")
