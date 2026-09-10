import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  ExternalLink, 
  Copy, 
  Check, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Student } from '../types';

interface SupportTabProps {
  student: Student;
}

export const SupportTab: React.FC<SupportTabProps> = ({ student }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(student.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const supportChannels = [
    {
      name: 'WhatsApp Support',
      desc: 'Chat directly with academic advisors — average reply within minutes',
      btnText: 'Open WhatsApp',
      href: 'https://wa.me/8801712345678',
      color: '#25D366',
      icon: MessageSquare
    },
    {
      name: 'Telegram Channel & Bot',
      desc: 'Join the student support group for instant broadcast alerts & assistance',
      btnText: 'Open Telegram',
      href: 'https://t.me/mindarc_support',
      color: '#229ED9',
      icon: Send
    },
    {
      name: 'Facebook Messenger',
      desc: 'Connect with Mind Arc community managers on our official page',
      btnText: 'Open Facebook',
      href: 'https://facebook.com/mindarcbd',
      color: '#1877F2',
      customIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M15.1 8.4h2.2V5.1c-.4-.05-1.7-.16-3.2-.16-3.2 0-5.4 2-5.4 5.6v2.9H5.4v3.7h3.3V21h3.8v-3.86h3.2l.5-3.7h-3.7v-2.5c0-1.06.3-1.79 1.6-1.79z" />
        </svg>
      )
    },
    {
      name: 'Direct Phone Helpline',
      desc: '+880 1712-345678 · Available Sat–Thu, 10:00 AM to 9:00 PM',
      btnText: 'Call Helpline',
      href: 'tel:+8801712345678',
      color: '#22c55e',
      icon: Phone
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportChannels.map((channel, i) => {
          const Icon = channel.icon;

          return (
            <div
              key={i}
              className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-lg group-hover:scale-105 transition-transform"
                  style={{ 
                    backgroundColor: channel.color, 
                    boxShadow: `0 0 25px ${channel.color}50` 
                  }}
                >
                  {channel.customIcon ? channel.customIcon : (Icon && <Icon className="w-6 h-6" />)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-['Sora'] font-bold text-base text-white group-hover:text-[#14e6ff] transition-colors">
                    {channel.name}
                  </h3>
                  <p className="text-xs text-[#8d99b3] leading-relaxed mt-1.5">
                    {channel.desc}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.08]">
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-white text-[#01021c] font-['Sora'] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#eef8fa] transition-all shadow-[0_4px_15px_rgba(255,255,255,0.2)] hover:scale-[1.02]"
                >
                  <span>{channel.btnText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expedited Support Student ID Info Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14e6ff]/15 text-[#14e6ff] border border-[#14e6ff]/30 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-white font-medium">
              Facing an issue with a class link, recording playback, or test submission?
            </div>
            <div className="text-[11px] text-[#8d99b3] mt-0.5">
              Please share your Student ID <strong className="text-[#14e6ff] font-mono">({student.id})</strong> and course title for priority resolution.
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyId}
          className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-semibold text-white flex items-center gap-2 transition-all flex-shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#25D366]" /> : <Copy className="w-3.5 h-3.5 text-[#14e6ff]" />}
          <span>{copied ? 'Copied ID' : 'Copy ID'}</span>
        </button>
      </div>
    </div>
  );
};
