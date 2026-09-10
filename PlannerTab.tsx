import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Check, 
  Trash2, 
  Calendar, 
  AlertCircle, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Course, Task } from '../types';
import { formatDate } from '../utils/formatters';

interface PlannerTabProps {
  courses: Course[];
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const PlannerTab: React.FC<PlannerTabProps> = ({
  courses,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask
}) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'chem-as');
  const [dueDate, setDueDate] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dueAt = dueDate 
      ? new Date(`${dueDate}T18:00:00`).toISOString() 
      : new Date(Date.now() + 86400000).toISOString();

    onAddTask({
      title: title.trim(),
      courseId,
      dueAt,
      done: false
    });

    setTitle('');
    setDueDate('');
  };

  const getCourseName = (cId: string) => {
    return courses.find(c => c.id === cId)?.name || 'General';
  };

  const nowTime = Date.now();
  const todoList = tasks.filter(t => !t.done).sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  const doneList = tasks.filter(t => t.done).sort((a, b) => new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime());

  return (
    <div className="space-y-6">
      {/* Top Add Task Bar */}
      <form 
        onSubmit={handleCreate}
        className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center gap-3 relative overflow-hidden"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What learning goal or task do you need to accomplish?"
            maxLength={120}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#8d99b3] focus:outline-none focus:border-[#14e6ff] transition-colors"
          />
        </div>

        {/* Course Select */}
        <div className="w-full md:w-56">
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full bg-[#050e33] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff] transition-colors"
          >
            {courses.map(c => (
              <option key={c.id} value={c.id} className="bg-[#050e33] text-white">
                {c.name.split('—')[0]}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date Picker */}
        <div className="w-full md:w-44">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#14e6ff] transition-colors scheme-dark"
          />
        </div>

        {/* Add Button */}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#14e6ff] hover:bg-[#5ff2ff] text-[#00131a] font-['Sora'] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(20,230,255,0.3)] hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* 2-Column Board: To Do vs Completed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* To Do Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-['Sora'] font-bold text-sm text-white flex items-center gap-2">
              <span>To Do</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#14e6ff]/20 text-[#5ff2ff] border border-[#14e6ff]/30">
                {todoList.length}
              </span>
            </h3>
          </div>

          <div className="space-y-3">
            {todoList.length === 0 ? (
              <div className="glass-panel p-8 text-center rounded-2xl text-xs text-[#8d99b3]">
                Nothing pending! Add a study task or revision goal above.
              </div>
            ) : (
              todoList.map(task => {
                const isOverdue = new Date(task.dueAt).getTime() < nowTime;

                return (
                  <div
                    key={task.id}
                    className={`
                      glass-card-nested p-4 rounded-xl flex items-start justify-between gap-3.5 transition-all
                      ${isOverdue ? 'border-l-4 border-l-[#e2635a]' : 'hover:border-white/20'}
                    `}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="w-5 h-5 mt-0.5 rounded-lg border-2 border-[#8d99b3] hover:border-[#14e6ff] flex items-center justify-center flex-shrink-0 transition-all group"
                      title="Mark as completed"
                    >
                      <Check className="w-3.5 h-3.5 text-transparent group-hover:text-[#14e6ff]/60" />
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-white leading-snug">
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-[11px] text-[#8d99b3] mt-1.5 font-medium">
                        <span className="text-[#14e6ff]">{getCourseName(task.courseId).split('—')[0]}</span>
                        <span>·</span>
                        {isOverdue ? (
                          <span className="text-[#ff6b60] font-bold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Overdue (Due {formatDate(task.dueAt)})
                          </span>
                        ) : (
                          <span>Due {formatDate(task.dueAt)}</span>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-[#8d99b3] hover:text-[#ff6b60] hover:bg-[#e2635a]/10 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Completed Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-['Sora'] font-bold text-sm text-white flex items-center gap-2">
              <span>Completed</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#22e07a]/20 text-[#22e07a] border border-[#22e07a]/30">
                {doneList.length}
              </span>
            </h3>
          </div>

          <div className="space-y-3">
            {doneList.length === 0 ? (
              <div className="glass-panel p-8 text-center rounded-2xl text-xs text-[#8d99b3]">
                Completed tasks will show up here as you check them off.
              </div>
            ) : (
              doneList.map(task => (
                <div
                  key={task.id}
                  className="glass-card-nested p-4 rounded-xl flex items-start justify-between gap-3.5 opacity-60 hover:opacity-100 transition-all"
                >
                  {/* Checked Box */}
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="w-5 h-5 mt-0.5 rounded-lg bg-[#25D366] border border-[#25D366] flex items-center justify-center flex-shrink-0 text-[#00131a]"
                    title="Mark as incomplete"
                  >
                    <Check className="w-3.5 h-3.5 font-bold stroke-[3]" />
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-white/80 line-through">
                      {task.title}
                    </div>
                    <div className="text-[11px] text-[#8d99b3] mt-1">
                      {getCourseName(task.courseId).split('—')[0]}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-[#8d99b3] hover:text-[#ff6b60] hover:bg-[#e2635a]/10 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
