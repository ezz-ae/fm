"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { cn } from "@/lib/utils";

const PayPalIntegration = ({ 
  amount, 
  onSuccess, 
  onCancel 
}: { 
  amount: string, 
  onSuccess: (details: any) => void,
  onCancel: () => void
}) => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

  return (
    <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
      <PayPalScriptProvider options={{ "client-id": clientId, currency: "USD" }}>
        <PayPalButtons
          style={{ 
            layout: "vertical",
            color: "black",
            shape: "rect",
            label: "pay",
            height: 55
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                {
                  amount: {
                    value: amount,
                    currency_code: "USD"
                  },
                  description: "AIMAS Protocol: Neural Trace Archive"
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            const details = await actions.order?.capture();
            onSuccess(details);
          }}
          onCancel={onCancel}
        />
      </PayPalScriptProvider>
      <div className="flex justify-center gap-4 text-[8px] tracking-[0.4em] uppercase text-primary/20">
         <span>Secure Protocol</span>
         <span className="w-1 h-1 bg-primary/20 rounded-full mt-1.5" />
         <span>End-to-End Encryption</span>
      </div>
    </div>
  );
};

export default PayPalIntegration;
