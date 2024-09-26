import { computed, Injectable, signal } from "@angular/core";

import { getProduct, Product } from "./products";

export type CartItem = {
  id: string;
  pid: Product["id"];
  quantity: number;
};

@Injectable({ providedIn: "root" })
export class CartService {
  items = signal<CartItem[]>([]);
  total = computed(() => {
    const items = this.items();
    return items.reduce(
      (acc, item) => acc + item.quantity * getProduct(item.pid).price,
      0,
    );
  });

  addItem(item: CartItem) {
    this.items.update(items => [...items, item]);
  }

  removeItem(id: string) {
    this.items.update(items => items.filter(item => item.id !== id));
  }

  clear() {
    this.items.set([]);
  }
}
