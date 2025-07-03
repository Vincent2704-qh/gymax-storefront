import { axiosClient } from "@/lib/axios";

// Interface phù hợp với backend response
export interface PaypalResponse {
  id: string;
  status: string;
  payment_source: {
    paypal: {};
  };
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

// Interface cho backend wrapper response
export interface PaymentBackendResponse {
  success: boolean;
  data: PaypalResponse;
  message?: string;
  error?: string;
}

export interface CreatePaymentDto {
  amount: number;
  orderInfo: any;
}

export interface PaymentResponse {
  url: string;
}

export interface PaymentMomoResponse {
  payUrl: string;
}

export const PaymentService = {
  onCreateOrder() {
    return axiosClient.post<PaymentBackendResponse>(
      `api/payment/capture-payment`,
      {}
    );
  },

  appprovePayment(paymentId: string) {
    // string thay vì number
    return axiosClient.get(`api/payment/approve-payment/${paymentId}`);
  },

  paymentOrders(payment: CreatePaymentDto) {
    return axiosClient.post<PaymentResponse>(
      `api/payment/create-payment-url`,
      payment
    );
  },

  verifyCheckout(payment: any) {
    return axiosClient.post(`api/payment/verify-checkout`, payment);
  },

  momoPayment() {
    return axiosClient.post<PaymentMomoResponse>(
      `api/payment/momo-payment`,
      {}
    );
  },

  momoCallback() {
    return axiosClient.post(`api/payment/momo-callback`, {});
  },
};
