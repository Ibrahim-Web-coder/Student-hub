'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

interface StudentFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  classes?: any[];
  sections?: any[];
  parents?: any[];
}

export function StudentForm({ onSubmit, initialData, classes = [], sections = [], parents = [] }: StudentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || '',
    gender: initialData?.gender || '',
    date_of_birth: initialData?.date_of_birth || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    country: initialData?.country || '',
    class_id: initialData?.class_id || '',
    section_id: initialData?.section_id || '',
    parent_id: initialData?.parent_id || '',
    blood_group: initialData?.blood_group || '',
    emergency_contact: initialData?.emergency_contact || '',
    medical_notes: initialData?.medical_notes || '',
    admission_date: initialData?.admission_date || new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to save student' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-600 dark:text-red-400">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" value={formData.full_name} onChange={(e) => handleChange('full_name', e.target.value)} error={errors.full_name} required />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
          <select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)} className={`w-full rounded-xl border bg-white/50 dark:bg-gray-900/50 px-3 py-2.5 text-sm ${errors.gender ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
        </div>
        <Input type="date" label="Date of Birth" value={formData.date_of_birth} onChange={(e) => handleChange('date_of_birth', e.target.value)} error={errors.date_of_birth} required />
        <Input type="email" label="Email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} error={errors.email} />
        <Input type="tel" label="Phone" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
        <Input label="Address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} />
        <Input label="City" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} />
        <Input label="State" value={formData.state} onChange={(e) => handleChange('state', e.target.value)} />
        <Input label="Country" value={formData.country} onChange={(e) => handleChange('country', e.target.value)} />
        <Input label="Blood Group" value={formData.blood_group} onChange={(e) => handleChange('blood_group', e.target.value)} />
        <Input label="Emergency Contact" value={formData.emergency_contact} onChange={(e) => handleChange('emergency_contact', e.target.value)} />
        <Input type="date" label="Admission Date" value={formData.admission_date} onChange={(e) => handleChange('admission_date', e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Class</label>
          <select value={formData.class_id} onChange={(e) => handleChange('class_id', e.target.value)} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-3 py-2.5 text-sm">
            <option value="">Select class</option>
            {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Section</label>
          <select value={formData.section_id} onChange={(e) => handleChange('section_id', e.target.value)} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-3 py-2.5 text-sm">
            <option value="">Select section</option>
            {sections.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Parent/Guardian</label>
        <select value={formData.parent_id} onChange={(e) => handleChange('parent_id', e.target.value)} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-3 py-2.5 text-sm">
          <option value="">Select parent</option>
          {parents.map((p: any) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Medical Notes</label>
        <textarea value={formData.medical_notes} onChange={(e) => handleChange('medical_notes', e.target.value)} rows={3} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-3 py-2.5 text-sm resize-none" placeholder="Any medical conditions or notes..." />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => {}}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : initialData ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
}
