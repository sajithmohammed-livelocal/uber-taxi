export interface PaymentMethod {
  id: string;
  type: 'mobile-money' | 'card' | 'cash';
  provider: string;
  alias: string;
  isDefault: boolean;
}

export class PaymentService {
  private static instance: PaymentService;
  private paymentMethods: PaymentMethod[] = [];

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
      PaymentService.instance.initMockData();
    }
    return PaymentService.instance;
  }

  private initMockData(): void {
    this.paymentMethods = [
      {
        id: '1',
        type: 'mobile-money',
        provider: 'airtel',
        alias: '*****4567',
        isDefault: true,
      },
    ];
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.paymentMethods];
  }

  async addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString(),
    };

    this.paymentMethods.push(newMethod);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return newMethod;
  }

  async processPayment(amount: number, paymentMethodId: string, tripId?: string): Promise<any> {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock payment result
    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}`,
        amount,
        currency: 'CFA',
        status: 'completed',
      };
    } else {
      throw new Error('Payment failed. Please try again.');
    }
  }

  async topUpWallet(amount: number, paymentMethodType: string): Promise<any> {
    // Simulate mobile money top-up
    await new Promise(resolve => setTimeout(resolve, 3000));

    const success = Math.random() > 0.15; // 85% success rate

    if (success) {
      return {
        success: true,
        transactionId: `topup_${Date.now()}`,
        amount,
        currency: 'CFA',
        method: paymentMethodType,
        status: 'completed',
      };
    } else {
      throw new Error('Top-up failed. Please check your mobile money account.');
    }
  }

  // Mobile Money specific methods
  async chargeMobileMoney(provider: string, phoneNumber: string, amount: number): Promise<any> {
    const mockProviders = {
      mpesa: { code: '123456', message: 'Enter your M-Pesa PIN' },
      mtn: { code: '654321', message: 'Enter your MTN MoMo PIN' },
      airtel: { code: '789012', message: 'Enter your Airtel Money PIN' },
    };

    // Simulate OTP/PIN request
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      requiresPinEntry: true,
      message: mockProviders[provider]?.message || 'Enter your PIN',
      transactionRef: `mm_${Date.now()}`,
    };
  }

  async confirmMobileMoneyPayment(transactionRef: string, pin: string): Promise<any> {
    // Simulate PIN verification
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = pin.length >= 4; // Simple validation

    if (success) {
      return {
        success: true,
        transactionId: transactionRef,
        status: 'completed',
        message: 'Payment successful',
      };
    } else {
      throw new Error('Invalid PIN. Please try again.');
    }
  }
}

export default PaymentService.getInstance();