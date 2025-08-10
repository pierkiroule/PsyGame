import { Badge } from './badge';
import { BadgeDefinition } from '@shared/schema';

interface AnimatedBadgeProps {
  badge: BadgeDefinition;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  className?: string;
}

export const AnimatedBadge = ({ 
  badge, 
  size = 'md', 
  showTitle = true, 
  className = '' 
}: AnimatedBadgeProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const containerClasses = {
    sm: 'flex items-center gap-2',
    md: 'flex flex-col items-center gap-2',
    lg: 'flex flex-col items-center gap-3'
  };

  return (
    <div className={`${containerClasses[size]} ${className}`}>
      <div 
        className={`${sizeClasses[size]} relative`}
        dangerouslySetInnerHTML={{ __html: badge.svgIcon }}
      />
      {showTitle && (
        <div className="text-center">
          <Badge 
            variant={badge.level === 3 ? 'default' : 'secondary'}
            className="text-xs"
          >
            {badge.name}
          </Badge>
          {size !== 'sm' && (
            <p className="text-xs text-slate-400 mt-1 max-w-24">
              {badge.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};