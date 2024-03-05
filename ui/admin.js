let cars = [];

const jwtToken = localStorage.getItem('jwtToken');

function logSelectedGear() {
    return document.querySelector("input[name=gearStatus]:checked")?.value;
}




async function addCar() {
    const fileInput = document.getElementById('carImage');
    const carBrandId = document.getElementById('carBrandId').value;
    const carBrand = document.getElementById('carBrand').value;
    const carModel = document.getElementById('carModel').value;
    const carColor = document.getElementById('carColor').value;
    // select yapısı denemek için:
    console.log("Seçilen Renk Değeri: " + carColor);
    // Vites seçimi için önce id alınmalı. name bilgisi üzerinden bu sağlanıyor. 
    debugger

    const selectedGear = logSelectedGear();
    // vites bilgi görmek için
    
    debugger;
    const carPrice = document.getElementById('carPrice').value;
    const carYear = document.getElementById('carYear').value;
    const carKM = document.getElementById('carKM').value;
    const carUnitsInStock = document.getElementById('carUnitsInStock').value;
    const carActive = document.getElementById('carActive').checked;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const carData = {
        brandId: carBrandId,
        brand: carBrand,
        model: carModel,
        color: carColor,
        gear: 'AUTOMATIC',
        price: carPrice,
        year: carYear,
        totalKm: carKM,
        unitsInStock: carUnitsInStock,
        active: carActive
    };

    formData.append('car', new Blob([JSON.stringify(carData)], { type: 'application/json' }));

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

    getAllCar();
    resetAddCarForm(); // Modal formunu sıfırla.
    //backende istek at
    $('#addCarModal').modal('hide'); // Modal'ı kapat.   

}

//car tablosunu güncellemek için
async function renderCarTable() {

    const carTableBody = document.getElementById("carTableBody");
    carTableBody.innerHTML = "";

    cars.forEach(car => {

        const row = carTableBody.insertRow();
        row.innerHTML = `
        <td> ${car.brandId} </td>
        <td> ${car.brand} </td>
        <td> ${car.model} </td>
        <td> ${car.color} </td>
        <td> ${car.gear} </td>
        <td> ${car.price} </td>
        <td> ${car.year} </td>
        <td> ${car.totalKm} </td>    
        <td> ${car.unitsInStock} </td>
        <td><img src="C:\\Users\\hasan.demircan\\Desktop\\e-commerce\\${car.image}" alt="${car.name}" style="max-width: 50px; ax-height: 50px;"> </td>
        <td> ${car.active ? 'Yes' : 'No'} </td>
        <td>
            <button class="btn btn-warning btn-sm" onclick="editCar(${car.id})">Güncelle</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCar(${car.id})">Sil</button>
        </td>    
      `;
    });
}
async function getAllCar() {
    try {
        const response = await fetch('http://localhost:8081/car/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken            },
 

        });

        if (!response.ok) {
            throw new Error('Failed to fetch cars');
        }

        cars = await response.json();
        await renderCarTable(); // Yeni ürünü tabloya ekleyerek güncelle.


    } catch (error) {
        console.error('Error:', error.message);
    }

}

// Ürünü silmek için
function deleteCar(carId) {
    const confirmed = confirm("Are you sure you want to delete this car?");
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

                    cars = cars.filter(car => car.id !== carId);
                    renderCarTable();
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

function resetAddCarForm() {
    document.getElementById('carImage');
    document.getElementById('carBrandId').value;
    document.getElementById('carBrand').value;
    document.getElementById('carModel').value;
    document.getElementById('carColor').value;
    // Vites seçimi için önce id alınmalı. name bilgisi üzerinden bu sağlanıyor. 
    const carGear = selectedGear ? selectedGear.id : null;
    document.querySelector('input[name="gearStatus"]:checked');


    document.getElementById('carPrice').value;
    document.getElementById('carYear').value;
    document.getElementById('carKM').value;
    document.getElementById('carUnitsInStock').value;
    document.getElementById('carActive').checked;
}

// Düzenleme modalını kapatmak için
function closeEditCarModal() {
    const editCarModal = new bootstrap.Modal(document.getElementById("editCarModal"));
    editCarModal.hide();
}

//Ürünü düzenlemek için modal görünümünü göster ve veri güncelle
function editCar(carId) {
    const selectedCar = cars.find(car => car.id === carId);

    document.getElementById('editCarId').value = selectedCar.brandId;
    document.getElementById('editCarBrandId').value = selectedCar.brandId;
    document.getElementById('editCarBrand').value = selectedCar.brand;
    document.getElementById('editCarModel').value = selectedCar.model;
    document.getElementById('editCarColor').value = selectedCar.color;
    document.getElementById('editCarGear').value = selectedCar.gear;
    document.getElementById('editCarPrice').value = selectedCar.price;
    document.getElementById('editCarYear').value = selectedCar.year;
    document.getElementById('editCarKM').value = selectedCar.totalKm;
    document.getElementById('editCarUnitsInStock').value = selectedCar.unitsInStock;
    document.getElementById('editCarActive').checked = selectedCar.active;

    const editCarModal = new bootstrap.Modal(document.getElementById("editCarModal"));
    editCarModal.show();
}

//Düzenlenmiş ürünü kaydetmek için 
function saveEditedCar() {

    const editedCarId = parseInt(document.getElementById("editCarId").value);
    //Görsel seçimi için input elementini al
    const editedImageInput = document.getElementById('editCarImage');
    const editedCarBrandId = document.getElementById('editCarBrandId').value;
    const editedCarBrand = document.getElementById('editCarBrand').value;
    const editedCarModel = document.getElementById('editCarModel').value;
    const editedCarColor = document.getElementById('editCarColor').value;
    const editedCarGear = document.getElementById('editCarGear').value;
    const editedCarPrice = document.getElementById('editCarPrice').value;
    const editedCarYear = document.getElementById('editCarYear').value;
    const editedCarKM = document.getElementById('editCarKM').value;
    const editedCarUnitsInStock = document.getElementById('editCarUnitsInStock').value;
    const editedCarActive = document.getElementById('editCarActive').checked;




    const carData = {
        id: editedCarId,
        brand: editCarBrand,
        model: editCarModel,
        color: editCarColor,
        gear: editCarGear,
        price: editedCarPrice,
        year: editedCarYear,
        totalKm: editedCarKM,
        unitsInStock: editedCarUnitsInStock,

        active: editedCarActive,
        image: cars.find(car => car.id === editedCarId).image
    };

    const formData = new FormData();
    formData.append('file', feditedSelectedImage = editedImageInput.files[0]);
    formData.append('car', new Blob([JSON.stringify(carData)], { type: 'application/json' }));

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
    $('#editCarModal').modal('hide');

    closeEditCarModal();

}

// Sayfa yüklendiğinde çağrılacak fonksiyonlar
document.addEventListener("DOMContentLoaded", async () => {
    await getAllCar();
    renderCarTable();
})


