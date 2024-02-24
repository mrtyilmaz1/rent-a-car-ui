let cars = [];

const jwtToken = localStorage.getItem('jwtToken');
const customerId = localStorage.getItem('customerId');

//sepet içeriği
let cartItems = [];

// ürün listesini oluştur.
function renderCarList() {
    const carList = document.getElementById("carList");
    carList.innerHTML = "";

    cars.forEach(car => {
        if (car.active) {
            const carCard = document.createElement("div");
            carCard.classList.add("col-md-6", "mb-4");

            // İmage elementini oluştur
            const carImage = document.createElement("img");
            carImage.src = `C:\\Users\\murat\\Desktop\\cars\\${car.image}`;
            carImage.alt = car.model;
            carImage.style.maxWidth = "50px";
            carImage.style.maxHeight = "50px";

            // Diğer ürün bilgilerini içeren card içeriğini oluştur
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            cardBody.innerHTML = `
                <h5 class="card-title"> ${car.brand} + ${car.model} </h5>
                <p class="card-text"> Fiyat: ${car.price}</p>
                <button class="btn btn-primary" onclick="addToCart(${car.id})"> Sepete Ekle </button>
            `;

            // Image ve card içeriğini carCard'a ekle
            carCard.appendChild(carImage);
            carCard.appendChild(cardBody);

            // carCard'ı carList'e ekle
            carList.appendChild(carCard);
        }
    });
}

document.addEventListener('DOMContentLoaded', async function () {

    // Kategori seçimini dinle
    const brandSelect = document.getElementById('brandSelect');
    brandSelect.addEventListener('change', function () {
        const selectedBrandId = brandSelect.value;
        fetchcarsByBrand(selectedBrandId);
    });

    // Ürünleri ve kategorileri getir
    await fetchBrands();
    await fetchcarsByBrand(brandSelect.value);

    // Satın al butonunu dinle
    document.getElementById('buyButton').addEventListener('click', function () {
        // Satın alma işlemi
        alert('Satın alma işleminiz başarıyla tamamlandı!');
        // Siparişi backend'e gönderme işlemi burada gerçekleştirilebilir

        // Sipariş verildikten sonra sepeti temizle
        clearCart();
        // Satın al butonunun görünürlüğünü güncelle
        updateBuyButtonVisiblitiy();
    });

    // Sayfa yüklendiğinde çağrılacak fonksiyonlar
    renderCarList();
    updateCart();
    updateBuyButtonVisiblitiy();
});

// Kategorileri getirme fonksiyonu
async function fetchBrand() {
    const brandsUrl = 'http://localhost:8081/brand';
    try {
        const response = await fetch(brandsUrl, {
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
        displayBrands(data);
    } catch (error) {
        console.error("Error fetching brands:", error);
    }
}

// Kategorileri sayfada gösterme fonksiyonu
function displayBrands(brands) {
    const brandSelect = document.getElementById('brandSelect');
    brandSelect.innerHTML = ''; // Önceki kategorileri temizle

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.id;
        option.textContent = brand.brand;
        brandSelect.appendChild(option);
    });
}

// Ürünleri kategoriye göre getirme fonksiyonu
async function fetchCarsByBrand(brandId) {
    const endpointUrl = 'http://localhost:8081/car/brand/' + brandId;
    try {
        const response = await fetch(endpointUrl, {
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
        brands = data;
        renderBrandList();
    } catch (error) {
        console.error("Error fetching brands:", error);
    }
}

//sepete ürün ekle
function addToCart(carId) {
    const brandToAdd = brands.find(brand => brand.id === brandId);
    if (brandToAdd && brandToAdd.unitsInStock > 0) {
        cartItems.push({ id: brandToAdd.id, name: brandToAdd.brand + brandToAdd.model, price: brandToAdd.price })
        brandToAdd.unitsInStock--; // stoktan düş, çünkü ben sepetime eklediysem ve 1 tane varsa başkası alamasın.
        updateCart();
        updateBuyButtonVisiblitiy();
    }
}

function updateCart() {
    const cart = document.getElementById("cart");
    cart.innerHTML = ""; //temizle

    //sepet içeriğini göster
    cartItems.forEach((item, index) => {
        const cartItemElement = document.createElement("li")
        cartItemElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        const itemNameElement = document.createElement("span")
        cartItemElement.textContent = `${item.name} - Fiyat: ${item.price}`;
        const deleteButton = document.createElement("button")
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.onclick = function () {
            removeFromCart(index);
        };

        cartItemElement.appendChild(itemNameElement);
        cartItemElement.appendChild(deleteButton);
        cart.appendChild(cartItemElement);
    })
}

//Sepetten ürün çıkar
function removeFromCart(index) {
    const removedItem = cartItems.splice(index, 1)[0];
    //ürün stoğunu artır
    const car = cars.find(p => p.id === removedItem.id);
    console.log("silinen ürün " + car)
    if (car) {
        car.unitsInStock++;
    }
    updateCart();
    updateBuyButtonVisiblitiy();
}

function updateBuyButtonVisiblitiy() {
    const buyButton = document.getElementById("buyButton");

    //Eğer sepet boşsa "Satın Al" butonunu gizle, doluysa göster
    if (cartItems.length === 0) {
        buyButton.style.display = 'none';
    } else {
        buyButton.style.display = 'block'
    }
}

//Satın Al (buyButton) tıklama olayını(event/function) ekle.
//istersen buyButton id'li html'e git ve onclick=functionName ekleyerek buraya function ekle.
document.getElementById("buyButton").addEventListener('click', function () {
    //Burada satın alma işlemini gerçekleştireceğiz.
    //yani backende istek atacaz, cartItems içerisinde bulunan ürünleri
    alert("Satın alma işleminiz başarıyla tamamlandı!")

    // Create a map to store counts
    const idCountMap = new Map();

    // Iterate through the cartItems array
    cartItems.forEach(item => {
        const { id } = item;

        // Check if the id exists in the map
        if (idCountMap.has(id)) {
            // If it exists, increment the count
            idCountMap.set(id, idCountMap.get(id) + 1);
        } else {
            // If it doesn't exist, set the count to 1
            idCountMap.set(id, 1);
        }
    });

    // Display the id and count mapping
    idCountMap.forEach((count, id) => {
        console.log(`ID: ${id}, Count: ${count}`);
    });
    var orderProductInfoList = [...idCountMap].map(([productId, quantity]) => ({ productId, quantity }));
    console.log("map to List -> " + orderProductInfoList)


    //kullanıcı sipariş ver dedğinde backend api ye istek atar
    fetch('http://localhost:8080/order', {
        method: 'POST',
        body: JSON.stringify({
            customerId,
            orderProductInfoList
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: 'Bearer ' + jwtToken
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(' isteğiaşarısız. Durum kodu:' + response.status);
            }
            return response.json();
        })
        .then((data) => {

        })
    //istersen burada satın aldıktan sonra başka sayfayada yönlendirebilirsin.
    console.log(cartItems)
    clearCart();
    //Satın al butonunun görünürlüğünü güncelle
    updateBuyButtonVisiblitiy();
})

function clearCart() {
    cartItems = [];
    updateCart();
}

// Sayfa yüklendiğinde çağrılacak fonksiyonlar
document.addEventListener("DOMContentLoaded", async () => {
    //await getProductListByApi();

    renderProductList();
    updateCart();
    updateBuyButtonVisiblitiy();
})