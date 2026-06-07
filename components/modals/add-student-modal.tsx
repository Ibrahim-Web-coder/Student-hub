'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { StudentForm } from '@/components/forms/student-form';

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  classes?: any[];
  sections?: any[];
  parents?: any[];
}

export function AddStudentModal({ open, onOpenChange, onSubmit, classes, sections, parents }: AddStudentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Add New Student" description="Fill in the student information below">
        <StudentForm onSubmit={onSubmit} classes={classes} sections={sections} parents={parents} />
      </DialogContent>
    </Dialog>
  );
}
