import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { Notice } from '../types';
import { formatDate, formatTime } from '../utils/formatters';

interface AnnouncementsTabProps {
  notices: Notice[];
  dismissedIds: Record<string, boolean>;
  onToggleRead: (id: string) => void;
}

export const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({
  notices,
  dismissedIds,
  onToggleRead
}) => {
  const sorted = [...notices].sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="text-sm text-[#8d99b3]">
          Official notifications, schedule changes, and faculty updates
        </div>
        <div className="text-xs text-[#14e6ff] font-mono">
          {notices.length} Total Bulletin Posts
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map(notice => {
          const isRead = !!dismissedIds[notice.id];

          let borderCls = 'border-l-[#14e6ff]';
          let iconBg = 'bg-[#14e6ff]/15 text-[#14e6ff] border-[#14e6ff]/30';
          let Icon = Info;

          if (notice.type === 'warning') {
            borderCls = 'border-l-[#c9a253]';
            iconBg = 'bg-[#c9a253]/15 text-[#c9a253] border-[#c9a253]/30';
            Icon = AlertTriangle;
          } else if (notice.type === 'success') {
            borderCls = 'border-l-[#25D366]';
            iconBg = 'bg-[#25D366]/15 text-[#25D366] border-[#25D366]/30';
            Icon = CheckCircle2;
          } else if (notice.type === 'danger') {
            borderCls = 'border-l-[#e2635a]';
            iconBg = 'bg-[#e2635a]/15 text-[#e2635a] border-[#e2635a]/30';
            Icon = XCircle;
          }

          return (
            <div
              key={notice.id}
              className={`
                glass-panel rounded-2xl p-5 border-l-4 ${borderCls} transition-all
                ${isRead ? 'opacity-65 hover:opacity-100' : 'shadow-[0_10px_30px_-15px_rgba(20,230,255,0.15)]'}
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                    <div className="flex items-center gap-2">
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#14e6ff] shadow-[0_0_8px_#14e6ff] animate-pulse" />
                      )}
                      <h4 className="font-['Sora'] font-bold text-sm sm:text-base text-white">
                        {notice.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#8d99b3] font-mono">
                      <Calendar className="w-3 h-3 text-[#8d99b3]" />
                      <span>{formatDate(notice.postedAt)} · {formatTime(notice.postedAt)}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#8d99b3] leading-relaxed my-3">
                    {notice.text}
                  </p>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => onToggleRead(notice.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-[#8d99b3] hover:text-white flex items-center gap-1.5 transition-all"
                    >
                      {isRead ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Mark as unread</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Mark as read</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
