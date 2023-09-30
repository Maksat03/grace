let anchors_disabled = false

function disable_anchors() {
    anchors_disabled = true
}

function enable_anchors() {
    anchors_disabled = false
}

function set_page_title() {
    document.title = document.getElementById("page_title").innerText

}


function disappear_page() {
    document.getElementsByClassName("body")[0].classList.remove('fade-in');
    document.getElementsByClassName("body")[0].classList.add('fade-out');

    setTimeout(function() {
        if (document.getElementsByClassName("body")[0].classList.contains('fade-out')) {
            document.getElementsByClassName("loading_block")[0].className = "loading_block active_loading_block"
        }
    }, 2500)
}


function appear_page() {
    document.getElementsByClassName("loading_block")[0].className = "loading_block"
    document.getElementsByClassName("body")[0].classList.remove('fade-out');
    document.getElementsByClassName("body")[0].classList.add('fade-in');
}

function page_loaded_js_function() {
    document.getElementById("page_loaded_js_function").click()
}


function load_page(url) {
    axios(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    }).then((response) => {
        window.scrollTo(0, 0);

        document.getElementsByClassName("body")[0].innerHTML = response.data;

        set_anchors_click_event_listener()
        set_page_title()
        appear_page()
        page_loaded_js_function()
        document.body.style.overflow = 'auto';
    }).catch(error => console.error('Ошибка загрузки страницы:', error));
}


function custom_anchors_click_event(event) {
    event.preventDefault();

    if (anchors_disabled) {
        return
    }

    disappear_page()

    setTimeout(function() {
        var href = event.target.getAttribute('href');

        if (!href) {
            var parent = event.target.parentNode

            while (true) {
                if (parent.tagName == "A") {
                    href = parent.getAttribute('href')
                    break
                } else {
                    parent = parent.parentNode
                }
            }
        }

        window.history.pushState({}, "", href);
        load_page(href);
    }, 500);
}


function set_anchors_click_event_listener() {
    var anchors = document.querySelectorAll('a')

    anchors.forEach(function(anchor) {
        anchor.addEventListener('click', function(event) {
            custom_anchors_click_event(event)
        });
    });
}


function wait_burger_opening() {
    document.getElementsByClassName("burger-container")[0].classList.toggle("active_burger")
    document.getElementsByClassName("burger")[0].removeEventListener("transitionend", wait_burger_opening)
}


function open_burger() {
    document.getElementsByClassName("hamburger-menu")[0].classList.toggle('active_hamburger');
    document.getElementsByClassName("burger")[0].addEventListener("transitionend", wait_burger_opening)
    document.getElementsByClassName("hamburger-menu")[0].onclick = close_burger
    document.body.style.overflow = 'hidden';
}

function wait_burger_content_closing() {
    document.getElementsByClassName("hamburger-menu")[0].classList.toggle('active_hamburger');
    document.getElementsByClassName("burger-container")[0].removeEventListener("transitionend", wait_burger_content_closing)
}

function close_burger() {
    document.getElementsByClassName("burger-container")[0].classList.toggle("active_burger")
    document.getElementsByClassName("burger-container")[0].addEventListener("transitionend", wait_burger_content_closing)
    document.getElementsByClassName("hamburger-menu")[0].onclick = open_burger
    document.body.style.overflow = 'auto';
}


load_page(window.location.search)



const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-viewport');
    }
  });
});


window.addEventListener("popstate", function(event) {
  if (event.type === "popstate") {
    disappear_page()
    setTimeout(function() {
        load_page(window.location.search)
    }, 500);
  }
})


function open_request_form() {
    document.getElementById("request-form-window").style.display = "block"
}

function close_request_form() {
    document.getElementById("request-form-window").style.display = "none"
}

function leave_request_form_submit(event) {
    event.preventDefault()

    var form = event.target
    var formData = {};

    for (var i = 0; i < form.elements.length; i++) {
        var element = form.elements[i];

        if (element.tagName === 'INPUT' && element.hasAttribute('name')) {
          var name = element.getAttribute('name');
          var value = element.value;
          formData[name] = value;
        }
    }

    axios.post("/api/request/add/", formData, {
        headers: {
            "X-CSRFToken": $cookies.get("csrftoken"),
        }
    }).then((response) => {
        sweetalert("Принято, менеджеры свяжутся с вами через несколько минут")
        close_request_form()
    })
}

function sweetalert(title) {
    Swal.fire(
      'Grace Agency',
      title,
      'success'
    )
}
