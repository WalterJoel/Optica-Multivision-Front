'use client';

import SingleItem from '@/components/Cart/SingleItem';

const Sales = ({ items }: { items: any[] }) => {
  return (
    <div>
      {items.map((item) => (
        <SingleItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Sales;
