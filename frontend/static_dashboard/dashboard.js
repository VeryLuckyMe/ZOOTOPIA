document.addEventListener('DOMContentLoaded', () => {
    // Static data to simulate backend response
    const staticData = {
        orders: 142,
        products: 56,
        appointments: 28,
        quantitySold: 1205,
        reviews: 89,
        totalIncome: 154200
    };

    updateDashboard(staticData);
});

function updateDashboard(data) {
    document.getElementById('orders-value').textContent = data.orders;
    document.getElementById('products-value').textContent = data.products;
    document.getElementById('appointments-value').textContent = data.appointments;
    document.getElementById('sold-value').textContent = data.quantitySold.toLocaleString();
    document.getElementById('reviews-value').textContent = data.reviews;
    document.getElementById('income-value').textContent = `₱${data.totalIncome.toLocaleString()}`;
}
