import React, { useState } from "react";
import "../style/Address.css";

interface AddressFormProps {
  title: string;
}

interface AddressData {
  streetName: string;
  ward: string;
  city: string;
  country: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ title }) => {
  const [address, setAddress] = useState<AddressData>({
    streetName: "",
    ward: "",
    city: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Add logic to save the address data, e.g., send to an API
    console.log("Saving address:", address);
    alert("Address saved! Check the console for the data.");
  };

  return (
    <div className="address-form">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Street Name</label>
          <input
            type="text"
            name="streetName"
            value={address.streetName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ward</label>
          <input
            type="text"
            name="ward"
            value={address.ward}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={address.country}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="save-button">
          SAVE ADDRESS
        </button>
      </form>
    </div>
  );
};

export default AddressForm;
