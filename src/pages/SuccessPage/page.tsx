import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/shared/Button";

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnDate: string =
    location.state?.returnDate ?? "—";

  return (
    <MainLayout showSearch>
      <div className="page-container py-6 md:py-10 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center text-center gap-6 max-w-sm w-full">
          {/* Icon with ripple rings */}
          <div className="relative flex items-center justify-center">
            {/* Outer ring */}
            <span className="absolute w-28 h-28 rounded-full border border-neutral-200 opacity-60" />
            {/* Middle ring */}
            <span className="absolute w-20 h-20 rounded-full border border-neutral-200 opacity-80" />
            {/* Icon circle */}
            <div className="relative z-10 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold text-neutral-900">
              Borrowing Successful!
            </h1>
            <p className="text-sm text-neutral-600">
              Your book has been successfully borrowed. Please return it by{" "}
              <span className="text-red-500 font-semibold">{returnDate}</span>
            </p>
          </div>

          {/* CTA */}
          <Button className="w-full max-w-xs" onClick={() => navigate("/my-loans")}>
            See Borrowed List
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}