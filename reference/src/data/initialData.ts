import { Product, Category, Review, GalleryItem, StoreSettings, Order, AdminUser } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    _id: 'cat-1',
    name: 'Hand Block Print Totes',
    slug: 'hand-block-print',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    description: 'Heritage hand-carved teakwood block prints crafted by master artisans with azo-free botanical pigments.',
    itemCount: 8
  },
  {
    _id: 'cat-2',
    name: 'Everyday Heavyweight Canvas',
    slug: 'everyday-canvas',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    description: 'Durable 450 GSM organic cotton canvas with inner zipper laptop pockets and reinforced strap stitching.',
    itemCount: 6
  },
  {
    _id: 'cat-3',
    name: 'Botanical & Floral Prints',
    slug: 'botanical-floral',
    image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=800&q=80',
    description: 'Pressed flora, wild marigold, and jungle foliage designs screen-printed with organic plant-based inks.',
    itemCount: 5
  },
  {
    _id: 'cat-4',
    name: 'Festive & Wedding Favors',
    slug: 'festive-wedding',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
    description: 'Gilded foil accents, zari borders, and customized bulk totes perfect for Indian weddings and celebratory return gifting.',
    itemCount: 7
  },
  {
    _id: 'cat-5',
    name: 'Minimalist Typography & Quotes',
    slug: 'minimalist-typography',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: 'Clean typographic literary quotes and mindful aphorisms on raw unbleached natural canvas.',
    itemCount: 4
  },
  {
    _id: 'cat-6',
    name: 'Weekend Oversized Carryalls',
    slug: 'weekend-carryalls',
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=800&q=80',
    description: 'Roomy gusseted beach & travel carryalls with dual interior bottle holders and key tether clip.',
    itemCount: 3
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    _id: 'prod-1',
    name: 'Jaipur Indigo Dabu Hand Block Canvas Tote',
    slug: 'jaipur-indigo-dabu-hand-block-canvas-tote',
    tagline: 'Traditional Mud-Resist Hand Block Print on Heavy Canvas',
    description: 'Crafted with authentic Bagru mud-resist (Dabu) block printing using natural fermented indigo. Features an expansive 16x15-inch body with a 4.5-inch bottom gusset, padded 15" laptop sleeve, and an internal brass-zippered pocket.',
    detailedStory: 'Each motif is pressed by hand using century-old sheesham wood blocks carved in Rajasthan. After printing, the canvas undergoes four cold-water dips in natural indigo vats before sun-curing on open sandbeds.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=1000&q=80'
    ],
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    price: 899,
    originalPrice: 1299,
    discountPercent: 30,
    stock: 18,
    category: 'hand-block-print',
    categoryName: 'Hand Block Print Totes',
    tags: ['Hand Block Print', 'Natural Indigo', '15" Laptop Fit', 'Zipper Closure', 'Bestseller'],
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    ratingAverage: 4.9,
    ratingCount: 42,
    dimensions: '16.5" H x 15" W x 4.5" Gusset',
    material: '450 GSM 100% Organic Unbleached Cotton Duck Canvas',
    handleLength: '11.5" Drop Length with Double Bar-tack Stitching',
    closureType: 'YKK Antiqued Brass Zip & Magnetic Snap Flap',
    features: [
      'Fits up to 15.6" laptops + notebooks & lunch box',
      'Interior zippered pocket for keys & wallet',
      'Dual water bottle / umbrella elastic internal holsters',
      'Treated with water-resistant organic beeswax coating'
    ],
    isActive: true,
    createdAt: '2026-06-15T10:00:00Z',
    updatedAt: '2026-08-20T12:00:00Z'
  },
  {
    _id: 'prod-2',
    name: 'Wild Marigold Botanical Print Canvas Tote',
    slug: 'wild-marigold-botanical-print-canvas-tote',
    tagline: 'Sunshine Ochre Screen Print with Reinforced Khaki Straps',
    description: 'Inspired by traditional Indian temple marigolds (Genda Phool), this warm mustard tote brings radiant cheer to everyday errands and office commutes. Made from tightly woven 400 GSM canvas.',
    detailedStory: 'Designed in our Bangalore studio and hand-screen-printed using eco-conscious water-soluble inks. The contrast olive webbing handles are tested to hold up to 14 kg without stretching.',
    images: [
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 749,
    originalPrice: 999,
    discountPercent: 25,
    stock: 24,
    category: 'botanical-floral',
    categoryName: 'Botanical & Floral Prints',
    tags: ['Botanical', 'Mustard Ochre', 'Eco-Friendly Inks', 'Zipper Pocket', 'New'],
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    ratingAverage: 4.8,
    ratingCount: 29,
    dimensions: '15.5" H x 14.5" W x 4" Gusset',
    material: '400 GSM Organic Cotton Canvas with Vegan Leather Base Pad',
    handleLength: '11" Shoulder Drop Length',
    closureType: 'Top Magnetic Button Closure + Inner Zip Pocket',
    features: [
      'Vibrant botanical illustration that will not fade after wash',
      'Spacious main compartment + 2 slip pockets for phone',
      'Reinforced base panel prevents bottom sagging',
      'Includes detachable cotton drawstring organizer pouch'
    ],
    isActive: true,
    createdAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-08-22T14:30:00Z'
  },
  {
    _id: 'prod-3',
    name: 'Sanskrit Mandala Gilded Return-Gift Tote',
    slug: 'sanskrit-mandala-gilded-return-gift-tote',
    tagline: 'Premium Gold Foil & Zari Accents for Festive Gifting',
    description: 'An opulent yet timeless tote bag designed specifically for wedding favors, housewarmings, and festive gifting. Intricate sacred geometry mandala printed in rich gold foil and crimson.',
    detailedStory: 'Customized in bulk batches for weddings across India. Features luxurious silk-touch cotton lining and golden tassel drawstrings that add a royal touch.',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 649,
    originalPrice: 850,
    discountPercent: 23,
    stock: 50,
    category: 'festive-wedding',
    categoryName: 'Festive & Wedding Favors',
    tags: ['Wedding Favors', 'Gold Foil', 'Custom Monogram Available', 'Festive'],
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    ratingAverage: 5.0,
    ratingCount: 36,
    dimensions: '14" H x 13" W x 3.5" Gusset',
    material: '380 GSM Ivory Canvas with Metallic Gold Thread Accents',
    handleLength: '10" Drop Woven Brocade Ribbon Handles',
    closureType: 'Magnetic Clasp + Golden Zari Tassels',
    features: [
      'Ideal for wedding hampers, mithai boxes, and sari gifting',
      'Custom name / wedding monogram printing available for 25+ pcs',
      'Premium inner satin lining',
      'Ships in protective eco-friendly butter paper gift sleeve'
    ],
    isActive: true,
    createdAt: '2026-07-10T11:00:00Z',
    updatedAt: '2026-08-25T16:00:00Z'
  },
  {
    _id: 'prod-4',
    name: 'The Daily Minimalist "Book & Chai" Natural Tote',
    slug: 'the-daily-minimalist-book-and-chai-natural-tote',
    tagline: 'Raw Unbleached Canvas with Serene Typographic Print',
    description: 'A beloved companion for café afternoons, library visits, and farmer markets. Crisp typographic layout celebrating slow living, chai lovers, and bookworms.',
    detailedStory: 'Screen printed on 100% untreated natural canvas that develops a soft, vintage patina over time. Zero chemical bleaching or artificial stiffeners.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 599,
    originalPrice: 799,
    discountPercent: 25,
    stock: 35,
    category: 'minimalist-typography',
    categoryName: 'Minimalist Typography & Quotes',
    tags: ['Typography', 'Minimalist', 'Everyday Use', 'Unbleached Canvas'],
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    ratingAverage: 4.7,
    ratingCount: 58,
    dimensions: '15" H x 14" W x 3" Gusset',
    material: '350 GSM 100% Raw Natural Greige Cotton Canvas',
    handleLength: '12" Extra-Comfortable Flat Straps',
    closureType: 'Open Top with Deep Inner Secret Zipper Pocket',
    features: [
      'Ultralight yet rated to carry 10+ heavy hardcover books',
      'Deep 8x7 inch interior zippered pocket for passport & cash',
      'Machine washable on gentle cold cycle',
      'Biodegradable and 100% plastic-free'
    ],
    isActive: true,
    createdAt: '2026-05-20T08:00:00Z',
    updatedAt: '2026-08-18T10:15:00Z'
  },
  {
    _id: 'prod-5',
    name: 'Kalamkari Tree of Life Heavy Artisan Carryall',
    slug: 'kalamkari-tree-of-life-heavy-artisan-carryall',
    tagline: 'Handcrafted Heritage Kalamkari Artwork with Vegetable Pigments',
    description: 'A masterpiece tribute to Andhra Kalamkari artistry depicting the mythical Kalpavriksha (Tree of Life). Rich earthy tones of madder red, fermented iron black, and warm turmeric yellow.',
    detailedStory: 'The motif is rendered using hand-drawn bamboo pens (kalam) and block printing by legacy artisan families in Machilipatnam.',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 1099,
    originalPrice: 1599,
    discountPercent: 31,
    stock: 12,
    category: 'hand-block-print',
    categoryName: 'Hand Block Print Totes',
    tags: ['Kalamkari', 'Tree of Life', 'Artisan Made', 'Zippered', 'Signature'],
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    ratingAverage: 4.95,
    ratingCount: 64,
    dimensions: '17" H x 16" W x 5" Gusset',
    material: '500 GSM Heavy Duck Canvas with Genuine Leather Trim',
    handleLength: '12" Reinforced Saddle-Stitched Leather Handles',
    closureType: 'Full-length Metal Zipper with Leather Puller',
    features: [
      'Padded compartment holds 16" MacBook Pro',
      '3 Dedicated slip pockets + 1 large zippered pocket',
      'Brass metal feet on base to protect fabric from floor surfaces',
      'Includes authentic artisan certificate card'
    ],
    isActive: true,
    createdAt: '2026-06-01T12:00:00Z',
    updatedAt: '2026-08-24T18:00:00Z'
  },
  {
    _id: 'prod-6',
    name: 'Goa Coastal Palms Oversized Weekend Tote',
    slug: 'goa-coastal-palms-oversized-weekend-tote',
    tagline: 'Water-Resistant Beach & Staycation Canvas Duffel-Tote',
    description: 'Designed for sun-drenched coastal getaways, yoga retreats, and farmers market hauls. Features a serene coconut palm screen print in sage green and sandy beige.',
    detailedStory: 'Constructed with double-ply canvas and a water-resistant lining that wipes clean effortlessly. Has a dedicated bottom compartment for sandals or wet swimsuits.',
    images: [
      'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 949,
    originalPrice: 1350,
    discountPercent: 30,
    stock: 15,
    category: 'weekend-carryalls',
    categoryName: 'Weekend Oversized Carryalls',
    tags: ['Beach Bag', 'Oversized', 'Water Resistant', 'Travel Tote'],
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    ratingAverage: 4.85,
    ratingCount: 19,
    dimensions: '18" H x 18" W x 6" Gusset (Extra Roomy)',
    material: '450 GSM Canvas with Water-Repellent Internal Membrane',
    handleLength: '13" Soft Cotton Rope Wrapped Handles',
    closureType: 'Heavy Duty Zip + Magnetic Side Snap Expanders',
    features: [
      'Holds 2-day weekend clothing + toiletries & beach towel',
      'Exterior quick-access phone & boarding pass slide pocket',
      'Key leash carabiner inside so keys never get lost',
      'Folds flat into your suitcase for travel packing'
    ],
    isActive: true,
    createdAt: '2026-07-25T14:00:00Z',
    updatedAt: '2026-08-23T11:00:00Z'
  },
  {
    _id: 'prod-7',
    name: 'Monstera & Tropical Fern Botanical Tote',
    slug: 'monstera-and-tropical-fern-botanical-tote',
    tagline: 'Deep Forest Green Screen Print on Cream Canvas',
    description: 'Fresh, vibrant botanical study featuring monstera leaves, wild ferns, and trailing eucalyptus. A lush touch of nature for plant lovers and daily college wear.',
    detailedStory: 'Printed with organic non-toxic pigments on OEKO-TEX certified unbleached canvas.',
    images: [
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 699,
    originalPrice: 899,
    discountPercent: 22,
    stock: 28,
    category: 'botanical-floral',
    categoryName: 'Botanical & Floral Prints',
    tags: ['Botanical', 'Plant Lover', 'Forest Green', 'Everyday'],
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    ratingAverage: 4.9,
    ratingCount: 31,
    dimensions: '15" H x 14" W x 3.5" Gusset',
    material: '380 GSM Cotton Canvas',
    handleLength: '11" Dark Olive Webbing Handles',
    closureType: 'Magnetic Snap Closure',
    features: [
      'Heavy-duty stitched stress points',
      'Inside slot pocket for sunglasses & earphones',
      'Lightweight and washable'
    ],
    isActive: true,
    createdAt: '2026-06-28T10:00:00Z',
    updatedAt: '2026-08-21T09:00:00Z'
  },
  {
    _id: 'prod-8',
    name: 'Mughal Paisley Gold Border Festive Tote',
    slug: 'mughal-paisley-gold-border-festive-tote',
    tagline: 'Imperial Paisley Motifs with Antique Gold Border Piping',
    description: 'An elegant tribute to royal Mughal architectural motifs. Featuring deep sapphire blue paisley prints bordered with shimmering antique gold thread piping.',
    detailedStory: 'A top choice for Diwali gift hampers, bridal trousseau return bags, and festive celebration packages.',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
    ],
    price: 799,
    originalPrice: 1100,
    discountPercent: 27,
    stock: 30,
    category: 'festive-wedding',
    categoryName: 'Festive & Wedding Favors',
    tags: ['Paisley', 'Festive', 'Gold Piping', 'Gift Favor'],
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    ratingAverage: 4.8,
    ratingCount: 22,
    dimensions: '14.5" H x 14" W x 4" Gusset',
    material: '400 GSM Canvas with Raw Silk Accents',
    handleLength: '10.5" Gold Thread Laced Handles',
    closureType: 'Gold Magnetic Button',
    features: [
      'Rich jewel tone pigments that stay lustrous',
      'Sturdy cardboard-reinforced bottom insert',
      'Custom tag attachment loop for personalized greetings'
    ],
    isActive: true,
    createdAt: '2026-08-01T15:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    _id: 'rev-1',
    productId: 'prod-1',
    productName: 'Jaipur Indigo Dabu Hand Block Canvas Tote',
    customerName: 'Ananya Sharma',
    customerLocation: 'Bangalore',
    rating: 5,
    comment: 'The quality of the canvas is extraordinary! Fits my 15-inch work laptop, charger, lunchbox and water bottle easily without looking bulky. The indigo print is so authentic and I get compliments at office every single day.',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: '2026-08-10T14:20:00Z'
  },
  {
    _id: 'rev-2',
    productId: 'prod-1',
    productName: 'Jaipur Indigo Dabu Hand Block Canvas Tote',
    customerName: 'Pooja Venkatesh',
    customerLocation: 'Chennai',
    rating: 5,
    comment: 'The WhatsApp ordering was super fast! Ordered 5 bags for my cousins and the team confirmed the customized gift cards on WhatsApp within 10 minutes. Love the handcrafted feel.',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: '2026-08-15T09:12:00Z'
  },
  {
    _id: 'rev-3',
    productId: 'prod-2',
    productName: 'Wild Marigold Botanical Print Canvas Tote',
    customerName: 'Meera Deshmukh',
    customerLocation: 'Pune',
    rating: 5,
    comment: 'The marigold color is so warm and vibrant! Tightly woven canvas with very neat stitching. The magnetic closure and inner zipper pocket keep everything safe.',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: '2026-08-18T18:45:00Z'
  },
  {
    _id: 'rev-4',
    productId: 'prod-3',
    productName: 'Sanskrit Mandala Gilded Return-Gift Tote',
    customerName: 'Radhika Sundaram',
    customerLocation: 'Hyderabad',
    rating: 5,
    comment: 'We ordered 80 pieces of these for our daughter\'s wedding return favors. Every single guest was asking where we bought them. The gold foil work and tassels are truly premium!',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: '2026-08-05T11:30:00Z'
  },
  {
    _id: 'rev-5',
    productId: 'prod-4',
    productName: 'The Daily Minimalist "Book & Chai" Natural Tote',
    customerName: 'Tanvi Roy',
    customerLocation: 'Kolkata',
    rating: 4,
    comment: 'Great minimalist aesthetic! The raw canvas feels very natural. I carry heavy textbooks to university and the straps are super sturdy.',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: '2026-08-20T16:10:00Z'
  },
  {
    _id: 'rev-6',
    productId: 'prod-5',
    productName: 'Kalamkari Tree of Life Heavy Artisan Carryall',
    customerName: 'Shreya Kulkarni',
    customerLocation: 'Mumbai',
    rating: 5,
    comment: 'Worth every single rupee! The leather handles and brass bottom studs make it look like a luxury designer tote. The Kalamkari artwork is mesmerizing.',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: '2026-08-22T20:00:00Z'
  },
  {
    _id: 'rev-7',
    productId: 'prod-2',
    productName: 'Wild Marigold Botanical Print Canvas Tote',
    customerName: 'Kavita Menon',
    customerLocation: 'Kochi',
    rating: 5,
    comment: 'Stunning craftsmanship! Arrived within 3 days. Beautiful packaging.',
    isVerifiedPurchase: true,
    isApproved: false, // Pending admin approval test
    createdAt: '2026-08-26T08:15:00Z'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    _id: 'gal-1',
    title: 'Jaipur Wooden Block Carving & Indigo Workshop',
    category: 'workshops',
    description: 'Hosting a weekend masterclass on hand-carved teakwood blocks and natural indigo dye vat techniques with local artisans.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    eventDate: '2026-07-14',
    location: 'Jaipur Craft Studio, Rajasthan',
    attendeesCount: 35
  },
  {
    _id: 'gal-2',
    title: 'Bangalore Artisanal Pop-up Market at Chitra Kala Parishath',
    category: 'events',
    description: 'Showcasing our handcrafted festive tote collection and live monogram printing at the annual handmade crafts fair.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80',
    eventDate: '2026-08-02',
    location: 'CKP Arts Complex, Bangalore',
    attendeesCount: 450
  },
  {
    _id: 'gal-3',
    title: 'Natural Marigold & Pomegranate Dye Vat Preparation',
    category: 'behind-the-scenes',
    description: 'Boiling wild marigold petals and dried pomegranate rinds to extract golden ochre pigments for our botanical collection.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=1200&q=80',
    eventDate: '2026-06-20',
    location: 'Vana Botanical Lab, Mysuru',
    attendeesCount: 12
  },
  {
    _id: 'gal-4',
    title: 'Custom Bulk Wedding Favor Bag Production (150 Pieces)',
    category: 'custom-bulk',
    description: 'Finishing gold foil monogramming and hand-braided zari tassels for a royal destination wedding in Udaipur.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1200&q=80',
    eventDate: '2026-07-28',
    location: 'Vana Finishing Workshop, Udaipur',
    attendeesCount: 8
  },
  {
    _id: 'gal-5',
    title: 'Live Screen Printing & Canvas Sewing Masterclass',
    category: 'workshops',
    description: 'Hands-on session teaching participants how to design their own botanical screen prints and stitch reinforced box corners.',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=1200&q=80',
    eventDate: '2026-08-12',
    location: 'Design Guild, Mumbai',
    attendeesCount: 28
  },
  {
    _id: 'gal-6',
    title: 'Zero-Waste Cutting Table & Eco Canvas Sourcing',
    category: 'behind-the-scenes',
    description: 'How our master cutters optimize heavy canvas bolt patterns to produce zero fabric scrap waste.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    eventDate: '2026-05-18',
    location: 'Artisan Hub, Coimbatore',
    attendeesCount: 15
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    _id: 'ord-1',
    orderNumber: 'VANA-2026-0841',
    customer: {
      name: 'Aditi Nair',
      phone: '919876543210',
      email: 'aditi.nair@example.com',
      address: 'Flat 402, Shanti Vihar, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      note: 'Please pack in festive butter paper with a note: Happy Birthday Sanya!',
      giftWrap: true
    },
    items: [
      {
        productId: 'prod-1',
        name: 'Jaipur Indigo Dabu Hand Block Canvas Tote',
        price: 899,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'
      },
      {
        productId: 'prod-2',
        name: 'Wild Marigold Botanical Print Canvas Tote',
        price: 749,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotal: 1648,
    discount: 0,
    totalAmount: 1648,
    shippingNote: 'Shipping charges calculated extra based on delivery pincode',
    status: 'delivered',
    whatsappMessageSent: true,
    whatsappUrl: 'https://wa.me/919876543210',
    adminNotes: 'Delivered via DTDC Courier Track: DTDC8934291',
    createdAt: '2026-08-21T10:15:00Z',
    updatedAt: '2026-08-24T16:00:00Z'
  },
  {
    _id: 'ord-2',
    orderNumber: 'VANA-2026-0842',
    customer: {
      name: 'Vikramaditya Rao',
      phone: '919811223344',
      email: 'vikram.rao@example.com',
      address: 'House No 12, Jubilee Hills Road 36',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      note: 'Bulk wedding sample inspection. Need dispatch tomorrow.'
    },
    items: [
      {
        productId: 'prod-3',
        name: 'Sanskrit Mandala Gilded Return-Gift Tote',
        price: 649,
        quantity: 4,
        image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotal: 2596,
    discount: 200,
    totalAmount: 2396,
    shippingNote: 'Shipping charges calculated extra based on delivery pincode',
    status: 'shipped',
    whatsappMessageSent: true,
    whatsappUrl: 'https://wa.me/919811223344',
    adminNotes: 'Dispatched via BlueDart AWB #94820188',
    createdAt: '2026-08-25T11:45:00Z',
    updatedAt: '2026-08-26T09:30:00Z'
  },
  {
    _id: 'ord-3',
    orderNumber: 'VANA-2026-0843',
    customer: {
      name: 'Priyanka Sen',
      phone: '919748001122',
      email: 'priyanka.sen@example.com',
      address: 'Tower 3, Flat 9B, South City Residency',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700068',
      note: 'Please call before delivery'
    },
    items: [
      {
        productId: 'prod-5',
        name: 'Kalamkari Tree of Life Heavy Artisan Carryall',
        price: 1099,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotal: 1099,
    discount: 0,
    totalAmount: 1099,
    shippingNote: 'Shipping charges calculated extra based on delivery pincode',
    status: 'confirmed',
    whatsappMessageSent: true,
    whatsappUrl: 'https://wa.me/919748001122',
    adminNotes: 'Payment confirmed over UPI ₹1,099 + ₹90 Express shipping',
    createdAt: '2026-08-26T16:20:00Z',
    updatedAt: '2026-08-26T17:00:00Z'
  },
  {
    _id: 'ord-4',
    orderNumber: 'VANA-2026-0844',
    customer: {
      name: 'Rohan Deshpande',
      phone: '919822334455',
      address: 'Lane 7, Koregaon Park',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      note: 'Need ASAP for weekend gifting.'
    },
    items: [
      {
        productId: 'prod-4',
        name: 'The Daily Minimalist "Book & Chai" Natural Tote',
        price: 599,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotal: 1198,
    discount: 0,
    totalAmount: 1198,
    shippingNote: 'Shipping charges calculated extra based on delivery pincode',
    status: 'pending',
    whatsappMessageSent: true,
    createdAt: '2026-08-27T01:10:00Z',
    updatedAt: '2026-08-27T01:10:00Z'
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    _id: 'admin-1',
    name: 'Vana Founder (Main Admin)',
    username: 'admin',
    email: 'owner@vanaartisan.com',
    role: 'main_admin',
    isActive: true,
    lastLogin: '2026-08-27T02:00:00Z',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    _id: 'admin-2',
    name: 'Kavya Sharma (Operations Manager)',
    username: 'kavya_admin',
    email: 'kavya@vanaartisan.com',
    role: 'admin',
    isActive: true,
    lastLogin: '2026-08-26T18:30:00Z',
    createdBy: 'admin-1',
    createdAt: '2026-03-15T10:00:00Z'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'VANA Artisan Tote Co.',
  tagline: 'Handcrafted Canvas & Block Printed Sustainable Goods',
  announcementBarText: '✦ FESTIVE SALE: Free Handmade Zipper Pouch on orders over ₹1,499 | Pan-India 48hr Dispatch ✦',
  announcementEnabled: true,
  whatsappNumber: '919876543210',
  shippingNote: 'Prices exclude shipping/delivery charges (confirmed via WhatsApp based on exact pincode)',
  currencySymbol: '₹',
  contactEmail: 'namaste@vanaartisan.com',
  contactPhone: '+91 98765 43210',
  address: 'Studio 4, Heritage Crafts Enclave, Indiranagar, Bangalore 560038, Karnataka',
  instagramUrl: 'https://instagram.com/vana_artisans',
  facebookUrl: 'https://facebook.com/vanaartisans',
  pinterestUrl: 'https://pinterest.com/vanaartisans',
  freeShippingThreshold: 1499
};
