import React from 'react';
import ProductItem from '../component/ProductItem';
import '../style/ProductItem.css';
import RelatedProduct from '../component/RelatedProduct'; // Ensure this is a React component
import '../style/RelatedProduct.css'; // Import your CSS file for styling

const ItemPage: React.FC = () => {
  return (
    <div>
      <ProductItem />
      <RelatedProduct excludeName="exampleName" />
    </div>
  );
};

export default ItemPage;