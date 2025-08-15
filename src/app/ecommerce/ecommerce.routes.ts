import { Routes } from '@angular/router';

export const ecommerceRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ecommerce-layout/ecommerce-layout.component').then(m => m.EcommerceLayoutComponent),
    children: [
      {
        path: 'products',
        loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'product-detail/:id',
        loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent)
      },
      {
        path: 'checkout',
        loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent)
      },
      {
        path: 'order-success',
        loadComponent: () => import('./order-success/order-success.component').then(m => m.OrderSuccessComponent)
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./wishlist/wishlist.component').then(m => m.WishlistComponent)
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      }
    ]
  }
];