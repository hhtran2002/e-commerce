import React, { useEffect, useState } from "react";

type Address = {
  id: number;
  street_name: string;
  city: string;
  region: string;
  district: string;
  country: string;
};

const AddressList: React.FC<{ userId: number }> = ({ userId }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/addresses/${userId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
      });

      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const handleDelete = async (addressId: number) => {
    try {
      console.log("handleDelete", userId, addressId);
      const res = await fetch(`http://localhost:3001/api/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
        // body: JSON.stringify({ address_id: userId }), // nếu API không cần thì bỏ luôn
      });

      if (!res.ok) {
        console.error("Response status:", res.status);
        throw new Error("Failed to delete address");
      }

      await fetchAddresses(); // refresh list
    } catch (err) {
      console.error("handleDelete error:", err);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
  };

  const handleUpdate = async () => {
    if (!editingAddress) return;

    try {
      await fetch(`http://localhost:3001/api/addresses/${editingAddress.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(editingAddress),
      });

      setEditingAddress(null);
      fetchAddresses();
    } catch (err) {
      console.error("Error updating address:", err);
    }
  };

  // 🔹 Định nghĩa field với label + key đúng kiểu keyof Address
  const fields: { label: string; key: keyof Address }[] = [
    { label: "Street", key: "street_name" },
    { label: "City", key: "city" },
    { label: "Region", key: "region" },
    { label: "District", key: "district" },
    { label: "Country", key: "country" },
  ];

  return (
    <div>
      <table>
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Street</th>
            <th>City</th>
            <th>Region</th>
            <th>District</th>
            <th>Country</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address) => (
            <tr key={address.id}>
              {/* <td>{address.id}</td> */}
              <td>{address.street_name}</td>
              <td>{address.city}</td>
              <td>{address.region}</td>
              <td>{address.district}</td>
              <td>{address.country}</td>
              <td>
                <button onClick={() => handleEdit(address)}>Edit</button>{" "}
                <button onClick={() => handleDelete(address.id)}>Delete</button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingAddress && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h4>Edit Address #{editingAddress.id}</h4>

          {fields.map(({ label, key }) => (
            <div key={key}>
              <label>
                {label}:{" "}
                <input
                  type="text"
                  value={editingAddress[key] ?? ""}
                  onChange={(e) =>
                    setEditingAddress({
                      ...editingAddress,
                      [key]: e.target.value,
                    } as Address)
                  }
                />
              </label>
            </div>
          ))}

          <button onClick={handleUpdate}>Save</button>{" "}
          <button onClick={() => setEditingAddress(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AddressList;