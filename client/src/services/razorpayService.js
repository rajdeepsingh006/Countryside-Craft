import api from './api';

/**
 * Loads Razorpay Standard Checkout SDK if not already loaded in the document
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const razorpayService = {
  /**
   * STEP 1: Calls backend POST /api/create-order
   * @param {Object} data - { amount (paise), currency, receipt, notes }
   */
  async createOrder({ amount, currency = 'INR', receipt, notes = {} }) {
    const res = await api.post('/create-order', {
      amount,
      currency,
      receipt,
      notes,
    });
    return res.data;
  },

  /**
   * STEP 3: Calls backend POST /api/verify-payment
   * @param {Object} data - { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }
   */
  async verifyPayment(paymentData) {
    const res = await api.post('/verify-payment', paymentData);
    return res.data;
  },

  /**
   * Opens the Razorpay Standard Checkout modal
   */
  async openCheckout({
    order_id,
    amount,
    currency = 'INR',
    key_id,
    name = 'Countryside Craft',
    description = 'Handcrafted Tote Bags & Sustainable Goods',
    image = '/images/categories/handpainted-jute.jpg',
    prefill = {},
    theme = { color: '#D91680' },
    onSuccess,
    onFailure,
    onDismiss,
  }) {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      throw new Error('Razorpay SDK failed to load. Please check your internet connection and try again.');
    }

    const key = key_id || import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      throw new Error('Razorpay Key ID is not configured (VITE_RAZORPAY_KEY_ID).');
    }

    const options = {
      key,
      amount,
      currency,
      name,
      description,
      image,
      order_id,
      handler: async function (response) {
        // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
        try {
          if (onSuccess) {
            await onSuccess({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          }
        } catch (err) {
          if (onFailure) {
            onFailure(err.message || 'Payment verification failed');
          }
        }
      },
      prefill: {
        name: prefill.name || '',
        email: prefill.email || '',
        contact: prefill.phone || '',
      },
      notes: prefill.notes || {},
      theme: {
        color: theme.color || '#D91680',
      },
      modal: {
        ondismiss: function () {
          if (onDismiss) {
            onDismiss();
          }
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      const errorMsg =
        response.error?.description ||
        response.error?.reason ||
        'Payment could not be completed. Please try again.';
      if (onFailure) {
        onFailure(errorMsg, response.error);
      }
    });

    rzp.open();
    return rzp;
  },
};
