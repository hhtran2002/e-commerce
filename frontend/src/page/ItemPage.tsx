import React from 'react';
import ProductItem from '../component/ProductItem';
import '../style/ProductItem.css';
import RelatedProduct from '../component/RelatedProduct'; 
import '../style/RelatedProduct.css'; 

const ItemPage: React.FC = () => {
  return (
    <div>
      <ProductItem />
      <RelatedProduct excludeName="exampleName" />
    </div>
  );
};

export default ItemPage;