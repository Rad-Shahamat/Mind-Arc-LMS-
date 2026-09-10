import React, { useRef, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  BookOpen, 
  CalendarCheck, 
  CalendarClock, 
  Video, 
  Copy, 
  Check, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Student, Course, UpcomingClass, Recording } from '../types';

interface ProfileTabProps {
  student: Student;
  courses: Course[];
  upcomingClasses: UpcomingClass[];
  recordings: Recording[];
  onUpdateAvatar: (url: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  student,
  courses,
  upcomingClasses,
  recordings,
  onUpdateAvatar
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoHint, setPhotoHint] = useState('Tap the camera icon to upload a custom avatar');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoHint('Please choose an image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setPhotoHint('Image is over 8MB — please choose a smaller file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onUpdateAvatar(event.target.result);
        setPhotoHint('Avatar updated successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const attendedCount = recordings.filter(r => r.attendance === 'present').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Identity Card */}
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col">
          {/* Top Banner Glow */}
          <div className="h-24 bg-gradient-to-r from-[#14e6ff]/20 via-[#050e33] to-[#ff00c3]/20 relative border-b border-white/[0.08]">
            <div className="absolute inset-0 cyber-grid opacity-30" />
          </div>

          {/* Body */}
          <div className="p-6 pt-0 text-center flex flex-col items-center">
            {/* Avatar Wrap */}
            <div className="relative -mt-12 mb-3">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#01021c] shadow-[0_0_25px_rgba(20,230,255,0.4)]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#14e6ff]/20 to-[#0a1330] border-4 border-[#01021c] text-[#5ff2ff] font-['Sora'] font-extrabold text-3xl flex items-center justify-center shadow-[0_0_25px_rgba(20,230,255,0.3)]">
                  {student.initials}
                </div>
              )}

              {/* Upload Camera Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#14e6ff] text-[#00131a] border-2 border-[#01021c] shadow-lg hover:scale-110 transition-transform"
                title="Change photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoSelect}
              />
            </div>

            <p className="text-[11px] text-[#8d99b3] mb-3">
              {photoHint}
            </p>

            <h2 className="font-['Sora'] font-bold text-xl text-white">
              {student.name}
            </h2>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-[#8d99b3] font-mono">{student.id}</span>
              <button
                onClick={() => handleCopy(student.id, 'id')}
                className="p-1 text-[#8d99b3] hover:text-[#14e6ff]"
                title="Copy student ID"
              >
                {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-[#25D366]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#14e6ff]/10 text-[#5ff2ff] border border-[#14e6ff]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14e6ff]" />
              <span>Registered Student</span>
            </div>

            {/* Rows info */}
            <div className="w-full mt-6 pt-6 border-t border-white/[0.08] space-y-3 text-left">
              <div className="glass-card-nested p-3.5 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#14e6ff]/10 text-[#14e6ff] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-[#8d99b3]">Email</div>
                    <div className="text-xs text-white truncate">{student.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(student.email, 'email')}
                  className="p-1.5 text-[#8d99b3] hover:text-white"
                >
                  {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-[#25D366]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="glass-card-nested p-3.5 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-[#8d99b3]">Phone Helpline</div>
                    <div className="text-xs text-white truncate">{student.phone}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(student.phone, 'phone')}
                  className="p-1.5 text-[#8d99b3] hover:text-white"
                >
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-[#25D366]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Stats Cards + Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* 4 Profile Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#22e07a]/15 text-[#22e07a] border border-[#22e07a]/30 flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(34,224,122,0.2)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-[10.5px] uppercase font-bold tracking-wider text-[#8d99b3]">Enrolled</div>
              <div className="font-['Sora'] font-extrabold text-2xl text-white mt-0.5">{courses.length}</div>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#ffa600]/15 text-[#ffa600] border border-[#ffa600]/30 flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(255,166,0,0.2)]">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div className="text-[10.5px] uppercase font-bold tracking-wider text-[#8d99b3]">Attended</div>
              <div className="font-['Sora'] font-extrabold text-2xl text-white mt-0.5">{attendedCount}</div>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#14e6ff]/15 text-[#14e6ff] border border-[#14e6ff]/30 flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(20,230,255,0.2)]">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div className="text-[10.5px] uppercase font-bold tracking-wider text-[#8d99b3]">Upcoming</div>
              <div className="font-['Sora'] font-extrabold text-2xl text-white mt-0.5">{upcomingClasses.length}</div>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#ff00c3]/15 text-[#ff00c3] border border-[#ff00c3]/30 flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(255,0,195,0.2)]">
                <Video className="w-5 h-5" />
              </div>
              <div className="text-[10.5px] uppercase font-bold tracking-wider text-[#8d99b3]">Recordings</div>
              <div className="font-['Sora'] font-extrabold text-2xl text-white mt-0.5">{recordings.length}</div>
            </div>
          </div>

          {/* Enrolled Courses Progress */}
          <div className="glass-panel rounded-3xl p-6">
            <h3 className="font-['Sora'] font-bold text-base text-white mb-4">
              Enrolled Course Modules
            </h3>

            <div className="space-y-3.5">
              {courses.map(c => (
                <div
                  key={c.id}
                  className="glass-card-nested p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    {c.imageUrl ? (
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        className="w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-white/[0.06] text-[#14e6ff] flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-sm text-white">
                        {c.name}
                      </div>
                      <div className="text-xs text-[#8d99b3] mt-0.5 flex items-center gap-2">
                        <span>{c.teacher}</span>
                        {c.board && (
                          <span className="text-[10px] font-mono text-[#14e6ff] bg-[#14e6ff]/10 px-1.5 py-0.2 rounded">
                            {c.board}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-['Sora'] font-bold px-3 py-1 rounded-full bg-[#1a9c4e] text-[#e3fbec] shadow-[0_0_10px_rgba(37,211,102,0.3)]">
                      {c.progress}% complete
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
