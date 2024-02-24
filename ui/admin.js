let products = [];

const jwtToken = localStorage.getItem('jwtToken');

function logSelectedGear(selectedGear) {
    if (selectedGear !== null) {
        console.log("Seçilen Vites: " + selectedGear);
    } else {
        console.log("Vites seçilmedi.");,

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
    const productGear = selectedGear ? selectedGear.id : null;
    const selectedGear = document.querySelector('input[name="gearStatus"]:checked');
    
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

    products.forEach(car => {

        const row = productTableBody.insertRow();
        row.innerHTML = `
        <td> ${car.brandId} </td>
        <td> ${car.brand } </td>
        <td> ${car.model} </td>
        <td> ${car.color } </td>
        <td> ${car.gear} </td>
        <td> ${car.price} </td>
        <td> ${car.year} </td>
        <td> ${car.totalKm} </td>    
        <td> ${car.unitsInStock} </td>
        <td><img src="C:\\Users\\hasan.demircan\\Desktop\\e-commerce\\${car.image}" alt="${car.name}" style="max-width: 50px; ax-height: 50px;"> </td>
        <td> ${car.active ? 'Yes' : 'No'} </td>
        <td>
            <button class="btn btn-warning btn-sm" onclick="editProduct(${car.id})">Güncelle</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${car.id})">Sil</button>
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
function deleteProduct(carId) {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (confirmed) {
        // Silme işlemi burada gerçekleştirilebilir.
        fetch('http://localhost:8081/car/' + carId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
            },
        })
            .then(response => {
                if (response.ok) {
                    // Başarılı ise tabloyu güncelle

                    products = products.filter(product => car.id !== carId);
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

function resetAddProductForm() {
    document.getElementById('productImage');
    document.getElementById('productBrandId').value;
    document.getElementById('productBrand').value;
    document.getElementById('productModel').value; 
    document.getElementById('productColor').value;     
    // Vites seçimi için önce id alınmalı. name bilgisi üzerinden bu sağlanıyor. 
    const productGear = selectedGear ? selectedGear.id : null;
    document.querySelector('input[name="gearStatus"]:checked');
    
    
    document.getElementById('productPrice').value;
    document.getElementById('productYear').value;
    document.getElementById('productKM').value;
    document.getElementById('productUnitsInStock').value;
    document.getElementById('productActive').checked;
}

// Düzenleme modalını kapatmak için
function closeEditProductModal() {
    const editProductModal = new bootstrap.Modal(document.getElementById("editProductModal"));
    editProductModal.hide();
}

//Ürünü düzenlemek için modal görünümünü göster ve veri güncelle
function editProduct(productId) {
    const selectedProduct = products.find(product => product.id === productId);

    document.getElementById('editProductId').value = selectedProduct.brandId;
    document.getElementById('editProductBrandId').value = selectedProduct.brandId;
    document.getElementById('editProductBrand').value = selectedProduct.brand;
    document.getElementById('editProductModel').value = selectedProduct.model; 
    document.getElementById('editProductColor').value = selectedProduct.color;    
    document.getElementById('editProductGear').value = selectedProduct.gear; 
    document.getElementById('editProductPrice').value = selectedProduct.price;
    document.getElementById('editProductYear').value = selectedProduct.year;
    document.getElementById('editProductKM').value = selectedProduct.totalKm;
    document.getElementById('editProductUnitsInStock').value = selectedProduct.unitsInStock;
    document.getElementById('editProductActive').checked = selectedProduct.active;

    const editProductModal = new bootstrap.Modal(document.getElementById("editProductModal"));
    editProductModal.show();
}

//Düzenlenmiş ürünü kaydetmek için 
function saveEditedProduct() {

    const editedProductId = parseInt(document.getElementById("editProductId").value);
    //Görsel seçimi için input elementini al
    const editedImageInput = document.getElementById('editProductImage');
    const editedProductBrandId = document.getElementById('editProductBrandId').value;
    const editedProductBrand = document.getElementById('editProductBrand').value;
    const editedProductModel = document.getElementById('editProductModel').value; 
    const editedProductColor = document.getElementById('editProductColor').value;
    const editedProductGear = document.getElementById('editProductGear').value;
    const editedProductPrice = document.getElementById('editProductPrice').value;
    const editedProductYear = document.getElementById('editProductYear').value;
    const editedProductKM = document.getElementById('editProductKM').value;
    const editedProductUnitsInStock = document.getElementById('editProductUnitsInStock').value;
    const editedProductActive = document.getElementById('editProductActive').checked;

    
    

    const productData = {
        id: editedProductId,
        brand: editProductBrand,
        model: editProductModel,
        color: editProductColor,
        gear: editProductGear,
        price: editedProductPrice,
        year: editedProductYear,
        totalKm: editedProductKM,
        unitsInStock: editedProductUnitsInStock,
        
        active: editedProductActive,
        image: products.find(product => product.id === editedProductId).image
    };

    const formData = new FormData();
    formData.append('file', feditedSelectedImage = editedImageInput.files[0]);
    formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

    fetch('http://localhost:8081/car/update', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + jwtToken
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Başarılı sonuç
            console.log(data);
        })
        .catch(error => {
            // Hata durumu
            console.error('Error:', error);
        });
    // Edit modalı kapat
    $('#editProductModal').modal('hide');

    closeEditProductModal();
    //  $('#editProductModal').modal('hide'); // Modal'ı kapat.
}

// Sayfa yüklendiğinde çağrılacak fonksiyonlar
document.addEventListener("DOMContentLoaded", async () => {
    await getAllProduct();
    renderProductTable();
})


