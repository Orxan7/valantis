async function getProductIds(params) {
    const response = await fetch('https://example.com/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: "get_ids",
        params: params
      }),
    });
  
    if (!response.ok) {
      throw new Error('Ошибка при получении ID товаров');
    }
  
    const data = await response.json();
    return data.result; 
  }
  
  async function getProductsByIds(ids) {
    const response = await fetch('https://example.com/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: "get_items",
        params: { ids }
      }),
    });
  
    if (!response.ok) {
      throw new Error('Ошибка при получении информации о товарах');
    }
  
    const data = await response.json();
    return data.result; 
  }
  
  export { getProductIds, getProductsByIds };
  