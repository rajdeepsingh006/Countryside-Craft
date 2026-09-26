/**
 * Seed Script — run with: npm run seed
 * Creates: 1 Main Admin, 2 Categories (Jute, Canvas), 17 Handcrafted Products, 1 Settings document
 */

require('./config/env');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Admin = require('./models/admin.model');
const Category = require('./models/category.model');
const Product = require('./models/product.model');
const Settings = require('./models/settings.model');
const { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } = require('./data/defaultProducts');

const seed = async () => {
  await connectDB();
  console.log('\n🌱 Starting database seed with Jute & Canvas categories and 17 products...\n');

  // ─── Clear existing sample data ───────────────────────────────
  await Admin.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Settings.deleteMany({});
  console.log('✅ Cleared all previous sample products and data');

  // ─── Create Main Admin ────────────────────────────────────────
  await Admin.create({
    name: 'Countryside Craft Owner',
    username: 'admin',
    passwordHash: 'Admin@123456',
    role: 'main_admin',
  });
  console.log(`✅ Main Admin created — username: admin | password: Admin@123456`);

  // ─── Create Categories ────────────────────────────────────────
  const categories = await Category.insertMany(
    DEFAULT_CATEGORIES.map((c) => ({
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
    }))
  );
  console.log(`✅ ${categories.length} Categories created (Jute, Canvas)`);

  // Category map by slug
  const catMap = {};
  categories.forEach((c) => {
    catMap[c.slug] = c._id;
  });

  // ─── Create Products ──────────────────────────────────────────
  const productsToInsert = DEFAULT_PRODUCTS.map((p) => ({
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    description: p.description,
    detailedStory: p.detailedStory,
    material: p.material,
    dimensions: p.dimensions,
    handleLength: p.handleLength,
    closureType: p.closureType,
    features: p.features,
    images: p.images,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    stock: p.stock,
    category: catMap[p.category],
    tags: p.tags,
    isFeatured: p.isFeatured,
    isBestseller: p.isBestseller,
    isNewArrival: p.isNewArrival,
    ratingAverage: p.ratingAverage,
    ratingCount: p.ratingCount,
    isActive: true,
  }));

  const products = await Product.insertMany(productsToInsert);
  console.log(`✅ ${products.length} Products created across Jute and Canvas`);

  // ─── Create Settings ──────────────────────────────────────────
  await Settings.create({
    storeName: 'Countryside Craft',
    shippingNote: 'Prices shown exclude shipping/delivery charges. Delivery charges will be confirmed on WhatsApp.',
    announcementBarText: '✦ FESTIVE SALE: Free Handmade Zipper Pouch on orders over ₹1,499 | Pan-India 48hr Dispatch ✦',
    announcementText: '✦ FESTIVE SALE: Free Handmade Zipper Pouch on orders over ₹1,499 | Pan-India 48hr Dispatch ✦',
    whatsappNumber: '917009361881',
    upiId: 'yourstorename@oksbi',
    email: 'hello@countrysidecraft.in',
    contactEmail: 'hello@countrysidecraft.in',
    currency: 'INR',
    freeShippingThreshold: 1499,
  });
  console.log('✅ Settings document created');

  console.log('\n🎉 Seed complete! Jute and Canvas catalog successfully configured.\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Login:');
  console.log('  Username : admin');
  console.log('  Password : Admin@123456');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
