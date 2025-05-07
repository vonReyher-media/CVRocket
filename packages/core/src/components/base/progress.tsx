import { cn } from '../../../utils/utils.ts';

export interface ProgressProps {
  current: number;
  total: number;
  className?: string;
}

const Progress = ({ current, total, className }: ProgressProps) => {
  const progress = Math.min(Math.max((current / total) * 100, 0), 100);

  return (
    <div
      className={cn('w-full h-2.5 rounded-full bg-muted mb-6', className)}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-2.5 rounded-full bg-primary transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export { Progress };
