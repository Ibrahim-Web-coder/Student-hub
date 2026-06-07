import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/dashboard/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, Upload, FileText, Image, Video, File, Trash2, Download, Eye, ExternalLink, Calendar } from 'lucide-react';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { getFiles } from '@/lib/supabase/actions';
import { formatDate, getFileSize, isFileImage, getFileExtension } from '@/lib/utils/helpers';

export const dynamic = 'force-dynamic';

const fileIcons: Record<string, any> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  jpg: Image,
  jpeg: Image,
  png: Image,
  gif: Image,
  webp: Image,
  mp4: Video,
  mov: Video,
  default: File,
};

export default async function FilesPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.school_id) redirect('/onboarding');

  let files: any[] = [];

  try {
    files = await getFiles(user.school_id);
  } catch {}

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Files</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage uploaded documents, images, and attachments</p>
        </div>
        <Button variant="primary">
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card title="Total Files">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{files.length}</p>
        </Card>
        <Card title="Storage Used">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {files.reduce((sum, f) => sum + (f.file_size || 0), 0) > 0 ? getFileSize(files.reduce((sum, f) => sum + (f.file_size || 0), 0)) : '0 Bytes'}
          </p>
        </Card>
        <Card title="Last Upload">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {files.length > 0 ? formatDate(files[0].created_at, 'relative') : 'Never'}
          </p>
        </Card>
      </div>

      {files.length === 0 ? (
        <Card title="No files uploaded" description="Upload documents, images, and attachments to manage them here">
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FolderOpen className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-sm font-medium">No files found</p>
            <p className="text-xs mt-1 mb-4">Upload your first file to get started</p>
            <Button variant="primary"><Upload className="w-4 h-4 mr-2" /> Upload Files</Button>
          </div>
        </Card>
      ) : (
        <Card title="File Library">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {files.map((file: any) => {
                  const ext = getFileExtension(file.original_name);
                  const Icon = fileIcons[ext] || fileIcons.default;

                  return (
                    <tr key={file.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">{file.original_name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{file.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge badge-info">{ext.toUpperCase()}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{getFileSize(file.file_size || 0)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(file.created_at, 'short')}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="w-8 h-8"><Download className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
