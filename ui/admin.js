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

//product tablosunu güncellemek için
async function renderProductTable() {

    const productTableBody = document.getElementById("productTableBody");
    productTableBody.innerHTML = "";

    products.forEach(product => {

        const row = productTableBody.insertRow();
        row.innerHTML = `
        <td> ${product.brandId} </td>
        <td> ${product.brand } </td>
        <td> ${product.model} </td>
        <td> ${product.color } </td>
        <td> ${product.gear} </td>
        <td> ${product.price} </td>
        <td> ${product.year} </td>
        <td> ${product.totalKm} </td>    
        <td> ${product.unitsInStock} </td>
        <td><img src="C:\\Users\\hasan.demircan\\Desktop\\e-commerce\\${product.image}" alt="${product.name}" style="max-width: 50px; ax-height: 50px;"> </td>
        <td> ${product.active ? 'Yes' : 'No'} </td>
        <td>
            <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Güncelle</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Sil</button>
        </td>    
      `;
    });
}
async function getAllProduct() {

    try {
        const response = await fetch('http://localhost:8081/car/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        products = await response.json();
        await renderProductTable(); // Yeni ürünü tabloya ekleyerek güncelle.


    } catch (error) {
        console.error('Error:', error.message);
    }

}

// Ürünü silmek için
function deleteProduct(productId) {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (confirmed) {
        // Silme işlemi burada gerçekleştirilebilir.
        fetch('http://localhost:8081/car/' + productId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
            },
        })
            .then(response => {
                if (response.ok) {
                    // Başarılı ise tabloyu güncelle

                    products = products.filter(product => product.id !== productId);
                    renderProductTable();
                } else {
                    // Başarısız ise hata mesajını logla
                    console.error('Error:', response.status);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }
}

