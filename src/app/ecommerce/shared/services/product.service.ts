import { Injectable, signal, computed } from '@angular/core';
import { Product, Review } from '../interfaces/ecommerce.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products = signal<Product[]>([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Premium sound quality with deep bass and crystal clear highs. Perfect for music lovers and professionals.',
      price: 299,
      originalPrice: 399,
      rating: 4.5,
      reviewCount: 128,
      category: 'Electronics',
      brand: 'AudioTech',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      isNew: true,
      isSale: true,
      colors: ['black', 'white', 'blue'],
      sizes: [],
      tags: ['wireless', 'noise-cancelling', 'premium'],
      specifications: {
        'Driver Size': '40mm',
        'Frequency Response': '20Hz - 20kHz',
        'Battery Life': '30 hours',
        'Charging Time': '2 hours',
        'Connectivity': 'Bluetooth 5.0',
        'Weight': '250g'
      },
      features: [
        'Active Noise Cancellation',
        '30-hour battery life',
        'Premium drivers for exceptional sound',
        'Comfortable over-ear design',
        'Fast charging technology',
        'Voice assistant compatible'
      ]
    },
    {
      id: '2',
      name: 'Organic Cotton T-Shirt',
      description: 'Comfortable and sustainable organic cotton t-shirt in various colors. Perfect for everyday wear with a soft feel and durable construction.',
      price: 29,
      rating: 4.2,
      reviewCount: 89,
      category: 'Clothing',
      brand: 'EcoWear',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      colors: ['black', 'white', 'gray', 'navy'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      tags: ['organic', 'sustainable', 'cotton'],
      specifications: {
        'Material': '100% Organic Cotton',
        'Fit': 'Regular',
        'Care': 'Machine wash cold',
        'Origin': 'Made in USA'
      },
      features: [
        'GOTS certified organic cotton',
        'Soft and comfortable fit',
        'Pre-shrunk fabric',
        'Durable construction'
      ]
    },
    {
      id: '3',
      name: 'Smart Fitness Watch',
      description: 'Advanced fitness tracking with heart rate monitor and GPS. Track your workouts, monitor your health, and stay connected.',
      price: 199,
      rating: 4.7,
      reviewCount: 256,
      category: 'Electronics',
      brand: 'FitTrack',
      images: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: false,
      colors: ['black', 'silver', 'rose-gold'],
      sizes: [],
      tags: ['fitness', 'smartwatch', 'gps'],
      specifications: {
        'Display': '1.4" AMOLED',
        'Battery Life': '7 days',
        'Water Resistance': '5ATM',
        'GPS': 'Built-in',
        'Connectivity': 'Bluetooth 5.0'
      },
      features: [
        'Heart rate monitoring',
        'Built-in GPS',
        'Sleep tracking',
        'Workout modes',
        'Smart notifications'
      ]
    },
    {
      id: '4',
      name: 'Minimalist Desk Lamp',
      description: 'Modern LED desk lamp with adjustable brightness and color temperature. Perfect for any workspace with sleek design.',
      price: 79,
      rating: 4.4,
      reviewCount: 64,
      category: 'Home & Garden',
      brand: 'LightCraft',
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      colors: ['white', 'black'],
      sizes: [],
      tags: ['led', 'adjustable', 'modern'],
      specifications: {
        'Power': '12W LED',
        'Color Temperature': '3000K-6500K',
        'Brightness': '1000 lumens',
        'Adjustable': 'Yes',
        'USB Charging': 'Yes'
      },
      features: [
        'Adjustable brightness',
        'Color temperature control',
        'Touch controls',
        'USB charging port',
        'Memory function'
      ]
    },
    {
      id: '6',
      name: 'Leather Messenger Bag',
      description: 'Handcrafted genuine leather messenger bag perfect for work or travel. Spacious compartments and durable construction.',
      price: 189,
      originalPrice: 249,
      rating: 4.6,
      reviewCount: 73,
      category: 'Accessories',
      brand: 'LeatherCraft',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      isSale: true,
      colors: ['brown', 'black', 'tan'],
      sizes: [],
      tags: ['leather', 'handcrafted', 'professional'],
      specifications: {
        'Material': 'Full-grain leather',
        'Dimensions': '16" x 12" x 4"',
        'Weight': '2.5 lbs',
        'Compartments': 'Multiple',
        'Laptop Fit': 'Up to 15"'
      },
      features: [
        'Full-grain leather construction',
        'Multiple compartments',
        'Laptop compartment',
        'Adjustable strap',
        'Handcrafted quality'
      ]
    },
    {
      id: '7',
      name: 'Wireless Charging Pad',
      description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
      price: 39,
      rating: 4.3,
      reviewCount: 156,
      category: 'Electronics',
      brand: 'ChargeTech',
      images: [
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      colors: ['black', 'white'],
      sizes: [],
      tags: ['wireless', 'charging', 'qi-enabled'],
      specifications: {
        'Power Output': '10W',
        'Compatibility': 'Qi-enabled devices',
        'Input': 'USB-C',
        'Dimensions': '4" x 4" x 0.4"',
        'LED Indicator': 'Yes'
      },
      features: [
        'Fast wireless charging',
        'Qi-compatible',
        'LED charging indicator',
        'Compact design',
        'Non-slip surface'
      ]
    },
    {
      id: '8',
      name: 'Running Sneakers',
      description: 'High-performance running sneakers with advanced cushioning and breathable mesh upper for maximum comfort.',
      price: 129,
      rating: 4.4,
      reviewCount: 201,
      category: 'Clothing',
      brand: 'SportMax',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      colors: ['black', 'white', 'blue', 'red'],
      sizes: ['7', '8', '9', '10', '11', '12'],
      tags: ['running', 'sports', 'comfortable'],
      specifications: {
        'Upper': 'Breathable mesh',
        'Sole': 'Rubber outsole',
        'Cushioning': 'Air cushioning',
        'Weight': '10 oz',
        'Drop': '10mm'
      },
      features: [
        'Advanced cushioning',
        'Breathable mesh upper',
        'Lightweight design',
        'Durable rubber sole',
        'Comfortable fit'
      ]
    },
    {
      id: '9',
      name: 'Indoor Plant Pot',
      description: 'Modern ceramic plant pot with drainage system. Perfect for succulents and small indoor plants.',
      price: 35,
      rating: 4.7,
      reviewCount: 88,
      category: 'Home & Garden',
      brand: 'GreenSpace',
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      colors: ['white', 'terracotta', 'black'],
      sizes: ['small', 'medium', 'large'],
      tags: ['ceramic', 'drainage', 'modern'],
      specifications: {
        'Material': 'Ceramic',
        'Drainage': 'Built-in system',
        'Sizes': 'Small, Medium, Large',
        'Finish': 'Matte',
        'Care': 'Easy to clean'
      },
      features: [
        'Drainage system',
        'Modern design',
        'Multiple sizes',
        'Easy maintenance',
        'Durable ceramic'
      ]
    },
    {
      id: '10',
      name: 'Bluetooth Speaker',
      description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design. Perfect for outdoor adventures.',
      price: 89,
      originalPrice: 119,
      rating: 4.3,
      reviewCount: 167,
      category: 'Electronics',
      brand: 'SoundWave',
      images: [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      isSale: true,
      colors: ['black', 'blue', 'red'],
      sizes: [],
      tags: ['bluetooth', 'waterproof', 'portable'],
      specifications: {
        'Power': '20W',
        'Battery Life': '12 hours',
        'Bluetooth': '5.0',
        'Water Rating': 'IPX7',
        'Range': '30 feet'
      },
      features: [
        '360-degree sound',
        'Waterproof design',
        '12-hour battery',
        'Bluetooth 5.0',
        'Portable design'
      ]
    },
    {
      id: '11',
      name: 'Wool Winter Scarf',
      description: 'Soft merino wool scarf perfect for cold weather. Lightweight yet warm with elegant design.',
      price: 65,
      rating: 4.6,
      reviewCount: 54,
      category: 'Clothing',
      brand: 'WoolCraft',
      images: [
        'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      colors: ['gray', 'navy', 'burgundy', 'cream'],
      sizes: [],
      tags: ['wool', 'winter', 'elegant'],
      specifications: {
        'Material': '100% Merino wool',
        'Dimensions': '70" x 12"',
        'Weight': 'Lightweight',
        'Care': 'Hand wash',
        'Origin': 'Made in Scotland'
      },
      features: [
        'Soft merino wool',
        'Lightweight and warm',
        'Elegant design',
        'Multiple colors',
        'Premium quality'
      ]
    },
    {
      id: '12',
      name: 'Gaming Mechanical Keyboard',
      description: 'Professional gaming keyboard with RGB backlighting and customizable mechanical switches. Perfect for gaming and productivity.',
      price: 159,
      originalPrice: 199,
      rating: 4.7,
      reviewCount: 312,
      category: 'Electronics',
      brand: 'GameTech',
      images: [
        'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      isSale: true,
      colors: ['black', 'white'],
      sizes: [],
      tags: ['gaming', 'mechanical', 'rgb'],
      specifications: {
        'Switch Type': 'Cherry MX Blue',
        'Backlighting': 'RGB',
        'Layout': 'Full Size (104 keys)',
        'Connection': 'USB-C',
        'Cable Length': '6 feet',
        'Compatibility': 'Windows, Mac, Linux'
      },
      features: [
        'Mechanical Cherry MX switches',
        'RGB backlighting with 16.8M colors',
        'Programmable keys',
        'Anti-ghosting technology',
        'Detachable USB-C cable',
        'Gaming mode switch'
      ]
    },
    {
      id: '13',
      name: 'Yoga Mat Premium',
      description: 'Extra thick yoga mat with superior grip and comfort. Made from eco-friendly materials for your daily practice.',
      price: 49,
      rating: 4.5,
      reviewCount: 198,
      category: 'Sports & Fitness',
      brand: 'ZenFlow',
      images: [
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      isNew: true,
      colors: ['purple', 'blue', 'green', 'pink'],
      sizes: ['standard', 'extra-long'],
      tags: ['yoga', 'fitness', 'eco-friendly'],
      specifications: {
        'Thickness': '6mm',
        'Dimensions': '72" x 24"',
        'Material': 'TPE (Eco-friendly)',
        'Weight': '2.2 lbs',
        'Texture': 'Non-slip both sides'
      },
      features: [
        'Extra thick 6mm cushioning',
        'Superior grip texture',
        'Eco-friendly TPE material',
        'Lightweight and portable',
        'Easy to clean',
        'Alignment guides'
      ]
    },
    {
      id: '14',
      name: 'Coffee Maker Deluxe',
      description: 'Premium drip coffee maker with programmable features and thermal carafe. Brew perfect coffee every time.',
      price: 129,
      originalPrice: 169,
      rating: 4.4,
      reviewCount: 87,
      category: 'Kitchen',
      brand: 'BrewMaster',
      images: [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      isSale: true,
      colors: ['black', 'stainless'],
      sizes: [],
      tags: ['coffee', 'programmable', 'thermal'],
      specifications: {
        'Capacity': '12 cups',
        'Carafe': 'Thermal stainless steel',
        'Auto-brew': 'Programmable 24h',
        'Water Window': 'Large view',
        'Dimensions': '14" x 10" x 12"'
      },
      features: [
        'Programmable 24-hour brew',
        'Thermal carafe keeps coffee hot',
        'Pause and serve feature',
        'Auto shut-off',
        'Large water reservoir',
        'Dishwasher safe parts'
      ]
    },
    {
      id: '15',
      name: 'Backpack Travel Pro',
      description: 'Durable travel backpack with laptop compartment and multiple organization pockets. Perfect for business and adventure.',
      price: 89,
      rating: 4.6,
      reviewCount: 156,
      category: 'Accessories',
      brand: 'TravelGear',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      colors: ['black', 'gray', 'navy'],
      sizes: [],
      tags: ['travel', 'laptop', 'durable'],
      specifications: {
        'Capacity': '35L',
        'Laptop Fit': 'Up to 17"',
        'Material': 'Water-resistant nylon',
        'Dimensions': '19" x 12" x 8"',
        'Weight': '2.8 lbs'
      },
      features: [
        'TSA-friendly laptop compartment',
        'Water-resistant material',
        'Multiple organization pockets',
        'Padded shoulder straps',
        'Trolley handle pass-through',
        'Hidden back pocket'
      ]
    },
    {
      id: '16',
      name: 'Skincare Set Luxury',
      description: 'Complete skincare routine with premium ingredients. Includes cleanser, toner, serum, and moisturizer.',
      price: 199,
      originalPrice: 259,
      rating: 4.8,
      reviewCount: 234,
      category: 'Beauty & Personal Care',
      brand: 'GlowLab',
      images: [
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      isSale: true,
      isNew: true,
      colors: [],
      sizes: [],
      tags: ['skincare', 'luxury', 'anti-aging'],
      specifications: {
        'Set Includes': '4 products',
        'Skin Type': 'All skin types',
        'Key Ingredients': 'Hyaluronic Acid, Vitamin C',
        'Packaging': 'Airless pumps',
        'Shelf Life': '24 months'
      },
      features: [
        'Complete 4-step routine',
        'Premium botanical ingredients',
        'Anti-aging formula',
        'Suitable for all skin types',
        'Dermatologist tested',
        'Cruelty-free'
      ]
    },
    {
      id: '17',
      name: 'Desk Organizer Bamboo',
      description: 'Sustainable bamboo desk organizer with multiple compartments. Keep your workspace clean and organized.',
      price: 39,
      rating: 4.3,
      reviewCount: 98,
      category: 'Home & Office',
      brand: 'EcoDesk',
      images: [
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: false,
      colors: ['natural'],
      sizes: ['small', 'large'],
      tags: ['bamboo', 'sustainable', 'organization'],
      specifications: {
        'Material': '100% Bamboo',
        'Dimensions': '12" x 8" x 4"',
        'Compartments': '6 sections',
        'Finish': 'Natural oil',
        'Assembly': 'No assembly required'
      },
      features: [
        'Sustainable bamboo construction',
        'Multiple compartments',
        'Smooth natural finish',
        'Perfect desktop size',
        'Easy to clean',
        'Environmentally friendly'
      ]
    },
    {
      id: '18',
      name: 'Wireless Mouse Ergonomic',
      description: 'Ergonomic wireless mouse designed for comfort during long work sessions. Advanced optical sensor for precision.',
      price: 45,
      rating: 4.4,
      reviewCount: 176,
      category: 'Electronics',
      brand: 'ErgoTech',
      images: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      colors: ['black', 'white', 'gray'],
      sizes: [],
      tags: ['wireless', 'ergonomic', 'precision'],
      specifications: {
        'Connection': 'Wireless 2.4GHz',
        'DPI': 'Up to 1600',
        'Battery': 'AA (included)',
        'Range': '10 meters',
        'Compatibility': 'Windows, Mac, Linux'
      },
      features: [
        'Ergonomic design reduces strain',
        'High-precision optical sensor',
        'Long battery life',
        'Plug-and-play setup',
        'Smooth scroll wheel',
        'Silent clicking'
      ]
    },
    {
      id: '20',
      name: 'Water Bottle Insulated',
      description: 'Double-wall vacuum insulated water bottle keeps drinks cold for 24h or hot for 12h. Perfect for active lifestyles.',
      price: 35,
      rating: 4.5,
      reviewCount: 289,
      category: 'Sports & Fitness',
      brand: 'HydroFlow',
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop&crop=center'
      ],
      inStock: true,
      colors: ['black', 'white', 'blue', 'pink', 'green'],
      sizes: ['16oz', '20oz', '32oz'],
      tags: ['insulated', 'stainless-steel', 'leak-proof'],
      specifications: {
        'Material': 'Stainless steel 18/8',
        'Insulation': 'Double-wall vacuum',
        'Cold Retention': '24 hours',
        'Hot Retention': '12 hours',
        'Mouth Opening': 'Wide mouth'
      },
      features: [
        'Superior temperature retention',
        'Leak-proof design',
        'BPA-free materials',
        'Wide mouth for easy filling',
        'Sweat-proof exterior',
        'Dishwasher safe'
      ]
    }
  ]);

  private reviews = signal<Review[]>([
    {
      id: '1',
      userName: 'John Smith',
      rating: 5,
      comment: 'Excellent product! Exceeded my expectations. The quality is outstanding and delivery was super fast.',
      date: new Date('2024-01-10'),
      verified: true
    },
    {
      id: '2',
      userName: 'Sarah Johnson',
      rating: 4,
      comment: 'Very good product, would definitely recommend. Only minor issue was the packaging could be better.',
      date: new Date('2024-01-08'),
      verified: true
    },
    {
      id: '3',
      userName: 'Mike Wilson',
      rating: 5,
      comment: 'Perfect! Exactly what I was looking for. Great value for money.',
      date: new Date('2024-01-05'),
      verified: false
    }
  ]);

  allProducts = this.products.asReadonly();

  categories = computed(() =>
    [...new Set(this.products().map(p => p.category))]
  );

  brands = computed(() =>
    [...new Set(this.products().map(p => p.brand))]
  );

  getProduct(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this.products().filter(p => p.category === category);
  }

  getProductsByBrand(brand: string): Product[] {
    return this.products().filter(p => p.brand === brand);
  }

  searchProducts(query: string): Product[] {
    const searchTerm = query.toLowerCase();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  getProductReviews(productId: string): Review[] {
    return this.reviews();
  }

  getFeaturedProducts(): Product[] {
    return this.products().filter(p => p.isNew || p.isSale).slice(0, 6);
  }

  getRelatedProducts(productId: string, limit: number = 4): Product[] {
    const product = this.getProduct(productId);
    if (!product) return [];

    return this.products()
      .filter(p => p.id !== productId && p.category === product.category)
      .slice(0, limit);
  }
}
