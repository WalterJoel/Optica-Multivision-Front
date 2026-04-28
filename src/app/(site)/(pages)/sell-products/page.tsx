import Sales from "@/components/Ventas/index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Sell | NextCommerce Nextjs E-commerce template",
  description: "This is My Sell page for NextCommerce Template",
};

const MySellPage = () => {
  return (
    <main>
      <Sales />
    </main>
  );
};

export default MySellPage;
