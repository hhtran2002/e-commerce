import React, { useState } from "react";
import AddressForm from "./AddressForm";
import "../style/Address.css";
import AddressList from "./AddressList";

const Address: React.FC = () => {
  const [showBillingForm, setShowBillingForm] = useState(false);
  // const [showShippingForm, setShowShippingForm] = useState(false);
  // Sửa lại để dùng localStorage và lấy _id cho đúng
  const storedUser = localStorage.getItem("userInfo");
  const user =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  const userId = user?._id;
  return (
    <div className="address-page">
      <p className="address-info">
        <h2>ADDRESS</h2>
        The following addresses will be used on the checkout page by default.
      </p>
      <AddressList userId={userId} />
      <div className="address-container">
        {/* Billing Address */}
        <div className="address-section">
          {showBillingForm ? (
            <AddressForm title="Billing Address" />
          ) : (
            <>
              <p
                className="add-address"
                onClick={() => setShowBillingForm(true)}
              >
                Add Billing address
              </p>
              {/*<p className="no-address"><em>You have not set up this type of address yet.</em></p>*/}
            </>
          )}
        </div>

        {/* Shipping Address */}
        {/*<div className="address-section">*/}
        {/*  <h2>SHIPPING ADDRESS</h2>*/}
        {/*  {showShippingForm ? (*/}
        {/*    <AddressForm title="Shipping Address" />*/}
        {/*  ) : (*/}
        {/*    <>*/}
        {/*      <p className="add-address" onClick={() => setShowShippingForm(true)}>*/}
        {/*        Add Shipping address*/}
        {/*      </p>*/}
        {/*      <p className="no-address"><em>You have not set up this type of address yet.</em></p>*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default Address;
