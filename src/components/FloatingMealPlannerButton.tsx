import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

const FloatingMealPlannerButton = () => {
  return (
    <Link
      to="/meal-planner"
      aria-label="Open Weekly Meal Planner"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 group inline-flex items-center gap-2 md:gap-3 pl-4 pr-5 md:pl-5 md:pr-6 py-3 md:py-4 bg-planner text-planner-foreground rounded-full shadow-lg hover:shadow-xl hover:bg-planner-accent transition-all hover:-translate-y-0.5"
    >
      <CalendarDays className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
      <span className="text-xs md:text-sm font-medium tracking-wide uppercase whitespace-nowrap">
        Meal Planner
      </span>
    </Link>
  );
};

export default FloatingMealPlannerButton;
