export const FRUITS = [
  { name: "Apple", price: 3 },
  { name: "Banana", price: 2 },
  { name: "Lemon", price: 1 },
  { name: "Grapes", price: 5 },
];

export const VEGETABLES = [
  { name: "Carrot", price: 2 },
  { name: "Potato", price: 1 },
  { name: "Cucumber", price: 1 },
  { name: "Broccoli", price: 3 },
];

export const SWEETS = [
  { name: "Chocolate", price: 5 },
  { name: "Candy", price: 2 },
  { name: "Lollipop", price: 2 },
  { name: "Cupcake", price: 3 },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  type: string;
};

export const PRODUCTS = [
  ...FRUITS.map((product, index) => ({
    ...product,
    id: `fruit-${index}`,
    type: "fruit",
  })),
  ...VEGETABLES.map((product, index) => ({
    ...product,
    id: `vegetable-${index}`,
    type: "vegetable",
  })),
  ...SWEETS.map((product, index) => ({
    ...product,
    id: `sweet-${index}`,
    type: "sweet",
  })),
] satisfies Product[];

export function getProduct(id: string) {
  const product = PRODUCTS.find(product => product.id === id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export function getRandomProduct() {
  return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
}
