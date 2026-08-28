export type ProductStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'sold-out' | 'draft' | 'published';
export type Category = 'sanitary' | 'hardware' | 'surgical' | 'household';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash-on-delivery' | 'credit-card' | 'bank-transfer' | 'digital-wallet';

export interface Product {
  id: string;
  name: string;
  category: Category;
  subcategory: string;
  brand: string;
  price: number;
  salePrice: number;
  discount: number;
  rating: number;
  reviews: number;
  stock: number;
  status: ProductStatus;
  image: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  sku: string;
  featured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  tags: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  address: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
  };
  placedAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
  status: 'active' | 'inactive';
  avatar: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  status: 'active' | 'inactive' | 'expired';
  categories: string[];
}

const UNSPLASH = (id: string, w = 600, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export const products: Product[] = [
  // SANITARY
  {
    id: 'san-001',
    name: 'Premium Chrome Wall-Mount Faucet',
    category: 'sanitary',
    subcategory: 'Faucets & Taps',
    brand: 'AquaLux',
    price: 12500,
    salePrice: 9800,
    discount: 22,
    rating: 4.8,
    reviews: 142,
    stock: 45,
    status: 'in-stock',
    image: UNSPLASH('1602761004880-0cbb1ba589d2'),
    images: [
      UNSPLASH('1602761004880-0cbb1ba589d2'),
      UNSPLASH('1623111771733-d3ab4d26ce41'),
      UNSPLASH('1644916925497-109cbd92087d'),
    ],
    description: 'Premium chrome wall-mount faucet with ceramic valve for smooth operation. Corrosion-resistant finish, easy installation, and compatible with standard plumbing systems.',
    specs: { Material: 'Brass + Chrome Plating', 'Flow Rate': '8 L/min', 'Connection Size': '1/2 inch', Warranty: '5 Years', Height: '22 cm' },
    sku: 'AQL-FAU-001',
    featured: true,
    isNew: false,
    isBestSeller: true,
    tags: ['faucet', 'chrome', 'bathroom', 'wall-mount'],
  },
  {
    id: 'san-002',
    name: 'Luxury Rain Shower Set Complete',
    category: 'sanitary',
    subcategory: 'Shower Sets',
    brand: 'ShowerPro',
    price: 38000,
    salePrice: 28500,
    discount: 25,
    rating: 4.9,
    reviews: 87,
    stock: 18,
    status: 'low-stock',
    image: UNSPLASH('1576678433413-202829a1ab98'),
    images: [UNSPLASH('1576678433413-202829a1ab98'), UNSPLASH('1571781418606-70265b9cce90')],
    description: 'Complete luxury rain shower system with overhead panel, hand shower, and body jets. Thermostatic control for perfect temperature.',
    specs: { Head: '30cm Rain Head', Pressure: 'High Pressure', Material: 'Stainless Steel', Finish: 'Brushed Nickel', Warranty: '10 Years' },
    sku: 'SPR-SHW-002',
    featured: true,
    isNew: true,
    isBestSeller: false,
    tags: ['shower', 'rain shower', 'luxury', 'bathroom'],
  },
  {
    id: 'san-003',
    name: 'Modern Pedestal Wash Basin',
    category: 'sanitary',
    subcategory: 'Wash Basins',
    brand: 'CeraStyle',
    price: 18000,
    salePrice: 14500,
    discount: 19,
    rating: 4.6,
    reviews: 203,
    stock: 32,
    status: 'in-stock',
    image: UNSPLASH('1644916925497-109cbd92087d'),
    images: [UNSPLASH('1644916925497-109cbd92087d'), UNSPLASH('1602761004880-0cbb1ba589d2')],
    description: 'Elegant white ceramic pedestal wash basin with smooth glaze finish. Easy to clean and resistant to stains.',
    specs: { Material: 'Vitreous China', Width: '50 cm', Depth: '38 cm', Color: 'Arctic White', Drain: 'Included' },
    sku: 'CER-BAS-003',
    featured: false,
    isNew: false,
    isBestSeller: true,
    tags: ['basin', 'wash basin', 'bathroom', 'ceramic'],
  },
  {
    id: 'san-004',
    name: 'Gold Bathroom Accessories Set 6-Piece',
    category: 'sanitary',
    subcategory: 'Accessories',
    brand: 'AquaLux',
    price: 8500,
    salePrice: 6200,
    discount: 27,
    rating: 4.5,
    reviews: 76,
    stock: 0,
    status: 'sold-out',
    image: UNSPLASH('1623111771733-d3ab4d26ce41'),
    images: [UNSPLASH('1623111771733-d3ab4d26ce41')],
    description: 'Premium 6-piece bathroom accessories set in brushed gold finish. Includes towel ring, toilet roll holder, soap dish, soap dispenser, and more.',
    specs: { Pieces: '6', Material: 'Zinc Alloy', Finish: 'Brushed Gold', 'Wall Mounting': 'Yes', Warranty: '3 Years' },
    sku: 'AQL-ACC-004',
    featured: false,
    isNew: false,
    isBestSeller: false,
    tags: ['accessories', 'gold', 'bathroom', 'set'],
  },
  {
    id: 'san-005',
    name: 'Concealed Flush Tank with Actuator',
    category: 'sanitary',
    subcategory: 'Flush Systems',
    brand: 'FlushMaster',
    price: 22000,
    salePrice: 17800,
    discount: 19,
    rating: 4.7,
    reviews: 54,
    stock: 28,
    status: 'in-stock',
    image: UNSPLASH('1571781418606-70265b9cce90'),
    images: [UNSPLASH('1571781418606-70265b9cce90')],
    description: 'In-wall concealed cistern with dual-flush actuator plate. Water-saving design with 3L/6L flush options. Easy maintenance access.',
    specs: { Capacity: '9L', 'Flush Options': 'Dual 3L/6L', 'Wall Depth': '10 cm', Material: 'High-grade Plastic', Warranty: '7 Years' },
    sku: 'FLM-CST-005',
    featured: true,
    isNew: true,
    isBestSeller: false,
    tags: ['flush', 'toilet', 'concealed', 'cistern'],
  },

  // HARDWARE
  {
    id: 'hw-001',
    name: 'Dewalt 18V Cordless Drill Driver Kit',
    category: 'hardware',
    subcategory: 'Power Tools',
    brand: 'DeWalt',
    price: 45000,
    salePrice: 36000,
    discount: 20,
    rating: 4.9,
    reviews: 318,
    stock: 22,
    status: 'in-stock',
    image: UNSPLASH('1572981779307-38b8cabb2407'),
    images: [UNSPLASH('1572981779307-38b8cabb2407'), UNSPLASH('1606676539940-12768ce0e762')],
    description: 'Professional 18V cordless drill driver with 2-speed gearbox, LED work light, and belt clip. Includes 2 Li-Ion batteries and charger.',
    specs: { Voltage: '18V', 'Chuck Size': '13mm', Torque: '65 Nm', Speed: '0-400/0-1500 RPM', Battery: '2×2Ah Li-Ion' },
    sku: 'DWT-DRL-001',
    featured: true,
    isNew: false,
    isBestSeller: true,
    tags: ['drill', 'power tool', 'dewalt', 'cordless'],
  },
  {
    id: 'hw-002',
    name: 'Professional Hand Tool Kit 108-Piece',
    category: 'hardware',
    subcategory: 'Hand Tools',
    brand: 'StanleyPro',
    price: 28000,
    salePrice: 19500,
    discount: 30,
    rating: 4.7,
    reviews: 245,
    stock: 35,
    status: 'in-stock',
    image: UNSPLASH('1606676539940-12768ce0e762'),
    images: [UNSPLASH('1606676539940-12768ce0e762'), UNSPLASH('1645651964715-d200ce0939cc')],
    description: 'Complete 108-piece professional hand tool kit with chrome vanadium tools. Includes hammers, screwdrivers, pliers, wrenches, and a carry case.',
    specs: { Pieces: '108', Material: 'Chrome Vanadium Steel', Case: 'Blow-molded Hard Case', 'Chrome Finish': 'Yes', Warranty: 'Lifetime' },
    sku: 'STN-KIT-002',
    featured: true,
    isNew: false,
    isBestSeller: true,
    tags: ['toolkit', 'hand tools', 'screwdriver', 'wrench'],
  },
  {
    id: 'hw-003',
    name: 'Heavy Duty Padlock Set 4-Pack',
    category: 'hardware',
    subcategory: 'Locks & Security',
    brand: 'SecureLock',
    price: 6500,
    salePrice: 4800,
    discount: 26,
    rating: 4.5,
    reviews: 89,
    stock: 60,
    status: 'in-stock',
    image: UNSPLASH('1645651964715-d200ce0939cc'),
    images: [UNSPLASH('1645651964715-d200ce0939cc')],
    description: '4-pack heavy duty padlocks with hardened steel shackle. Weather-resistant for indoor and outdoor use. Double-locking mechanism.',
    specs: { Shackle: 'Hardened Steel 6mm', 'Key Type': 'Double Bitted', 'Weather Resistance': 'Yes', Finish: 'Zinc Alloy', Keyed: 'Alike' },
    sku: 'SLK-PAD-003',
    featured: false,
    isNew: false,
    isBestSeller: false,
    tags: ['lock', 'padlock', 'security', 'hardware'],
  },
  {
    id: 'hw-004',
    name: 'Angle Grinder 850W Heavy Duty',
    category: 'hardware',
    subcategory: 'Power Tools',
    brand: 'Bosch',
    price: 18500,
    salePrice: 14900,
    discount: 19,
    rating: 4.8,
    reviews: 167,
    stock: 5,
    status: 'low-stock',
    image: UNSPLASH('1645651964715-d200ce0939cc'),
    images: [UNSPLASH('1645651964715-d200ce0939cc'), UNSPLASH('1572981779307-38b8cabb2407')],
    description: '850W angle grinder with single-handed guard adjustment and vibration-dampened two-component handle. Ideal for cutting, grinding, and polishing.',
    specs: { Power: '850W', Disc: '115/125mm', 'No-Load Speed': '11,000 RPM', Weight: '1.9 kg', Spindle: 'M14' },
    sku: 'BSH-GRD-004',
    featured: false,
    isNew: false,
    isBestSeller: false,
    tags: ['grinder', 'angle grinder', 'bosch', 'power tool'],
  },
  {
    id: 'hw-005',
    name: 'Stainless Steel Screw Assortment 500pcs',
    category: 'hardware',
    subcategory: 'Fasteners',
    brand: 'FastFix',
    price: 3200,
    salePrice: 2200,
    discount: 31,
    rating: 4.4,
    reviews: 412,
    stock: 0,
    status: 'out-of-stock',
    image: UNSPLASH('1606676539940-12768ce0e762'),
    images: [UNSPLASH('1606676539940-12768ce0e762')],
    description: '500-piece stainless steel screw assortment in a organized storage box. Includes wood screws, machine screws, bolts, and nuts in various sizes.',
    specs: { Pieces: '500', Material: 'Stainless Steel 304', Sizes: 'M3–M8', Box: 'Compartmentalized Organizer', 'Corrosion Resistance': 'Yes' },
    sku: 'FFX-SCW-005',
    featured: false,
    isNew: false,
    isBestSeller: false,
    tags: ['screws', 'fasteners', 'hardware', 'stainless steel'],
  },

  // SURGICAL & MEDICAL
  {
    id: 'med-001',
    name: 'Surgical Stainless Steel Instrument Set',
    category: 'surgical',
    subcategory: 'Surgical Instruments',
    brand: 'MediCraft',
    price: 15000,
    salePrice: 11500,
    discount: 23,
    rating: 4.9,
    reviews: 63,
    stock: 30,
    status: 'in-stock',
    image: UNSPLASH('1514416309827-bfb0cf433a2d'),
    images: [UNSPLASH('1514416309827-bfb0cf433a2d'), UNSPLASH('1551076805-e1869033e561')],
    description: 'Professional 10-piece surgical instrument set in German stainless steel. Autoclavable, precision-crafted for surgical accuracy. Includes scissors, forceps, and needle holders.',
    specs: { Pieces: '10', Material: 'German SS 304', Sterilization: 'Autoclave Safe', Finish: 'Matte/Satin', Case: 'Stainless Tray' },
    sku: 'MDC-INS-001',
    featured: true,
    isNew: false,
    isBestSeller: true,
    tags: ['surgical', 'instruments', 'scissors', 'forceps'],
  },
  {
    id: 'med-002',
    name: 'Nitrile Examination Gloves Box 100',
    category: 'surgical',
    subcategory: 'Protective Wear',
    brand: 'SafeGuard',
    price: 2800,
    salePrice: 1950,
    discount: 30,
    rating: 4.7,
    reviews: 892,
    stock: 500,
    status: 'in-stock',
    image: UNSPLASH('1640876777002-badf6aee5bcc'),
    images: [UNSPLASH('1640876777002-badf6aee5bcc')],
    description: 'Powder-free nitrile examination gloves with textured fingertips. Latex-free, ambidextrous design. Available in S/M/L/XL. Box of 100.',
    specs: { Quantity: '100/Box', Material: 'Nitrile', 'Powder Free': 'Yes', Thickness: '0.1mm', AQL: '1.5' },
    sku: 'SGD-GLV-002',
    featured: true,
    isNew: false,
    isBestSeller: true,
    tags: ['gloves', 'nitrile', 'medical', 'protective'],
  },
  {
    id: 'med-003',
    name: 'Digital Pulse Oximeter Fingertip',
    category: 'surgical',
    subcategory: 'Diagnostic Equipment',
    brand: 'HealthCheck',
    price: 4500,
    salePrice: 3200,
    discount: 29,
    rating: 4.6,
    reviews: 1204,
    stock: 80,
    status: 'in-stock',
    image: UNSPLASH('1551076805-e1869033e561'),
    images: [UNSPLASH('1551076805-e1869033e561')],
    description: 'Accurate fingertip pulse oximeter with OLED display showing SpO2, pulse rate, and perfusion index. Low-battery indicator and automatic shutoff.',
    specs: { 'SpO2 Range': '70–99%', Accuracy: '±2%', 'PR Range': '30–250 bpm', Display: 'OLED', Battery: '2×AAA' },
    sku: 'HCK-OXI-003',
    featured: false,
    isNew: true,
    isBestSeller: false,
    tags: ['oximeter', 'pulse', 'diagnostic', 'health'],
  },
  {
    id: 'med-004',
    name: 'N95 Respirator Masks Box 20',
    category: 'surgical',
    subcategory: 'Protective Wear',
    brand: '3M Medical',
    price: 3800,
    salePrice: 2900,
    discount: 24,
    rating: 4.8,
    reviews: 2341,
    stock: 0,
    status: 'sold-out',
    image: UNSPLASH('1551076805-e1869033e561'),
    images: [UNSPLASH('1551076805-e1869033e561')],
    description: 'NIOSH-approved N95 respirator masks with adjustable nose clip and comfortable foam lining. Filters at least 95% of airborne particles.',
    specs: { Standard: 'NIOSH N95', Quantity: '20/Box', 'Filtration Efficiency': '≥95%', 'Valve Type': 'Without Valve', Layers: '5' },
    sku: '3MM-MSK-004',
    featured: false,
    isNew: false,
    isBestSeller: false,
    tags: ['mask', 'N95', 'respirator', 'protective'],
  },
  {
    id: 'med-005',
    name: 'Digital BP Monitor Upper Arm',
    category: 'surgical',
    subcategory: 'Diagnostic Equipment',
    brand: 'Omron',
    price: 9800,
    salePrice: 7500,
    discount: 23,
    rating: 4.9,
    reviews: 678,
    stock: 42,
    status: 'in-stock',
    image: UNSPLASH('1551076805-e1869033e561'),
    images: [UNSPLASH('1551076805-e1869033e561')],
    description: 'Clinically validated digital blood pressure monitor with irregular heartbeat detection. Memory for 120 readings with date and time. Comes with carry case.',
    specs: { Range: '0–299 mmHg', Accuracy: '±3 mmHg', Memory: '120 Readings', Display: 'LCD', Cuff: '22–42 cm' },
    sku: 'OMR-BPM-005',
    featured: true,
    isNew: false,
    isBestSeller: true,
    tags: ['blood pressure', 'bp monitor', 'omron', 'health'],
  },

  // HOUSEHOLD
  {
    id: 'hh-001',
    name: 'Multi-Surface All-Purpose Cleaner 5L',
    category: 'household',
    subcategory: 'Cleaning Products',
    brand: 'CleanMaster',
    price: 1800,
    salePrice: 1200,
    discount: 33,
    rating: 4.6,
    reviews: 543,
    stock: 200,
    status: 'in-stock',
    image: UNSPLASH('1528740561666-dc2479dc08ab'),
    images: [UNSPLASH('1528740561666-dc2479dc08ab'), UNSPLASH('1583907659441-addbe699e921')],
    description: 'Professional-grade multi-surface cleaner safe for tiles, glass, stainless steel, and more. Antibacterial formula removes 99.9% of bacteria. Fresh citrus scent.',
    specs: { Volume: '5L', Formula: 'Antibacterial', Surfaces: 'Multi-surface', Scent: 'Citrus', Dilution: '1:10' },
    sku: 'CLM-CLN-001',
    featured: true,
    isNew: false,
    isBestSeller: true,
    tags: ['cleaner', 'household', 'antibacterial', 'multi-surface'],
  },
  {
    id: 'hh-002',
    name: 'Premium Stainless Steel Kitchen Set',
    category: 'household',
    subcategory: 'Kitchen Products',
    brand: 'KitchenPro',
    price: 12000,
    salePrice: 8900,
    discount: 26,
    rating: 4.7,
    reviews: 189,
    stock: 55,
    status: 'in-stock',
    image: UNSPLASH('1583907659441-addbe699e921'),
    images: [UNSPLASH('1583907659441-addbe699e921'), UNSPLASH('1649073005971-37babef31983')],
    description: '5-piece premium stainless steel kitchen cookware set. Includes frying pan, saucepan, stockpot, and more. Induction compatible. Dishwasher safe.',
    specs: { Pieces: '5', Material: '18/10 Stainless Steel', Compatible: 'All Hob Types', Dishwasher: 'Safe', Warranty: '10 Years' },
    sku: 'KTP-SET-002',
    featured: true,
    isNew: true,
    isBestSeller: false,
    tags: ['kitchen', 'cookware', 'stainless steel', 'household'],
  },
  {
    id: 'hh-003',
    name: 'Modular Storage Organizer 12 Drawer',
    category: 'household',
    subcategory: 'Storage',
    brand: 'SpaceMax',
    price: 6500,
    salePrice: 4800,
    discount: 26,
    rating: 4.5,
    reviews: 321,
    stock: 88,
    status: 'in-stock',
    image: UNSPLASH('1649073005971-37babef31983'),
    images: [UNSPLASH('1649073005971-37babef31983')],
    description: 'Stackable 12-drawer modular organizer for home and office. Transparent drawers for easy visibility. Heavy-duty construction holds up to 3kg per drawer.',
    specs: { Drawers: '12', Material: 'ABS Plastic', 'Weight Capacity': '3kg/drawer', Dimensions: '40×30×80 cm', Color: 'White/Transparent' },
    sku: 'SPX-STG-003',
    featured: false,
    isNew: false,
    isBestSeller: false,
    tags: ['storage', 'organizer', 'drawers', 'household'],
  },
  {
    id: 'hh-004',
    name: 'Microfiber Mop Set with Bucket',
    category: 'household',
    subcategory: 'Cleaning Products',
    brand: 'CleanMaster',
    price: 4200,
    salePrice: 2950,
    discount: 30,
    rating: 4.4,
    reviews: 267,
    stock: 12,
    status: 'low-stock',
    image: UNSPLASH('1528740561666-dc2479dc08ab'),
    images: [UNSPLASH('1528740561666-dc2479dc08ab')],
    description: 'Complete microfiber mop cleaning set with spin bucket, 2 mop heads, and extendable handle. Removes 99% of bacteria without chemicals.',
    specs: { 'Mop Heads': '2', Bucket: 'Spin Wringer 10L', Handle: 'Telescopic 90–130 cm', Material: 'Microfiber + PP', Compatible: 'All Floors' },
    sku: 'CLM-MOP-004',
    featured: false,
    isNew: false,
    isBestSeller: true,
    tags: ['mop', 'cleaning', 'microfiber', 'household'],
  },
  {
    id: 'hh-005',
    name: 'Automatic Liquid Soap Dispenser',
    category: 'household',
    subcategory: 'Kitchen Products',
    brand: 'SmartHome',
    price: 2500,
    salePrice: 1800,
    discount: 28,
    rating: 4.3,
    reviews: 445,
    stock: 150,
    status: 'in-stock',
    image: UNSPLASH('1649073005971-37babef31983'),
    images: [UNSPLASH('1649073005971-37babef31983')],
    description: 'Touchless automatic soap dispenser with infrared sensor. 300ml capacity. Adjustable dispensing volume. Works with any liquid soap or sanitizer.',
    specs: { Capacity: '300ml', Sensor: 'Infrared', 'Battery Life': '6 Months (4×AA)', Material: 'ABS Plastic', Color: 'White' },
    sku: 'SMH-DIS-005',
    featured: false,
    isNew: true,
    isBestSeller: false,
    tags: ['soap dispenser', 'touchless', 'kitchen', 'household'],
  },
];

export const customers: Customer[] = [
  { id: 'cus-001', name: 'Ahmed Hassan', email: 'ahmed@email.com', phone: '+92 300 1234567', orders: 8, totalSpent: 124500, joinedAt: '2024-01-15', status: 'active', avatar: 'AH' },
  { id: 'cus-002', name: 'Sara Khan', email: 'sara@email.com', phone: '+92 321 9876543', orders: 3, totalSpent: 45200, joinedAt: '2024-03-22', status: 'active', avatar: 'SK' },
  { id: 'cus-003', name: 'Muhammad Ali', email: 'mali@email.com', phone: '+92 333 5551234', orders: 12, totalSpent: 289000, joinedAt: '2023-11-08', status: 'active', avatar: 'MA' },
  { id: 'cus-004', name: 'Fatima Malik', email: 'fatima@email.com', phone: '+92 345 7890123', orders: 1, totalSpent: 9800, joinedAt: '2024-06-10', status: 'inactive', avatar: 'FM' },
  { id: 'cus-005', name: 'Omar Farooq', email: 'omar@email.com', phone: '+92 311 4445678', orders: 5, totalSpent: 78600, joinedAt: '2024-02-28', status: 'active', avatar: 'OF' },
];

export const orders: Order[] = [
  {
    id: 'ORD-2024-001',
    customerId: 'cus-001',
    customerName: 'Ahmed Hassan',
    customerEmail: 'ahmed@email.com',
    items: [
      { productId: 'san-001', name: 'Premium Chrome Wall-Mount Faucet', image: UNSPLASH('1602761004880-0cbb1ba589d2', 100, 100), price: 9800, quantity: 2 },
      { productId: 'hw-002', name: 'Professional Hand Tool Kit 108-Piece', image: UNSPLASH('1606676539940-12768ce0e762', 100, 100), price: 19500, quantity: 1 },
    ],
    subtotal: 39100,
    discount: 3000,
    delivery: 500,
    total: 36600,
    status: 'delivered',
    paymentMethod: 'cash-on-delivery',
    address: { fullName: 'Ahmed Hassan', phone: '+92 300 1234567', street: '45-B Model Town', city: 'Lahore', postalCode: '54000' },
    placedAt: '2024-07-15T10:30:00Z',
    estimatedDelivery: '2024-07-20',
    trackingNumber: 'TRK-2024-001XY',
  },
  {
    id: 'ORD-2024-002',
    customerId: 'cus-003',
    customerName: 'Muhammad Ali',
    customerEmail: 'mali@email.com',
    items: [
      { productId: 'med-001', name: 'Surgical Stainless Steel Instrument Set', image: UNSPLASH('1514416309827-bfb0cf433a2d', 100, 100), price: 11500, quantity: 1 },
      { productId: 'med-002', name: 'Nitrile Examination Gloves Box 100', image: UNSPLASH('1640876777002-badf6aee5bcc', 100, 100), price: 1950, quantity: 5 },
    ],
    subtotal: 21250,
    discount: 0,
    delivery: 300,
    total: 21550,
    status: 'shipped',
    paymentMethod: 'credit-card',
    address: { fullName: 'Muhammad Ali', phone: '+92 333 5551234', street: 'H-13, Islamabad', city: 'Islamabad', postalCode: '44000' },
    placedAt: '2024-08-01T14:00:00Z',
    estimatedDelivery: '2024-08-06',
    trackingNumber: 'TRK-2024-002AB',
  },
  {
    id: 'ORD-2024-003',
    customerId: 'cus-002',
    customerName: 'Sara Khan',
    customerEmail: 'sara@email.com',
    items: [
      { productId: 'hh-001', name: 'Multi-Surface All-Purpose Cleaner 5L', image: UNSPLASH('1528740561666-dc2479dc08ab', 100, 100), price: 1200, quantity: 3 },
      { productId: 'hh-002', name: 'Premium Stainless Steel Kitchen Set', image: UNSPLASH('1583907659441-addbe699e921', 100, 100), price: 8900, quantity: 1 },
    ],
    subtotal: 12500,
    discount: 500,
    delivery: 0,
    total: 12000,
    status: 'processing',
    paymentMethod: 'digital-wallet',
    address: { fullName: 'Sara Khan', phone: '+92 321 9876543', street: 'DHA Phase 5', city: 'Karachi', postalCode: '75500' },
    placedAt: '2024-08-10T09:15:00Z',
    estimatedDelivery: '2024-08-15',
    trackingNumber: 'TRK-2024-003CD',
  },
  {
    id: 'ORD-2024-004',
    customerId: 'cus-005',
    customerName: 'Omar Farooq',
    customerEmail: 'omar@email.com',
    items: [
      { productId: 'hw-001', name: 'Dewalt 18V Cordless Drill Driver Kit', image: UNSPLASH('1572981779307-38b8cabb2407', 100, 100), price: 36000, quantity: 1 },
    ],
    subtotal: 36000,
    discount: 2000,
    delivery: 800,
    total: 34800,
    status: 'confirmed',
    paymentMethod: 'bank-transfer',
    address: { fullName: 'Omar Farooq', phone: '+92 311 4445678', street: 'Gulberg III', city: 'Lahore', postalCode: '54000' },
    placedAt: '2024-08-12T16:45:00Z',
    estimatedDelivery: '2024-08-17',
    trackingNumber: 'TRK-2024-004EF',
  },
  {
    id: 'ORD-2024-005',
    customerId: 'cus-004',
    customerName: 'Fatima Malik',
    customerEmail: 'fatima@email.com',
    items: [
      { productId: 'san-002', name: 'Luxury Rain Shower Set Complete', image: UNSPLASH('1576678433413-202829a1ab98', 100, 100), price: 28500, quantity: 1 },
    ],
    subtotal: 28500,
    discount: 0,
    delivery: 0,
    total: 28500,
    status: 'pending',
    paymentMethod: 'cash-on-delivery',
    address: { fullName: 'Fatima Malik', phone: '+92 345 7890123', street: 'Bahria Town Phase 4', city: 'Rawalpindi', postalCode: '46000' },
    placedAt: '2024-08-14T11:20:00Z',
    estimatedDelivery: '2024-08-19',
    trackingNumber: 'TRK-2024-005GH',
  },
];

export const discountCodes: DiscountCode[] = [
  { id: 'dc-001', code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 5000, maxUses: 1000, usedCount: 234, expiresAt: '2024-12-31', status: 'active', categories: [] },
  { id: 'dc-002', code: 'HEALTH25', type: 'percentage', value: 25, minOrder: 10000, maxUses: 500, usedCount: 89, expiresAt: '2024-10-31', status: 'active', categories: ['surgical'] },
  { id: 'dc-003', code: 'TOOLS500', type: 'fixed', value: 500, minOrder: 15000, maxUses: 200, usedCount: 200, expiresAt: '2024-08-01', status: 'expired', categories: ['hardware'] },
  { id: 'dc-004', code: 'CLEAN20', type: 'percentage', value: 20, minOrder: 2000, maxUses: 300, usedCount: 12, expiresAt: '2024-11-30', status: 'active', categories: ['household'] },
];

export const heroSlides = [
  {
    id: 1,
    category: 'sanitary',
    headline: 'Transform Your Bathroom Into Something Better',
    subheadline: 'Premium sanitary fittings & bathroom accessories',
    cta1: 'Shop Sanitary Items',
    cta2: 'Explore Collection',
    image: UNSPLASH('1571781418606-70265b9cce90', 1200, 700),
    gradient: 'from-slate-900 via-blue-950 to-slate-800',
    accent: '#0ea5e9',
    badge: 'New Arrivals',
  },
  {
    id: 2,
    category: 'hardware',
    headline: 'The Right Tools for Every Job',
    subheadline: 'Professional power tools & hardware essentials',
    cta1: 'Shop Hardware',
    cta2: 'Explore Tools',
    image: UNSPLASH('1572981779307-38b8cabb2407', 1200, 700),
    gradient: 'from-stone-900 via-amber-950 to-stone-800',
    accent: '#f59e0b',
    badge: 'Up to 30% Off',
  },
  {
    id: 3,
    category: 'surgical',
    headline: 'Reliable Medical & Surgical Supplies',
    subheadline: 'Certified equipment for healthcare professionals',
    cta1: 'Shop Medical Items',
    cta2: 'View Products',
    image: UNSPLASH('1551076805-e1869033e561', 1200, 700),
    gradient: 'from-teal-950 via-cyan-950 to-slate-900',
    accent: '#14b8a6',
    badge: 'ISO Certified',
  },
  {
    id: 4,
    category: 'household',
    headline: 'Everything Your Home Needs',
    subheadline: 'Quality household essentials at unbeatable prices',
    cta1: 'Shop Household',
    cta2: 'Explore Products',
    image: UNSPLASH('1528740561666-dc2479dc08ab', 1200, 700),
    gradient: 'from-emerald-950 via-green-950 to-slate-900',
    accent: '#10b981',
    badge: 'Best Value',
  },
];

export const categories = [
  {
    id: 'sanitary',
    name: 'Sanitary Items',
    description: 'Premium bathroom fittings, faucets, wash basins, and accessories',
    icon: '🚿',
    products: 5,
    image: UNSPLASH('1571781418606-70265b9cce90', 600, 400),
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'hardware',
    name: 'Hardware & Tools',
    description: 'Professional power tools, hand tools, locks, and fasteners',
    icon: '🔧',
    products: 5,
    image: UNSPLASH('1572981779307-38b8cabb2407', 600, 400),
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'surgical',
    name: 'Surgical & Medical',
    description: 'Certified surgical instruments, diagnostics, and protective supplies',
    icon: '⚕️',
    products: 5,
    image: UNSPLASH('1514416309827-bfb0cf433a2d', 600, 400),
    color: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'household',
    name: 'Household Essentials',
    description: 'Quality cleaning products, kitchen essentials, and storage solutions',
    icon: '🏠',
    products: 5,
    image: UNSPLASH('1528740561666-dc2479dc08ab', 600, 400),
    color: 'from-emerald-500 to-green-600',
  },
];
