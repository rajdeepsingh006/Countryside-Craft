import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Check,
  Play,
  Heart,
  Share2,
  Package,
  Layers,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ProductCard } from '../components/product/ProductCard';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../utils/whatsappMessageBuilder';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { products, reviews, settings, openReviewModal, showToast } = useStore();
  const { addToCart } = useCart();

  const product = products.find((p) => p.slug === slug || p._id === slug) || products[0];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'care' | 'gifting'>('desc');

  // Reset image on slug change
  useEffect(() => {
    setActiveImageIdx(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold">Product not found</h2>
        <button
          onClick={() => onNavigate('products')}
          className="mt-4 px-4 py-2 bg-[#8C5E3C] text-white rounded-xl"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const productReviews = reviews.filter((r) => r.productId === product._id && r.isApproved);

  const relatedProducts = products
    .filter((p) => p.isActive && p._id !== product._id && (p.category === product.category || p.isBestseller))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleDirectWhatsAppBuy = () => {
    const msg = `Namaste VANA Team! 👋 I would like to order "${product.name}" (Qty: ${quantity}, Price: ${formatCurrency(
      product.price * quantity
    )}). Could you please share delivery timeframe and payment details?`;
    const url = generateWhatsAppUrl(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.tagline || product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-[#8A7D6C] mb-6 overflow-x-auto">
          <button onClick={() => onNavigate('home')} className="hover:text-[#2A241E] transition-colors">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => onNavigate('products')} className="hover:text-[#2A241E] transition-colors">
            All Totes
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button
            onClick={() => onNavigate('products', product.category)}
            className="hover:text-[#2A241E] transition-colors truncate max-w-xs"
          >
            {product.categoryName}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#2A241E] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD0] shadow-sm">
          
          {/* Images & Video Left (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5EFE6] border border-[#E0D5C3]">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Discount Badge */}
              {product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-[#B33E2B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {product.discountPercent}% OFF
                </div>
              )}

              {/* Video Play Trigger if video exists */}
              {product.video && (
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="absolute bottom-4 right-4 bg-[#241F18]/90 hover:bg-[#241F18] text-amber-200 text-xs font-bold px-3.5 py-2 rounded-xl backdrop-blur-md shadow-lg flex items-center space-x-2 transition-all hover:scale-105 border border-white/20"
                >
                  <Play className="w-4 h-4 fill-amber-300 ml-0.5" />
                  <span>Watch Fabric & Texture Video</span>
                </button>
              )}

              {/* Share button */}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#4A4032] shadow-sm transition-colors"
                title="Share this tote bag"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Row */}
            <div className="flex space-x-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-[#F5EFE6] ${
                    activeImageIdx === i
                      ? 'border-[#8C5E3C] scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details & Ordering Right (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-3">
              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C5E3C] bg-[#EFE7D8] px-2.5 py-1 rounded-md">
                  {product.categoryName}
                </span>
                {product.isBestseller && (
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md">
                    ★ Bestseller
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#241F18] leading-tight">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="text-xs sm:text-sm text-[#736553] font-serif-display italic">
                  "{product.tagline}"
                </p>
              )}

              {/* Rating & Review Jump */}
              <div className="flex items-center space-x-3 pt-1">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.ratingAverage)
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-[#2A241D] ml-1.5">{product.ratingAverage}</span>
                </div>
                <span className="text-xs text-[#8C7E6C] font-medium underline cursor-pointer" onClick={() => setActiveTab('desc')}>
                  ({product.ratingCount} reviews)
                </span>
                <span className="text-xs font-semibold text-emerald-800">• Ready to Dispatch</span>
              </div>

              {/* Price & Savings */}
              <div className="pt-2 border-t border-[#F2ECE1]">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-[#241F18]">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-base text-[#948774] line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="text-xs font-bold text-[#B33E2B] bg-rose-50 px-2 py-0.5 rounded">
                        Save {formatCurrency(product.originalPrice - product.price)}
                      </span>
                    </>
                  )}
                </div>

                {/* Mandated Shipping Note (FR-6) */}
                <div className="mt-2 p-2.5 rounded-xl bg-[#FAF6EE] border border-[#E8DFD0] text-xs text-[#6E604F] flex items-start space-x-2">
                  <Truck className="w-4 h-4 text-[#8C5E3C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Delivery Note:</strong> Shipping & delivery charges are calculated extra based on destination pincode (confirmed directly over WhatsApp).
                  </span>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="py-2 space-y-1.5 text-xs text-[#52483B]">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#8C5E3C]">Material:</span>
                  <span>{product.material || '450 GSM Heavy Organic Cotton Canvas'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#8C5E3C]">Dimensions:</span>
                  <span>{product.dimensions || '16" H x 15" W x 4" Gusset'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#8C5E3C]">Closure:</span>
                  <span>{product.closureType || 'Zipper + Magnetic Snap'}</span>
                </div>
              </div>
            </div>

            {/* Ordering Controls & WhatsApp Direct */}
            <div className="space-y-3 pt-4 border-t border-[#F2ECE1]">
              
              {/* Quantity Stepper & Add to Bag */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-[#D5C7B2] rounded-xl bg-[#FAF7F2] p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded text-[#52493C] hover:bg-white font-bold"
                  >
                    -
                  </button>
                  <span className="w-9 text-center text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-9 h-9 rounded text-[#52493C] hover:bg-white font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  id="detail-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={added || product.stock <= 0}
                  className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-md ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#3B362F] hover:bg-[#25211C] text-white active:scale-98'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#EADECC]" />
                      <span>Add to Bag • {formatCurrency(product.price * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct WhatsApp Instant Buy Button */}
              <button
                id="detail-whatsapp-buy-btn"
                onClick={handleDirectWhatsAppBuy}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant Buy on WhatsApp (Direct Chat)</span>
              </button>

              <div className="pt-2 flex items-center justify-between text-[11px] text-[#7A6D5A]">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>100% Quality Inspected</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Package className="w-3.5 h-3.5 text-[#8C5E3C]" />
                  <span>Eco-Friendly Butter Paper Packaging</span>
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Tabbed Detailed Specifications & Story */}
        <div className="mt-12 bg-white rounded-3xl border border-[#E8DFD0] p-6 sm:p-8 shadow-xs">
          {/* Tabs */}
          <div className="flex border-b border-[#E8DFD0] space-x-4 sm:space-x-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition-colors border-b-2 shrink-0 ${
                activeTab === 'desc'
                  ? 'border-[#8C5E3C] text-[#8C5E3C]'
                  : 'border-transparent text-[#7A6D5C] hover:text-[#2A241E]'
              }`}
            >
              Description & Craft Story
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition-colors border-b-2 shrink-0 ${
                activeTab === 'specs'
                  ? 'border-[#8C5E3C] text-[#8C5E3C]'
                  : 'border-transparent text-[#7A6D5C] hover:text-[#2A241E]'
              }`}
            >
              Materials & Dimensions
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition-colors border-b-2 shrink-0 ${
                activeTab === 'care'
                  ? 'border-[#8C5E3C] text-[#8C5E3C]'
                  : 'border-transparent text-[#7A6D5C] hover:text-[#2A241E]'
              }`}
            >
              Care & Wash Guidelines
            </button>
            <button
              onClick={() => setActiveTab('gifting')}
              className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition-colors border-b-2 shrink-0 ${
                activeTab === 'gifting'
                  ? 'border-[#8C5E3C] text-[#8C5E3C]'
                  : 'border-transparent text-[#7A6D5C] hover:text-[#2A241E]'
              }`}
            >
              Custom Gifting & Bulk Orders
            </button>
          </div>

          {/* Tab Contents */}
          <div className="pt-6">
            {activeTab === 'desc' && (
              <div className="space-y-4 text-xs sm:text-sm text-[#4A4032] leading-relaxed max-w-3xl">
                <p>{product.description}</p>
                {product.detailedStory && (
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD0] space-y-2">
                    <h4 className="font-serif-display font-bold text-sm text-[#2A241E]">
                      The Artisan Printing Process
                    </h4>
                    <p className="italic text-[#6B5F4F]">{product.detailedStory}</p>
                  </div>
                )}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#2A241E]">
                      Key Features:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl text-xs text-[#4A4032]">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD0]">
                  <span className="text-[#8C7E6C] font-semibold block">Canvas Weight:</span>
                  <span className="font-bold text-[#2A241E] mt-0.5">{product.material}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD0]">
                  <span className="text-[#8C7E6C] font-semibold block">Bag Dimensions:</span>
                  <span className="font-bold text-[#2A241E] mt-0.5">{product.dimensions}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD0]">
                  <span className="text-[#8C7E6C] font-semibold block">Handle Drop:</span>
                  <span className="font-bold text-[#2A241E] mt-0.5">{product.handleLength || '11" Shoulder Drop'}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD0]">
                  <span className="text-[#8C7E6C] font-semibold block">Closure Type:</span>
                  <span className="font-bold text-[#2A241E] mt-0.5">{product.closureType}</span>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-3 text-xs sm:text-sm text-[#4A4032] max-w-2xl leading-relaxed">
                <p>• <strong>Spot Clean Preferred:</strong> Use a damp cloth with mild organic soap for small stains.</p>
                <p>• <strong>Hand Wash:</strong> Cold water hand wash with gentle detergent. Avoid harsh bleaching agents.</p>
                <p>• <strong>Drying:</strong> Flat dry in shade to preserve vibrant botanical block print tones.</p>
                <p>• <strong>Ironing:</strong> Warm iron on reverse side of canvas.</p>
              </div>
            )}

            {activeTab === 'gifting' && (
              <div className="space-y-3 text-xs sm:text-sm text-[#4A4032] max-w-2xl leading-relaxed">
                <p>Looking to order this design in bulk (25+ units) for weddings, company retreats, or festive hampers?</p>
                <p>We offer customized gold foil initials, personalized bride/groom tags, and custom colorways.</p>
                <button
                  onClick={() => {
                    const msg = buildWhatsAppInquiryMessage('custom-bulk', product.name);
                    window.open(generateWhatsAppUrl(settings.whatsappNumber, msg), '_blank');
                  }}
                  className="mt-2 inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire Bulk Pricing on WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12 bg-white rounded-3xl border border-[#E8DFD0] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFD0] gap-4">
            <div>
              <h3 className="text-xl font-serif-display font-bold text-[#2A241E]">
                Customer Reviews ({productReviews.length})
              </h3>
              <p className="text-xs text-[#7A6D5C] mt-0.5">
                Authentic feedback from verified buyers who own this tote bag.
              </p>
            </div>

            <button
              onClick={() => openReviewModal(product)}
              className="px-5 py-2.5 rounded-xl bg-[#8C5E3C] hover:bg-[#A36E46] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Reviews List */}
          <div className="mt-6 space-y-4">
            {productReviews.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8A7D6C]">
                <p>No reviews yet for this specific design. Be the first to share your thoughts!</p>
                <button
                  onClick={() => openReviewModal(product)}
                  className="mt-2 text-[#8C5E3C] font-semibold underline"
                >
                  Write first review →
                </button>
              </div>
            ) : (
              productReviews.map((rev) => (
                <div key={rev._id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD0] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#2A241E]">{rev.customerName}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded-full">
                          Verified Buyer
                        </span>
                      )}
                      <span className="text-[11px] text-[#8C7E6C]">({rev.customerLocation || 'India'})</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#4A4032] leading-relaxed">"{rev.comment}"</p>
                  <span className="text-[10px] text-[#A39684] block">{formatDate(rev.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Video Preview Modal */}
        {isVideoModalOpen && product.video && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative bg-[#1A1815] rounded-3xl overflow-hidden max-w-2xl w-full border border-white/20 shadow-2xl">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white z-20"
              >
                ✕
              </button>
              <div className="p-4">
                <video
                  src={product.video}
                  controls
                  autoPlay
                  className="w-full rounded-2xl aspect-video bg-black"
                />
              </div>
              <div className="p-4 text-center text-xs text-amber-200">
                Crafted with 100% heavy canvas & hand block pigments in small artisan batches.
              </div>
            </div>
          </div>
        )}

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="mb-6 flex items-center justify-between border-b border-[#E8DFD0] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#8C5E3C]">
                  Complementary Styles
                </span>
                <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-[#2A241E]">
                  You May Also Love
                </h3>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="text-xs font-bold text-[#8C5E3C] hover:underline"
              >
                View Catalog →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
