fetch('navbar.html')
  .then(response => response.text())
  .then(html => {
    // Navbar içeriğini navbarContainer elementine ekle
    document.getElementById('navbarContainer').innerHTML = html;
  });