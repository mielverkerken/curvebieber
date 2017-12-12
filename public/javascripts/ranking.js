$(document).ready(function () {
    $.get("http://localhost:3000/api/user", function (result) {
        console.log(result);
        if (result.meta.status >= 200 && result.meta.status < 400) {
            let rank = 1;
            result.data.forEach(function (user) {
                $('#userranking').append(
                    "<tr>" +
                    "<td>" + rank + "</td>" +
                    "<td>" + user._nickname + "</td>" +
                    "<td>"+ user._points +"</td>" +
                    "</td>"
                );
                rank++;
            });
        }
    });
});