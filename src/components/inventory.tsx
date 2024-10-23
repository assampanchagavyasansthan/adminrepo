import React, { useEffect, useState } from 'react';
import { db, storage } from './fierbase'; // Ensure this is the correct path
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaSearch, FaTrashAlt, FaEdit } from 'react-icons/fa';
import './inventory.css'; // Make sure to add styles for the table and edit input boxes

interface Product {
  id: string;
  imageUrl: string;
  medicineName: string;
  indications: string;
  doses: string;
  weight: string;
  price: number | string; // price can be a number or string, based on Firestore data format
  category: string;
}

const DisplayProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editableProductId, setEditableProductId] = useState<string | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Partial<Product>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'medicines');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productList);
      } catch (err) {
        console.error('Error fetching products: ', err);
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'medicines', id));
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      console.error('Error deleting product: ', err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditableProductId(product.id);
    setUpdatedProduct({ ...product });
    setSelectedImage(null); // Clear any previously selected image when editing a new product
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const uploadImageAndGetUrl = async (file: File, productId: string) => {
    const storageRef = ref(storage, `medicines/${productId}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleUpdate = async (id: string) => {
    try {
      let updatedProductData = { ...updatedProduct };

      // Upload new image if a new image is selected
      if (selectedImage) {
        const newImageUrl = await uploadImageAndGetUrl(selectedImage, id);
        updatedProductData.imageUrl = newImageUrl;
      }

      await updateDoc(doc(db, 'medicines', id), updatedProductData);
      setProducts(products.map(product => (product.id === id ? { ...product, ...updatedProductData } : product)));
      setEditableProductId(null);
    } catch (err) {
      console.error('Error updating product: ', err);
    }
  };

  const filteredProducts = products.filter(product =>
    product.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number | string) => {
    const parsedPrice = parseFloat(price as string);
    return isNaN(parsedPrice) ? price : parsedPrice.toFixed(2);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="table-container">
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '8px 32px 8px 8px',
            marginBottom: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
        <FaSearch
          style={{
            position: 'absolute',
            right: '10px',
            fontSize: '16px',
            color: '#aaa',
            top: '40%',
            transform: 'translateY(-50%)',
          }}
        />
      </div>

      <table className="borderless-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Medicine Name</th>
            <th>Indications</th>
            <th>Doses</th>
            <th>Weight</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td>
                <img
                  src={product.imageUrl}
                  alt={product.medicineName}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </td>
              {editableProductId === product.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={updatedProduct.medicineName || product.medicineName}
                      onChange={e => setUpdatedProduct({ ...updatedProduct, medicineName: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={updatedProduct.indications || product.indications}
                      onChange={e => setUpdatedProduct({ ...updatedProduct, indications: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={updatedProduct.doses || product.doses}
                      onChange={e => setUpdatedProduct({ ...updatedProduct, doses: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={updatedProduct.weight || product.weight}
                      onChange={e => setUpdatedProduct({ ...updatedProduct, weight: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={updatedProduct.price || product.price}
                      onChange={e => setUpdatedProduct({ ...updatedProduct, price: parseFloat(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input type="file" onChange={handleImageChange} />
                  </td>
                  <td>
                    <button onClick={() => handleUpdate(product.id)}>Save</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{product.medicineName}</td>
                  <td>{product.indications}</td>
                  <td>{product.doses}</td>
                  <td>{product.weight}</td>
                  <td>${formatPrice(product.price)}</td>
                  <td>
                    <button onClick={() => handleEdit(product)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(product.id)}>
                      <FaTrashAlt />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayProducts;
