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