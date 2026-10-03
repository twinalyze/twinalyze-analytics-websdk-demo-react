import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { categories, products } from '../data/products.js';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const query = searchParams.get('q') || '';

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = `${product.name} ${product.category} ${product.shortDescription}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory = category === 'All' || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const handleSearch = (event) => {
    const value = event.target.value;
    const next = new URLSearchParams(searchParams);
    value ? next.set('q', value) : next.delete('q');
    setSearchParams(next);
  };

  const handleCategory = (nextCategory) => {
    setCategory(nextCategory);
    const next = new URLSearchParams(searchParams);
    nextCategory === 'All'
      ? next.delete('category')
      : next.set('category', nextCategory);
    setSearchParams(next);
  };

  return (
    <section className="section-wrap page-section">
      <div className="page-heading">
        <span className="eyebrow">SHOP THE COLLECTION</span>
        <h1>Products</h1>
        <p>Use search and category filters to generate meaningful URL changes.</p>
      </div>

      <div className="catalog-toolbar">
        <label className="search-field">
          <span>Search</span>
          <input
            name="productSearch"
            value={query}
            onChange={handleSearch}
            placeholder="Search products..."
          />
        </label>
        <div className="category-tabs">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? 'active' : ''}
              onClick={() => handleCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="result-summary">
        <strong>{filteredProducts.length}</strong> products found
        {query && <span> for “{query}”</span>}
      </div>

      {filteredProducts.length ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>🔍</span>
          <h2>No products found</h2>
          <p>Try another search term or category.</p>
        </div>
      )}
    </section>
  );
}
