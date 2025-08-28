import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet, CreditCard, Smartphone, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { PaymentService } from '@/services/PaymentService';
import { WalletService } from '@/services/WalletService';
import { useTranslation } from 'react-i18next';

export default function WalletScreen() {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [walletBalance, walletTransactions, methods] = await Promise.all([
        WalletService.getBalance(),
        WalletService.getTransactions(),
        PaymentService.getPaymentMethods(),
      ]);
      
      setBalance(walletBalance);
      setTransactions(walletTransactions);
      setPaymentMethods(methods);
    } catch (error) {
      Alert.alert(t('alerts.error'), t('alerts.loadWalletFailed'));
    }
  };

  const handleTopUp = () => {
    Alert.alert(
      t('wallet.topUp'),
      t('wallet.selectAmount'),
      [
        { text: '1,000 CFA', onPress: () => processTopUp(1000) },
        { text: '5,000 CFA', onPress: () => processTopUp(5000) },
        { text: '10,000 CFA', onPress: () => processTopUp(10000) },
        { text: t('buttons.cancel'), style: 'cancel' },
      ]
    );
  };

  const processTopUp = async (amount) => {
    try {
      const result = await PaymentService.topUpWallet(amount, 'mobile-money');
      if (result.success) {
        setBalance(prev => prev + amount);
        Alert.alert(t('alerts.success'), t('wallet.topUpSuccess'));
      }
    } catch (error) {
      Alert.alert(t('alerts.error'), t('wallet.topUpFailed'));
    }
  };

  const addPaymentMethod = () => {
    Alert.alert(
      t('wallet.addPaymentMethod'),
      t('wallet.selectPaymentType'),
      [
        { text: 'M-Pesa', onPress: () => addMobileMoney('mpesa') },
        { text: 'MTN MoMo', onPress: () => addMobileMoney('mtn') },
        { text: 'Airtel Money', onPress: () => addMobileMoney('airtel') },
        { text: t('buttons.cancel'), style: 'cancel' },
      ]
    );
  };

  const addMobileMoney = async (provider) => {
    // Mock adding mobile money account
    const newMethod = {
      id: Date.now().toString(),
      type: 'mobile-money',
      provider: provider,
      alias: `*****${Math.floor(Math.random() * 10000)}`,
      isDefault: paymentMethods.length === 0,
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    Alert.alert(t('alerts.success'), t('wallet.paymentMethodAdded'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('wallet.title')}</Text>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Wallet size={24} color="#10B981" />
            <Text style={styles.balanceLabel}>{t('wallet.currentBalance')}</Text>
          </View>
          <Text style={styles.balanceAmount}>{balance.toLocaleString()} CFA</Text>
          <TouchableOpacity style={styles.topUpButton} onPress={handleTopUp}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.topUpText}>{t('wallet.topUp')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('wallet.paymentMethods')}</Text>
            <TouchableOpacity onPress={addPaymentMethod}>
              <Plus size={20} color="#10B981" />
            </TouchableOpacity>
          </View>

          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentMethodCard}>
              {method.type === 'mobile-money' ? (
                <Smartphone size={20} color="#10B981" />
              ) : (
                <CreditCard size={20} color="#10B981" />
              )}
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodProvider}>
                  {method.provider?.toUpperCase() || t('wallet.card')}
                </Text>
                <Text style={styles.paymentMethodAlias}>{method.alias}</Text>
              </View>
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>{t('wallet.default')}</Text>
                </View>
              )}
            </View>
          ))}

          {paymentMethods.length === 0 && (
            <TouchableOpacity style={styles.addMethodButton} onPress={addPaymentMethod}>
              <Plus size={20} color="#6B7280" />
              <Text style={styles.addMethodText}>{t('wallet.addFirst')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('wallet.recentTransactions')}</Text>
          
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionIcon}>
                {transaction.type === 'debit' ? (
                  <ArrowUpRight size={16} color="#EF4444" />
                ) : (
                  <ArrowDownRight size={16} color="#10B981" />
                )}
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.type === 'debit' ? '#EF4444' : '#10B981' }
              ]}>
                {transaction.type === 'debit' ? '-' : '+'}{transaction.amount.toLocaleString()} CFA
              </Text>
            </View>
          ))}

          {transactions.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t('wallet.noTransactions')}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
  },
  topUpText: {
    marginLeft: 4,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentMethodProvider: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  paymentMethodAlias: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  defaultText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  addMethodText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6B7280',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});