function store_page_loaded() {
    var filter_details = document.getElementsByClassName("filter_details")[0];

    filter_details.getElementsByTagName("summary")[0].addEventListener("click", function(event) {
        event.preventDefault()

        if (filter_details.hasAttribute("data-open")) {
            filter_details.removeAttribute("data-open")
            filter_details.classList.remove('open_details');
        } else {
            filter_details.setAttribute("data-open", "true")
            filter_details.classList.add('open_details');
        }
    });

    $('#pagination').pagination({
        dataSource: [1, 2, 3, 4, 5, 6, 7, 195],
        pageSize: 2,
        callback: function(data, pagination) {
            // template method of yourself
            var html = template(data);
            dataContainer.html(html);
        }
    })
}
