document.addEventListener('DOMContentLoaded', function () {
    fetch('navbar/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
        });
});