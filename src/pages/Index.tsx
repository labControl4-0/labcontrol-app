import { useState, useCallback, useEffect } from 'react';
import { Tool, Sector, Machine, HistoryEntry } from '@/types/editor';
import TopNav from '@/components/TopNav';
import LeftToolbar from '@/components/LeftToolbar';
import DashboardPanel from '@/components/DashboardPanel';
import Canvas from '@/components/Canvas';

const INITIAL_MACHINES: Machine[] = [
  { id: 'm1', name: 'CNC Router #1', position: { x: 200, y: 150 }, status: 'active' },
  { id: 'm2', name: 'Laser Cutter', position: { x: 350, y: 200 }, status: 'active' },
  { id: 'm3', name: 'Press A', position: { x: 500, y: 300 }, status: 'warning' },
  { id: 'm4', name: 'Conveyor Belt', position: { x: 150, y: 400 }, status: 'active' },
  { id: 'm5', name: 'Welder #3', position: { x: 600, y: 150 }, status: 'error' },
];

const Index = () => {
  const [tool, setTool] = useState<Tool>('select');
  const [gridEnabled, setGridEnabled] = useState(true);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [history, setHistory] = useState<HistoryEntry[]>([{ sectors: [], machines: INITIAL_MACHINES }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback(() => {
    const entry: HistoryEntry = { sectors: [...sectors], machines: [...machines] };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(entry);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [sectors, machines, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    setSectors(prev.sectors);
    setMachines(prev.machines);
    setHistoryIndex(historyIndex - 1);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    setSectors(next.sectors);
    setMachines(next.machines);
    setHistoryIndex(historyIndex + 1);
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        undo();
      } else if (e.key === 'v') setTool('select');
      else if (e.key === 'd') setTool('draw');
      else if (e.key === 's' && !e.ctrlKey && !e.metaKey) setTool('sector');
      else if (e.key === 'm') setTool('machine');
      else if (e.key === 'g') setGridEnabled((g) => !g);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-background">
      <Canvas
        tool={tool}
        gridEnabled={gridEnabled}
        sectors={sectors}
        machines={machines}
        onSectorsChange={setSectors}
        onMachinesChange={setMachines}
        onPushHistory={pushHistory}
      />
      <TopNav />
      <LeftToolbar
        activeTool={tool}
        onToolChange={setTool}
        gridEnabled={gridEnabled}
        onToggleGrid={() => setGridEnabled((g) => !g)}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
      <DashboardPanel machines={machines} />
    </div>
  );
};

export default Index;
