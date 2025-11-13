import React from "react";
import "../style/Address.css";
interface AddressForm {
  title: string;
}

const AddressForm: React.FC<AddressForm> = ({ title }) => {
  return (
    <div className="address-form">
      <h2>{title}</h2>
      <form>
        <div className="form-group">
          <label>Street</label>
          <input type="text" required />
        </div>

        <div className="form-group">
          <label>City</label>
          <input type="text" required />
        </div>

        <div className="form-group">
          <label>Region</label>
          <input type="text" required/>
        </div>

        <div className="form-group">
          <label>District</label>
          <input type="text" required/>
        </div>

        <div className="form-group">
          <label>Country</label>
          <input type="text" required/>
        </div>

        {/*<div className="form-group">*/}
        {/*  <label>State (optional)</label>*/}
        {/*  <select>*/}
        {/*    <option>Select an option...</option>*/}
        {/*  </select>*/}
        {/*</div>*/}

        {/*<div className="form-group">*/}
        {/*  <label>City *</label>*/}
        {/*  <select required>*/}
        {/*    <option>Select an option...</option>*/}
        {/*  </select>*/}
        {/*</div>*/}

        {/*<div className="form-group">*/}
        {/*  <label>Postcode / ZIP (optional)</label>*/}
        {/*  <input type="text" />*/}
        {/*</div>*/}

        {/*<div className="form-group">*/}
        {/*  <label>Phone *</label>*/}
        {/*  <input type="tel" required />*/}
        {/*</div>*/}

        {/*<div className="form-group">*/}
        {/*  <label>Email address *</label>*/}
        {/*  <input type="email" required />*/}
        {/*</div>*/}

        <button type="submit" className="save-button">SAVE ADDRESS</button>
      </form>
    </div>
  );
};

export default AddressForm;