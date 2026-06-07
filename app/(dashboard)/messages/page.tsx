import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/dashboard/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Search, MessageSquare, User, Clock, CheckCheck, ChevronRight } from 'lucide-react';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { getMessages } from '@/lib/supabase/actions';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.school_id) redirect('/onboarding');

  let messages: any[] = [];

  try {
    messages = await getMessages(user.id);
  } catch {}

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Communicate with teachers, parents, and students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <Card title="Conversations" className="col-span-1 overflow-hidden flex flex-col">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
            />
          </div>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 flex-1">
              <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No conversations yet</p>
              <p className="text-xs mt-1 text-center">Start a conversation to see it here</p>
            </div>
          ) : (
            <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
              {messages.map((msg: any) => (
                <div key={msg.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {(msg.sender?.full_name || 'U')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {msg.sender?.full_name || 'Unknown'}
                      </p>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Chat" className="col-span-1 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Select a conversation</p>
              <p className="text-xs mt-1">Choose a conversation from the left to start messaging</p>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
            />
            <Button variant="primary" size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
