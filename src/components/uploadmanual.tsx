import React, { useState } from 'react';
import { db, storage } from './fierbase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './upload.css'; // Make sure to create and import the CSS file

const UploadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    medicineName: '',
    indications: '',
    doses: '',
    weight: '',
    price: '',
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });

      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl: string | null = null;

      if (formData.image) {
        const imageRef = ref(storage, `images/${formData.image.name}`);
        const snapshot = await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'medicines'), {
        medicineName: formData.medicineName,
        indications: formData.indications,
        doses: formData.doses,
        weight: formData.weight,
        price: formData.price,
        imageUrl: imageUrl,
      });

      alert('Data uploaded successfully!');
      setFormData({
        medicineName: '',
        indications: '',
        doses: '',
        weight: '',
        price: '',
        image: null,
      });
      setPreview(null);
    } catch (error) {
      console.error('Error uploading data: ', error);
      alert('Error uploading data');
    }
  };

  return (
    <div className="upload-form-container">
      <form onSubmit={handleSubmit} className="upload-form">
        <h2>Upload Medicine Data</h2>
        <div className="form-group">
          <label htmlFor="medicineName">Medicine Name:</label>
          <input
            type="text"
            id="medicineName"
            name="medicineName"
            value={formData.medicineName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="indications">Indications:</label>
          <textarea
            id="indications"
            name="indications"
            value={formData.indications}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="doses">Doses:</label>
          <input
            type="text"
            id="doses"
            name="doses"
            value={formData.doses}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="weight">Weight:</label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            required
          />
          {preview && (
            <div className="image-preview">
              <p>Image Preview:</p>
              <img src={preview} alt="Image preview" />
            </div>
          )}
        </div>
        <button type="submit" className="submit-btn">Upload</button>
      </form>
    </div>
  );
};

export default UploadForm;
