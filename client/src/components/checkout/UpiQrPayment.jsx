import React, { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, QrCode, Sparkles, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { buildUpiPaymentLink } from '../../utils/upiPaymentBuilder';
import { formatCurrency } from '../../utils/formatters';

class QrErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn('QRCodeSVG error caught by boundary:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

export const UpiQrPayment = ({
  upiId = 'yourstorename@oksbi',
  payeeName = 'Countryside Craft',
  amount = 0,
  orderNumber = '',
}) => {
  const upiLink = useMemo(() => {
    return buildUpiPaymentLink({ upiId, payeeName, amount, orderNumber });
  }, [upiId, payeeName, amount, orderNumber]);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#B9C9E7]/50 p-4 sm:p-5 shadow-xs text-center space-y-3.5">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#EEF3FA]">
        <div className="flex items-center space-x-2 text-left">
          <div className="w-8 h-8 rounded-xl bg-[#D91680]/10 border border-[#D91680]/20 flex items-center justify-center text-[#D91680]">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif-display font-bold text-xs sm:text-sm text-[#1A1F2C]">
              Instant UPI QR Payment
            </h4>
            <p className="text-[10px] text-[#6A758E]">
              Zero gateway fee • Instant & direct
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
          Auto Pre-filled
        </span>
      </div>

      {/* QR Code Container */}
      <div className="flex flex-col items-center justify-center pt-1">
        <div className="p-3.5 sm:p-4 bg-white rounded-2xl border-2 border-dashed border-[#B9C9E7] shadow-xs inline-block relative group">
          <QrErrorBoundary
            fallback={
              <div className="w-[184px] h-[184px] flex flex-col items-center justify-center bg-[#FAF6F0] rounded-xl text-center p-3 text-[#1A1F2C]">
                <QrCode className="w-10 h-10 text-[#D91680] mb-2" />
                <span className="text-xs font-bold">UPI QR Ready</span>
                <span className="text-[10px] text-[#6A758E] mt-1">Please use Pay via UPI App button or scan via phone</span>
              </div>
            }
          >
            <QRCodeSVG
              value={upiLink}
              size={184}
              level="M"
              includeMargin={false}
              className="mx-auto block"
            />
            {/* Subtle center logo / brand indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-9 h-9 rounded-full bg-white shadow-md border border-[#EFC0DA] flex items-center justify-center">
                <span className="font-brand font-black text-[10px] text-[#D91680]">CC</span>
              </div>
            </div>
          </QrErrorBoundary>
        </div>

        {/* UPI Apps Supported Pills */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5 flex-wrap">
          <span className="text-[10px] font-bold text-[#6A758E]">Accepts:</span>
          {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
            <span
              key={app}
              className="px-2 py-0.5 rounded-md bg-[#EEF3FA]/70 text-[#2C3549] text-[10px] font-semibold border border-[#B9C9E7]/40"
            >
              {app}
            </span>
          ))}
        </div>
      </div>

      {/* Exact Amount Display */}
      <div className="py-1">
        <span className="text-[11px] font-semibold text-[#6A758E] block">
          Exact Payable Amount:
        </span>
        <span className="text-2xl sm:text-3xl font-black text-[#D91680] font-sans tracking-tight">
          {formatCurrency(amount)}
        </span>
      </div>

      {/* Helper Text */}
      <p className="text-[11px] text-[#4B566E] leading-relaxed max-w-xs mx-auto">
        Scan with any UPI app — the amount is pre-filled automatically, no need to type it in.
      </p>

      {/* Mobile-Only Pay Button */}
      <div className="sm:hidden pt-1">
        <a
          href={upiLink}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#D91680] hover:bg-[#BE0E6E] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 text-center active:scale-98"
        >
          <Smartphone className="w-4 h-4" />
          <span>Pay Now via UPI App</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
        <p className="text-[10px] text-[#6A758E] mt-1.5">
          Tap above to launch Google Pay, PhonePe, or Paytm directly
        </p>
      </div>

      {/* Merchant / VPA Info */}
      {upiId && (
        <div className="pt-2 border-t border-[#EEF3FA] flex items-center justify-between text-[10px] text-[#6A758E]">
          <span>Payee VPA:</span>
          <span className="font-mono font-semibold text-[#1A1F2C] select-all">{upiId}</span>
        </div>
      )}
    </div>
  );
};

export default UpiQrPayment;
