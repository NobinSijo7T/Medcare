/**
 * Sample order seed data.
 * productIds and userIds are filled dynamically by seederScript.js
 * after the products and users have been inserted into the DB.
 */

const sampleOrders = (users, products) => {
    // helper – pick n random items from array
    const pick = (arr, n) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    };

    const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    const paymentMethods = ["Cash on Delivery", "UPI", "Credit Card", "Debit Card"];

    // We'll generate one order per regular user × 3, plus a few extra for admins
    const orders = [];

    // Find regular (non-admin) users first; fall back to all if none
    const regularUsers = users.filter((u) => !u.isAdmin);
    const targetUsers = regularUsers.length > 0 ? regularUsers : users;

    targetUsers.forEach((user) => {
        // Each user gets 3 sample orders
        for (let i = 0; i < 3; i++) {
            const pickedProducts = pick(products, Math.floor(Math.random() * 3) + 1);

            const orderItems = pickedProducts.map((p) => ({
                name: p.title,
                qty: Math.floor(Math.random() * 3) + 1,
                imageUrl: p.imgsrc || "",
                price: p.price,
                product: p._id,
            }));

            const itemsTotal = orderItems.reduce(
                (sum, item) => sum + item.price * item.qty,
                0
            );
            const taxPrice = parseFloat((itemsTotal * 0.05).toFixed(2));
            const shippingPrice = itemsTotal > 500 ? 0 : 49;
            const totalPrice = parseFloat(
                (itemsTotal + taxPrice + shippingPrice).toFixed(2)
            );

            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const isPaid = status === "Delivered" || Math.random() > 0.5;
            const isDelivered = status === "Delivered";

            // Spread orders across last 30 days
            const daysAgo = Math.floor(Math.random() * 30);
            const createdAt = new Date(Date.now() - daysAgo * 86400000);

            orders.push({
                user: user._id,
                orderItems,
                shippingAddress: {
                    address: `${Math.floor(Math.random() * 999) + 1} Sample Street`,
                    city: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"][
                        Math.floor(Math.random() * 5)
                    ],
                    postalCode: `${Math.floor(Math.random() * 900000) + 100000}`,
                    country: "India",
                },
                paymentMethod:
                    paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                taxPrice,
                shippingPrice,
                totalPrice,
                isPaid,
                paidAt: isPaid ? createdAt : undefined,
                status,
                isDelivered,
                deliveredAt: isDelivered ? createdAt : undefined,
                createdAt,
                updatedAt: createdAt,
            });
        }
    });

    return orders;
};

module.exports = sampleOrders;
