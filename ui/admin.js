let products = [];

const jwtToken = localStorage.getItem('jwtToken');

async function addProduct() {
    const fileInput = document.getElementById('productImage');
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productUnitsInStock = document.getElementById('productUnitsInStock').value;
    const productCategoryId = document.getElementById('productCategoryId').value;
    const productActive = document.getElementById('productActive').checked;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const productData = {
        name: productName,
        price: productPrice,
        unitsInStock: productUnitsInStock,
        categoryId: productCategoryId,
        active: productActive
    };

    formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

    await fetch('http://localhost:8080/product/save', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + jwtToken
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Başarılı sonuç

        })
        .catch(error => {
            // Hata durumu
            console.error('Error:', error);
        });
    // Backend'e POST isteği gönder.
    // products.push(newProduct);
    getAllProduct();
    resetAddProductForm(); // Modal formunu sıfırla.
    //backende istek at
    $('#addProductModal').modal('hide'); // Modal'ı kapat.
}
