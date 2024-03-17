// Sayfa yüklendiğinde veya kullanıcı logout olduğunda navbarı güncelle
function updateNavbar() {
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    
    const token = localStorage.getItem('jwtToken');

    if (token) {
        // Kullanıcı login olduysa
        loginLink.style.display = 'none'; // Login linkini gizle
        logoutLink.style.display = 'block'; // Logout linkini göster
    } else {
        // Kullanıcı logout olduysa
        loginLink.style.display = 'block'; // Login linkini göster
        logoutLink.style.display = 'none'; // Logout linkini gizle
    }
}

// Sayfa yüklendiğinde navbarı güncelle
document.addEventListener('DOMContentLoaded', updateNavbar);

// Logout işleminden sonra navbarı güncelle
function logout() {
    const token = localStorage.getItem('jwtToken');

    fetch('http://localhost:8081/customer/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Logout isteği başarısız. Durum kodu:' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Logout istek başarılı: ', data);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('customerId');
        // örneğin login sayfasına.
        window.location.href = "login.html";
    })
    .catch(error => {
        console.error('Logout işlemi sırasında bir hata oluştu:', error);
    });

    // Navbarı güncelle
    updateNavbar();
}
function submitForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("email: " + email);
    console.log("password: " + password);

    fetch('http://localhost:8081/customer/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Login isteği başarısız. Durum kodu:' + response.status);
            }
            return response.json();
        })
        .then((data) => {
            console.log('login istek başarılı: ', data);
            console.log('customerId : ' + data.customerId)
            // localStorage kullanılarak tarayıcı hafızasına kaydedilir.
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('customerId', data.customerId);

            // ROLE uygun yönlendirme için.
            const role = parseJwt(data.token);
            if ("ROLE_USER" === role) {
                window.location.href = "index.html";
            } else if ("ROLE_ADMIN" === role) {
                window.location.href = "admin.html";
            }
        })
        updateNavbar();
}

// JWT TOKEN İÇİN
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedData = JSON.parse(atob(base64));

    const userRole = decodedData.authorities[0].authority;
    console.log(userRole);
    return userRole;
}