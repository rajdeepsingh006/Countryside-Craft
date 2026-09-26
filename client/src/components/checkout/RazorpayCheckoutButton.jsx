import React, { useState } from 'react';
import { CreditCard, Loader2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { razorpayService } from '../../services/razorpayService';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

export const RazorpayCheckoutButton = ({
  amount,
  customer = {},
  orderId = null,
  notes = {},
  onBeforePay = null,
  onPaymentSuccess,
  onPaymentFailure,
  className = '',
  buttonText = 'Pay Securely with Razorpay',
  disabled = false,
  showTrustBadge = true,
}) => {
  const { showToast, settings } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);

  const handlePay = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (disabled || isLoading) return;

    if (onBeforePay && !onBeforePay()) {
      return;
    }

    // Validate amount
    const amountInRupees = Number(amount);
    if (!amountInRupees || amountInRupees <= 0) {
      showToast('Invalid order amount for payment.', 'error');
      return;
    }

    const amountInPaise = Math.round(amountInRupees * 100);
    if (amountInPaise < 100) {
      showToast('Minimum payable amount is ₹1.00 (100 paise).', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create order on backend
      const orderData = await razorpayService.createOrder({
        amount: amountInPaise,
        currency: 'INR',
        receipt: orderId ? `rcpt_${orderId.slice(-8)}` : `rcpt_${Date.now().toString().slice(-8)}`,
        notes: {
          customerName: customer.name || '',
          customerPhone: customer.phone || '',
          ...notes,
        },
      });

      if (!orderData || !orderData.order_id) {
        throw new Error(orderData?.message || 'Failed to initialize Razorpay order.');
      }

      // 2. Open Razorpay modal
      await razorpayService.openCheckout({
        order_id: orderData.order_id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        key_id: orderData.key_id,
        name: settings?.storeName || 'Countryside Craft',
        description: `Order Payment (${formatCurrency(amountInRupees)})`,
        prefill: {
          name: customer.name || '',
          email: customer.email || '',
          phone: customer.phone || '',
        },
        theme: {
          color: '#D91680', // Countryside Craft primary pink
        },
        onSuccess: async (paymentResponse) => {
          try {
            // 3. Verify payment signature on backend
            const verificationResult = await razorpayService.verifyPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              orderId,
            });

            if (verificationResult.success) {
              setPaymentSuccess(true);
              showToast('Payment verified successfully! 🎉', 'success');
              if (onPaymentSuccess) {
                onPaymentSuccess({
                  ...paymentResponse,
                  orderId,
                  verification: verificationResult,
                });
              }
            } else {
              throw new Error(verificationResult.message || 'Signature verification failed.');
            }
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            const msg = verifyErr.response?.data?.message || verifyErr.message || 'Payment signature verification failed.';
            showToast(msg, 'error');
            if (onPaymentFailure) onPaymentFailure(msg);
          } finally {
            setIsLoading(false);
          }
        },
        onFailure: (errorMsg) => {
          setIsLoading(false);
          showToast(errorMsg || 'Payment failed or was declined. Please try again.', 'error');
          if (onPaymentFailure) onPaymentFailure(errorMsg);
        },
        onDismiss: () => {
          setIsLoading(false);
          showToast('Payment window closed. You can retry whenever you are ready.', 'info');
        },
      });
    } catch (err) {
      console.error('Razorpay checkout initiation error:', err);
      setIsLoading(false);
      const isAuth = err.response?.status === 401 || err.response?.data?.message?.includes('authentication');
      setIsAuthError(Boolean(isAuth));
      const msg = err.response?.data?.message || err.message || 'Unable to connect to Razorpay. Please try again.';
      setErrorMessage(msg);
      showToast(msg, 'error');
      if (onPaymentFailure) onPaymentFailure(msg);
    }
  };

  return (
    <div className="w-full space-y-2.5">
      <button
        type="button"
        id="razorpay-pay-button"
        onClick={(e) => {
          setErrorMessage('');
          setIsAuthError(false);
          handlePay(e);
        }}
        disabled={disabled || isLoading || paymentSuccess}
        className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center space-x-2.5 active:scale-98 cursor-pointer ${
          paymentSuccess
            ? 'bg-emerald-600 text-white cursor-default'
            : disabled
            ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300'
            : 'bg-[#D91680] hover:bg-[#BE0E6E] text-white border border-[#EFC0DA]'
        } ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connecting to Razorpay...</span>
          </>
        ) : paymentSuccess ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Payment Completed ✓</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1.5 animate-fadeIn">
          <div className="font-semibold flex items-center gap-1.5 text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{isAuthError ? 'Razorpay Credentials Rejected (401)' : 'Payment Initialization Error'}</span>
          </div>
          <p className="leading-relaxed">{errorMessage}</p>
          {isAuthError && (
            <p className="text-[11px] text-rose-700 leading-relaxed pt-1 border-t border-rose-200/70">
              💡 <strong>Action Required:</strong> The API Key ID or Secret in your <code>.env</code> file was rejected by Razorpay. Please generate a fresh test key pair in your{' '}
              <a
                href="https://dashboard.razorpay.com/#/app/keys"
                target="_blank"
                rel="noreferrer"
                className="underline font-bold text-rose-900 hover:text-black"
              >
                Razorpay Dashboard (Test Mode &gt; API Keys)
              </a>{' '}
              and update <code>server/.env</code> and <code>client/.env</code>.
            </p>
          )}
        </div>
      )}

      {showTrustBadge && (
        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#6A758E]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured by Razorpay • UPI, Cards, NetBanking &amp; Wallets</span>
        </div>
      )}
    </div>
  );
};
