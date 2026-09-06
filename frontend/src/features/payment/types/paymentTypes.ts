export interface PaymentOrderResponse {
  attemptRef: string;
  providerOrderId: string;
  razorpayKeyId: string;
  amountPaise: number;
  currency: string;
  invoiceId: number;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentAttempt {
  id: number;
  attemptRef: string;
  invoiceId: number;
  provider: string;
  providerOrderId: string;
  providerPaymentId?: string;
  amountPaise: number;
  currency: string;
  status: string;
  createdAt: string;
  signatureVerifiedAt?: string;
  capturedAt?: string;
  failureCode?: string;
  failureDescription?: string;
}
