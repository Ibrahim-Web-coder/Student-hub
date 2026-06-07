import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/dashboard/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Upload, Palette, Globe, Bell, Shield, Building, Save, Check } from 'lucide-react';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.school_id) redirect('/onboarding');

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your school workspace configuration</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card title="School Information" description="Basic information about your institution" action={<Button variant="outline" size="sm"><Save className="w-4 h-4 mr-2" /> Save</Button>}>
          <div className="space-y-4">
            <Input label="School Name" placeholder="Your school name" />
            <Input label="School Code" placeholder="e.g. GFA" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Email" placeholder="school@example.com" type="email" />
              <Input label="Phone" placeholder="+1 (555) 000-0000" type="tel" />
            </div>
            <Input label="Address" placeholder="123 Education Street" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="City" placeholder="New York" />
              <Input label="State" placeholder="NY" />
              <Input label="Country" placeholder="United States" />
            </div>
            <Input label="Website" placeholder="https://yourschool.edu" />
          </div>
        </Card>

        <Card title="Academic Year" description="Configure your academic calendar" action={<Button variant="outline" size="sm"><Check className="w-4 h-4 mr-2" /> Apply</Button>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Academic Year Start" type="date" />
            <Input label="Academic Year End" type="date" />
            <select className="rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
              <option value="">Select Timezone</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
            <select className="rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
        </Card>

        <Card title="Branding" description="Customize your school identity" action={<Button variant="outline" size="sm"><Palette className="w-4 h-4 mr-2" /> Customize</Button>}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">School Logo</p>
                <p className="text-xs text-gray-500">PNG, JPG, or SVG up to 2MB</p>
                <Button variant="outline" size="sm" className="mt-2">Upload</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700" defaultValue="#3B82F6" />
                  <Input defaultValue="#3B82F6" className="font-mono text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700" defaultValue="#1E40AF" />
                  <Input defaultValue="#1E40AF" className="font-mono text-sm" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Notification Preferences" description="Manage how you receive notifications" action={<Button variant="outline" size="sm"><Bell className="w-4 h-4 mr-2" /> Update</Button>}>
          <div className="space-y-4">
            {[
              { label: 'Email Notifications', description: 'Receive notifications via email', defaultChecked: true },
              { label: 'SMS Notifications', description: 'Receive notifications via text message', defaultChecked: false },
              { label: 'In-App Notifications', description: 'Show notifications within the platform', defaultChecked: true },
              { label: 'Attendance Alerts', description: 'Notify when attendance drops below threshold', defaultChecked: true },
              { label: 'Fee Reminders', description: 'Send automatic fee payment reminders', defaultChecked: true },
              { label: 'Assignment Deadlines', description: 'Notify about upcoming assignment due dates', defaultChecked: true },
            ].map((item: any) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <input type="checkbox" defaultChecked={item.defaultChecked} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
