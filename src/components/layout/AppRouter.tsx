import { Routes, Route, Navigate } from "react-router-dom";
import { Portal } from '@/pages/Portal';
import { Dashboard } from '@/pages/Dashboard';
import { Crucible } from '@/pages/Crucible';
import { Revelation } from '@/pages/Revelation';
import { FileTextExtraction } from '@/pages/FileTextExtraction';
import { LoaderTest } from '@/pages/LoaderTest';
import NotFound from '@/pages/NotFound';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/portal" replace />} />
      <Route path="/portal" element={<Portal />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/crucible/:weaknessId?" element={<Crucible />} />
      <Route path="/revelation" element={<Revelation />} />
      <Route path="/file-text-extraction" element={<FileTextExtraction />} />
      <Route path="/loader-test" element={<LoaderTest />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
