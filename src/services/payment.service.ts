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

export interface MoMoOrderDto {
  amount?: number;
  orderInfo?: string;
}

export interface PaypalPaymentResponse {
  data: {
    status: string;
  };
}

export interface VnpayResponse {
  checked: boolean;
  orderInfo: any;
}

export interface MomoResponse {
  momoData: {
    resultCode: number;
  };
}

export const PaymentService = {
  onCreateOrder(payload: any) {
    return axiosClient.post<PaymentBackendResponse>(
      `api/payment/capture-payment`,
      payload
    );
  },

  appprovePayment(paymentId: string) {
    // string thay vì number
    return axiosClient.get<PaypalPaymentResponse>(
      `api/payment/approve-payment/${paymentId}`
    );
  },

  paymentOrders(payment: CreatePaymentDto) {
    return axiosClient.post<PaymentResponse>(
      `api/payment/create-payment-url`,
      payment
    );
  },

  verifyCheckout(payment: any) {
    return axiosClient.post<VnpayResponse>(
      `api/payment/verify-checkout`,
      payment
    );
  },

  momoPayment(body: MoMoOrderDto) {
    return axiosClient.post<PaymentMomoResponse>(
      `api/payment/momo-payment`,
      body
    );
  },

  momoCallback(payment: any) {
    return axiosClient.post<MomoResponse>(`api/payment/momo-callback`, payment);
  },
};
