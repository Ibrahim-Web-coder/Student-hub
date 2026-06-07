import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/dashboard/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle, Download, AlertTriangle, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { getFees, getPayments, getPaymentStats } from '@/lib/supabase/actions';
import { cn, formatDate, formatCurrency } from '@/lib/utils/helpers';

export const dynamic = 'force-dynamic';

export default async function FeesPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.school_id) redirect('/onboarding');

  let fees: any[] = [];
  let payments: any[] = [];
  let paymentStats: any = null;
  let error = null;

  try {
    fees = await getFees(user.school_id);
    payments = await getPayments(user.school_id);
    paymentStats = await getPaymentStats(user.school_id);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Fees & Payments</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage fee structures, payments, and receipts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button variant="primary"><Plus className="w-4 h-4 mr-2" /> Add Fee</Button>
        </div>
      </div>

      {paymentStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card title="Total Collected">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${paymentStats.totalCollected.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{paymentStats.paid} payments</p>
              </div>
            </div>
          </Card>
          <Card title="Total Due">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${paymentStats.totalDue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{paymentStats.pending + paymentStats.overdue} pending</p>
              </div>
            </div>
          </Card>
          <Card title="Collection Rate">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {paymentStats.totalRecords > 0 ? Math.round((paymentStats.paid / paymentStats.totalRecords) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500">of total records</p>
              </div>
            </div>
          </Card>
          <Card title="Overdue">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{paymentStats.overdue}</p>
                <p className="text-xs text-gray-500">partial: {paymentStats.partial}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {error ? (
        <Card title="Error" description="Failed to load fee data">
          <p className="text-red-500">{error}</p>
        </Card>
      ) : payments.length === 0 ? (
        <Card title="No payment records" description="Add fees and track payments to see records here">
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <DollarSign className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-sm font-medium">No payment records found</p>
            <p className="text-xs mt-1 mb-4">Create fee categories and record payments to get started</p>
            <Button variant="primary"><Plus className="w-4 h-4 mr-2" /> Add First Fee</Button>
          </div>
        </Card>
      ) : (
        <Card title="Payment Records">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {payments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{payment.students?.full_name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{payment.fees?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">${Number(payment.amount_paid + payment.amount_due).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-emerald-500">${Number(payment.amount_paid).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-red-500">${Number(payment.amount_due).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(payment.payment_date, 'short')}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 capitalize">{payment.payment_method || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        payment.status === 'paid' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                        payment.status === 'pending' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                        payment.status === 'overdue' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                        payment.status === 'partial' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                        payment.status === 'waived' && 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
                      )}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8"><Edit className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
