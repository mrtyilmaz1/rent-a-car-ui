let products = [];

const jwtToken = localStorage.getItem('jwtToken');

function logSelectedGear(selectedGear) {
    if (selectedGear !== null) {
        console.log("Seçilen Vites: " + selectedGear);
    } else {
        console.log("Vites seçilmedi.");
    }
}

async function addProduct() {
    const fileInput = document.getElementById('productImage');
    const productBrandId = document.getElementById('productBrandId').value;
    const productBrand = document.getElementById('productBrand').value;
    const productModel = document.getElementById('productModel').value; 
    const productColor = document.getElementById('productColor').value;
    // select yapısı denemek için:
    console.log("Seçilen Renk Değeri: " + productColor);    
    // Vites seçimi için önce id alınmalı. name bilgisi üzerinden bu sağlanıyor. 
    const selectedGear = document.querySelector('input[name="gearStatus"]:checked');
    const productGear = selectedGear ? selectedGear.id : null;
    // vites bilgi görmek için
    logSelectedGear(productGear);
    const productPrice = document.getElementById('productPrice').value;
    const productYear = document.getElementById('productYear').value;
    const productKM = document.getElementById('productKM').value;
    const productUnitsInStock = document.getElementById('productUnitsInStock').value;
    const productActive = document.getElementById('productActive').checked;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const productData = {
        brandId: productBrandId,
        brand: productBrand,
        model: productModel,
        color: productColor,
        gear: productGear,
        price: productPrice,
        year: productYear,
        totalKm: productKM,
        unitsInStock: productUnitsInStock,
        active: productActive
    };

    formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

    await fetch('http://localhost:8081/car/save', {
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
