import { ThemeToggle } from './components/light-dark-mode-switch.tsx';
import { Example001 } from './components/surveytest';

const App = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <ThemeToggle />
      <Example001 />
    </div>
  );
};

export default App;
