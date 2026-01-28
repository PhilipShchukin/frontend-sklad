import { cn } from '@/lib/utils';
import type { Marking } from '@/services/constants';
import { AnimatePresence, motion } from 'motion/react';

import { useState } from 'react';

interface HoverItem {
  name: string;
  gtin: string;
  batch: string;
  status: string;
  description: string;
  marking: Marking;
  // link?: string;
  onClick?: () => void;
}

interface HoverEffectProps {
  items: HoverItem[];
  className?: string;
  cardClassName?: string;
}

export const HoverEffect = ({ items, className, cardClassName }: HoverEffectProps) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleClick = (item: HoverItem, event: React.MouseEvent) => {
    // Если есть onClick, предотвращаем переход по ссылке и вызываем обработчик
    if (item.onClick) {
      event.preventDefault();
      event.stopPropagation();
      item.onClick();
    }
  };

  return (
    <div className={cn('grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item, idx) => (
        <a
          // href={item?.link || '#'} // Заглушка если ссылки нет
          key={idx} // Лучше использовать index для ключа
          className="group relative block h-full w-full cursor-pointer p-2" // Добавляем курсор
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={(e) => handleClick(item, e)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-3xl bg-neutral-200 dark:bg-slate-800/[0.8]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className={cardClassName} marking={item.marking}>
            <CardTitle>{item.name}</CardTitle>
            <CardTitle>GTIN: {item.gtin}</CardTitle>
            <CardDescription>Партия: {item.batch}</CardDescription>
            <CardDescription>{item.description}</CardDescription>
            <CardDescription>Статус: {item.status}</CardDescription>
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
  marking,
}: {
  className?: string;
  children: React.ReactNode;
  marking: Marking;
}) => {
  const isFailed = marking === 'FAILED';
  return (
    <div
      className={cn(
        'relative z-20 h-full w-full overflow-hidden rounded-2xl border border-transparent p-4 group-hover:border-slate-700 dark:border-white/[0.2]',
        isFailed ? 'bg-orange-500' : 'bg-black',
        className,
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn('mt-4 font-bold tracking-wide text-zinc-100', className)}>{children}</h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p className={cn('mt-8 text-sm leading-relaxed tracking-wide text-zinc-400', className)}>
      {children}
    </p>
  );
};
