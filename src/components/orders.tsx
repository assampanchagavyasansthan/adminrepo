import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import './OrdersPage.css';

interface Order {
  id: string;
  orderId: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  email: string;
  paymentMethod: string;
  totalAmount: number | string; // Allow totalAmount to be either number or string
  deliveryStatus: string; // Add deliveryStatus field
  items: {
    medicineName: string;
    price: number;
  }[];
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusToUpdate, setStatusToUpdate] = useState<{ id: string; deliveryStatus: string } | null>(null);
  const db = getFirestore();

  // Fetch orders data from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(ordersList);
    };

    fetchOrders();
  }, [db]);

  // Update delivery status in Firestore
  const handleUpdateStatus = async (id: string) => {
    if (statusToUpdate) {
      const orderDoc = doc(db, 'orders', id);
      await updateDoc(orderDoc, {
        deliveryStatus: statusToUpdate.deliveryStatus,
      });
      setStatusToUpdate(null); // Clear the input after updating
      // Refetch orders to get updated data
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const updatedOrdersList = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(updatedOrdersList);
    }
  };

  return (
    <div className="orders-container">
      <h1 className="orders-header">All Orders</h1>
      <table border="1" cellPadding="10" cellSpacing="0" className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Postal Code</th>
            <th>Country</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Payment Method</th>
            <th>Total Amount</th>
            <th>Items</th>
            <th>Delivery Status</th> {/* Moved Delivery Status header to the end */}
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.orderId}</td>
              <td>{order.name}</td>
              <td>{order.address}</td>
              <td>{order.city}</td>
              <td>{order.postalCode}</td>
              <td>{order.country}</td>
              <td>{order.phoneNumber}</td>
              <td>{order.email}</td>
              <td>{order.paymentMethod}</td>
              <td>${Number(order.totalAmount).toFixed(2)}</td> {/* Ensure totalAmount is treated as a number */}
              <td>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.medicineName}: ${item.price}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <input
                  type="text"
                  value={statusToUpdate?.id === order.id ? statusToUpdate.deliveryStatus : order.deliveryStatus}
                  onChange={(e) =>
                    setStatusToUpdate({ id: order.id, deliveryStatus: e.target.value })
                  }
                />
                <button onClick={() => handleUpdateStatus(order.id)}>Update</button>
              </td> {/* Display delivery status input and update button */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
