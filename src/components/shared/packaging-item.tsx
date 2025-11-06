import type { ReportGet } from '@/types/pages-types/report-types';
import { HoverEffect } from '../ui/card-hover-effect';
import { useGetReport } from '@/hooks/use-report';
import { useState } from 'react';
import { ReportModal } from './modal/report-modal';

export function CardHoverItem() {
  const { data } = useGetReport();
  const [selectedReport, setSelectedReport] = useState<ReportGet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data || data.length === 0) {
    return <div>Нет данных для отображения</div>;
  }

  const handleCardClick = (report: ReportGet) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };
  const hoverItems = data.map((item) => ({
    name: item.name,
    gtin: item.gtin,
    batch: item.batch,
    status: item.status,
    description: item.description,
    // link: `#`,
    onClick: () => handleCardClick(item),
  }));

  return (
    <div className="mx-auto max-w-5xl px-8">
      <HoverEffect items={hoverItems} cardClassName="cursor-pointer  " />
      <ReportModal isOpen={isModalOpen} onClose={handleCloseModal} report={selectedReport} />
    </div>
  );
}
