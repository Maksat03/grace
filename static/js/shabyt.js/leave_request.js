function leave_request_form_submit(event) {
    event.preventDefault()

    var form_data = new FormData(event.target)

    axios.post("/api/request/leave_request/", {
        fullname: form_data.get("fullname"),
        phone_number: form_data.get("phone_number"),
    }, {
        headers: {
            "X-CSRFToken": $cookies.get("csrftoken"),
        }
    }).then((response) => {
        if (response.data["logged_in"]) {
            window.location.href = '/admin/'
        } else {
            swal({
              title: "Ваша заявка принята. Ждите ответа от наших менеджеров))",
              button: "Окей",
            }).then(() => {
                window.location.reload()
            })
        }
    })
}