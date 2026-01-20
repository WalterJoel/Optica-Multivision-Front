import Matrix from "@/components/Matrix";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Matrix Page | NextCommerce Nextjs E-commerce template",
  description: "This is Matrix Page for NextCommerce Template",
  // other metadata
};

const MatrixPage = () => {
  return (
    <main>
      <Matrix />
    </main>
  );
};

export default MatrixPage;
