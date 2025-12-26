export interface Product {
  Id: number;
  Name: string;
  Img: string;
  Price: number;
  Category?: string;
}

export async function fetchRelatedProducts(
  excludeName: string,
  category?: string,
  page: number = 1,
  limit: number = 4
): Promise<{ products: Product[]; total: number }> {
  const params = new URLSearchParams({
    excludeName,
    page: page.toString(),
    limit: limit.toString(),
  });

  if (category) {
    params.append("category", category);
  }

  const res = await fetch(
    `http://localhost:3000/api/products/related?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch related products");
  }

  return res.json();
}
