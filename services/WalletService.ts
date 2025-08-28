export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  reference?: string;
  status: 'completed' | 'pending' | 'failed';
}

export class WalletService {
  private static instance: WalletService;
  private balance: number = 12750; // Mock balance in CFA
  private transactions: Transaction[] = [];

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
      WalletService.instance.initMockData();
    }
    return WalletService.instance;
  }

  private initMockData(): void {
    this.transactions = [
      {
        id: '1',
        type: 'debit',
        amount: 8500,
        description: 'Trip to Airport',
        date: '2025-01-15T09:15:00Z',
        reference: 'trip_001',
        status: 'completed',
      },
      {
        id: '2',
        type: 'credit',
        amount: 10000,
        description: 'Wallet Top-up (Airtel Money)',
        date: '2025-01-15T08:00:00Z',
        reference: 'topup_001',
        status: 'completed',
      },
      {
        id: '3',
        type: 'debit',
        amount: 3200,
        description: 'Trip to Market',
        date: '2025-01-12T14:45:00Z',
        reference: 'trip_002',
        status: 'completed',
      },
      {
        id: '4',
        type: 'credit',
        amount: 5000,
        description: 'Referral Bonus',
        date: '2025-01-10T12:00:00Z',
        reference: 'ref_001',
        status: 'completed',
      },
    ];
  }

  async getBalance(): Promise<number> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.balance;
  }

  async getTransactions(limit: number = 20, offset: number = 0): Promise<Transaction[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sorted = [...this.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return sorted.slice(offset, offset + limit);
  }

  async debitWallet(amount: number, description: string, reference?: string): Promise<Transaction> {
    if (this.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'debit',
      amount,
      description,
      date: new Date().toISOString(),
      reference,
      status: 'completed',
    };

    this.balance -= amount;
    this.transactions.unshift(transaction);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return transaction;
  }

  async creditWallet(amount: number, description: string, reference?: string): Promise<Transaction> {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'credit',
      amount,
      description,
      date: new Date().toISOString(),
      reference,
      status: 'completed',
    };

    this.balance += amount;
    this.transactions.unshift(transaction);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return transaction;
  }

  async topUpWallet(amount: number, paymentMethod: string): Promise<boolean> {
    try {
      await this.creditWallet(amount, `Wallet Top-up (${paymentMethod})`, `topup_${Date.now()}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get wallet summary for analytics
  async getWalletSummary(period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
    const now = new Date();
    const periodStart = new Date();
    
    switch (period) {
      case 'week':
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'month':
        periodStart.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        periodStart.setFullYear(now.getFullYear() - 1);
        break;
    }

    const periodTransactions = this.transactions.filter(
      t => new Date(t.date) >= periodStart
    );

    const credits = periodTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const debits = periodTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      currentBalance: this.balance,
      periodCredits: credits,
      periodDebits: debits,
      netChange: credits - debits,
      transactionCount: periodTransactions.length,
    };
  }
}

export default WalletService.getInstance();