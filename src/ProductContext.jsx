import React, { createContext, useState, useContext } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    { id: 1, name: "iPhone 15 Pro Max", price: "12500", category: "Phones", image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=500" },
    { id: 2, name: "Samsung S24 Ultra", price: "11000", category: "Phones", image: "https://images.unsplash.com/photo-1707230560200-50d4d2906a2b?q=80&w=500" }
  ]);

  const addProduct = (product) => setProducts([...products, { ...product, id: Date.now() }]);
  const deleteProduct = (id) => setProducts(products.filter(p => p.id !== id));

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
