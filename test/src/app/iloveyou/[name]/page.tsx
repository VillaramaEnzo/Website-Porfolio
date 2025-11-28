import { LOVE as ROUTE_NAME } from '@/utils/routes';
import { notFound } from 'next/navigation';

import HeartAnimation from '@/components/tests/Heart Animation/HeartAnimationV1'; 

interface PageProps {
  params: Promise<{
    name: string;
  }>
}

export default async function DynamicPage({ params }: PageProps) {
  const { name } = await params;
  
  if (name !== ROUTE_NAME) {
    notFound();
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div>Girlfriend Content</div>
    </div>
  );
}

export function generateStaticParams() {
  return [
    { name: ROUTE_NAME }
  ];
}