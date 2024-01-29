// Markaları getirme fonksiyonu
async function fetchCategories() {
    const categoriesUrl = 'http://localhost:8081/brand';
    try {
        const response = await fetch(categoriesUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
            }
        });
        if (!response.ok) {
            throw new Error('Başarısız durum kodu: ' + response.status);
        }
        const data = await response.json();
        displayCategories(data);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}