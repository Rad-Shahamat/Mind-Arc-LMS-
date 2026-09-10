import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  X,
  ArrowRight
} from 'lucide-react';
import { Notice, TabId } from '../types';

interface NoticeStackProps {
  notices: Notice[];
  dismissedIds: Record<string, boolean>;
  onDismiss: (id: string) => void;
  onNavigate: (tab: TabId) => void;
}

export const NoticeStack: React.FC<NoticeStackProps> = ({
  notices,
  dismissedIds,
  onDismiss,
  onNavigate
}) => {
  const visibleNotices = notices.filter(n => !dismissedIds[n.id]);

  if (visibleNotices.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {visibleNotices.map((notice) => {
        let borderClass = 'border-l-[#14e6ff]';
        let iconBg = 'bg-[#14e6ff]/15 text-[#14e6ff] border-[#14e6ff]/30';
        let Icon = Info;

        if (notice.type === 'warning') {
          borderClass = 'border-l-[#c9a253]';
          iconBg = 'bg-[#c9a253]/15 text-[#c9a253] border-[#c9a253]/30';
          Icon = AlertTriangle;
        } else if (notice.type === 'success') {
          borderClass = 'border-l-[#25D366]';
          iconBg = 'bg-[#25D366]/15 text-[#25D366] border-[#25D366]/30';
          Icon = CheckCircle2;
        } else if (notice.type === 'danger') {
          borderClass = 'border-l-[#e2635a]';
          iconBg = 'bg-[#e2635a]/15 text-[#e2635a] border-[#e2635a]/30';
          Icon = XCircle;
        }

        return (
          <div
            key={notice.id}
            className={`
              relative flex items-start gap-3.5 p-4 rounded-2xl
              bg-[#050e33]/70 backdrop-blur-xl border border-white/10
              ${borderClass} border-l-4 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)]
              transition-all hover:border-white/20
            `}
          >
            {/* Icon */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${iconBg}`}>
              <Icon className="w-4 h-4" />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-['Sora'] font-bold text-sm text-white tracking-tight">
                  {notice.title}
                </h4>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-white/[0.06] text-[#8d99b3]">
                  {notice.type}
                </span>
              </div>
              <p className="text-xs text-[#8d99b3] leading-relaxed">
                {notice.text}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => onDismiss(notice.id)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-[#8d99b3] hover:text-white transition-colors"
              title="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
