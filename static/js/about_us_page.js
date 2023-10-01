function about_us_page_loaded() {
    var partners = document.querySelectorAll(".partners_info .partners_list .partner_card")

    for (var i = partners.length - 1; i >= 0; i--) {
        observer.observe(partners[i])
    }

    observer.observe(document.getElementsByClassName("main_page_leave_request_container")[0])
}