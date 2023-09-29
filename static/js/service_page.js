function service_page_loaded() {
  observer.observe(document.getElementsByClassName("main_page_leave_request_container")[0])
}

function images_go_left_scroll() {
    document.querySelectorAll(".service-images .images-list")[0].scroll({
      left: document.querySelectorAll(".service-images .images-list")[0].scrollLeft - (document.querySelectorAll(".images-block")[0].offsetWidth * 0.9),
      behavior: "smooth",
    })
}

function images_go_right_scroll() {
    document.querySelectorAll(".service-images .images-list")[0].scroll({
      left: document.querySelectorAll(".service-images .images-list")[0].scrollLeft + (document.querySelectorAll(".images-block")[0].offsetWidth * 0.9),
      behavior: "smooth",
    })
}



function set_main_image(image) {
    document.getElementById("myModal").style.display = "flex"
    document.getElementById("modal_image").src = image
    document.getElementById("modal_image").setAttribute("data-src", image)
}

function show_prev_img() {
    var modal_image = document.getElementById("modal_image")
    var imgs = document.querySelectorAll(".service-images .images-list .images .image")

    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].getAttribute("data-src") == modal_image.getAttribute("data-src")) {
            if (i - 1 != -1) {
                modal_image.src = imgs[i - 1].getAttribute("data-src")
                document.getElementById("modal_image").setAttribute("data-src", imgs[i - 1].getAttribute("data-src"))
            } else {
                modal_image.src = imgs[imgs.length - 1].getAttribute("data-src")
                document.getElementById("modal_image").setAttribute("data-src", imgs[imgs.length - 1].getAttribute("data-src"))
            }

            break
        }
    }
}

function show_next_img() {
    var modal_image = document.getElementById("modal_image")
    var imgs = document.querySelectorAll(".service-images .images-list .images .image")

    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].getAttribute("data-src") == modal_image.getAttribute("data-src")) {
            if (i + 1 != imgs.length) {
                modal_image.src = imgs[i + 1].getAttribute("data-src")
                document.getElementById("modal_image").setAttribute("data-src", imgs[i + 1].getAttribute("data-src"))
            } else {
                modal_image.src = imgs[0].getAttribute("data-src")
                document.getElementById("modal_image").setAttribute("data-src", imgs[0].getAttribute("data-src"))
            }

            break
        }
    }
}
