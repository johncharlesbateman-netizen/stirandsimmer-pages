import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


// Warm palette
const BROWN = "#2C2416";
const BROWN_LIGHT = "#3D3322"; // slightly lighter warm dark for grid cells
const BROWN_LIGHTER = "#4A3D2A"; // for dinner cells, a touch warmer/lighter
const CREAM = "#F5EAD8";
const GOLD = "#C4A97A";
const GOLD_MUTED = "#9C8559";

const MealPlannerPromo = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: BROWN, color: CREAM }}
    >
      {/* Decorative warm glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${GOLD}33, transparent 55%), radial-gradient(circle at 80% 80%, ${GOLD}22, transparent 50%)`,
        }}
      />

      <div className="relative container mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy + CTA */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm mb-6"
              style={{
                backgroundColor: `${CREAM}14`,
                border: `1px solid ${CREAM}26`,
                color: CREAM,
              }}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="text-xs tracking-[0.2em] uppercase">
                New · Weekly Meal Planner
              </span>
            </div>

            <h2
              className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6"
              style={{ color: CREAM }}
            >
              Plan Your Week's Meals
            </h2>

            <p
              className="text-base md:text-lg leading-relaxed max-w-xl mb-8"
              style={{ color: `${CREAM}D9` }}
            >
              Take the stress out of weeknight cooking. Drag favourite recipes into a
              simple Mon–Sun grid, build your shopping list automatically, and sit
              down to dinner with a plan.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/meal-planner"
                className="group inline-flex items-center gap-2 px-8 py-4 text-sm tracking-wider uppercase font-medium transition-all hover:gap-3 hover:opacity-90"
                style={{ backgroundColor: GOLD, color: BROWN }}
              >
                Start Planning
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: GOLD_MUTED }}
              >
                Free · No sign-up needed
              </span>
            </div>
          </div>

          {/* Right: 7-day preview grid */}
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-lg blur-2xl"
              style={{ backgroundColor: `${GOLD}10` }}
              aria-hidden
            />
            <div
              className="relative backdrop-blur-sm rounded-lg p-4 md:p-6 shadow-2xl"
              style={{
                backgroundColor: `${BROWN_LIGHT}CC`,
                border: `1px solid ${CREAM}1A`,
              }}
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <p
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: `${CREAM}B3` }}
                >
                  This Week
                </p>
                <p className="text-xs" style={{ color: `${CREAM}99` }}>
                  Lunch · Dinner
                </p>
              </div>

              <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                {days.map((day) => (
                  <div key={day} className="flex flex-col">
                    <div
                      className="text-[10px] md:text-xs font-medium tracking-wider uppercase text-center pb-1.5 mb-1.5"
                      style={{
                        color: `${CREAM}CC`,
                        borderBottom: `1px solid ${CREAM}1A`,
                      }}
                    >
                      {day}
                    </div>
                    <div className="space-y-1.5">
                      <div
                        className="rounded p-1.5 md:p-2 min-h-[52px] md:min-h-[64px] flex items-center justify-center text-center transition-colors"
                        style={{
                          backgroundColor: `${BROWN_LIGHT}80`,
                          border: `1px dashed ${CREAM}26`,
                        }}
                      >
                        <span
                          className="text-base md:text-lg leading-none"
                          style={{ color: `${CREAM}40` }}
                          aria-hidden
                        >
                          +
                        </span>
                      </div>
                      <div
                        className="rounded p-1.5 md:p-2 min-h-[52px] md:min-h-[64px] flex items-center justify-center text-center transition-colors"
                        style={{
                          backgroundColor: `${BROWN_LIGHTER}80`,
                          border: `1px dashed ${CREAM}26`,
                        }}
                      >
                        <span
                          className="text-base md:text-lg leading-none"
                          style={{ color: `${CREAM}40` }}
                          aria-hidden
                        >
                          +
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="flex items-center gap-4 mt-4 px-1 text-[10px] tracking-wider uppercase"
                style={{ color: `${CREAM}99` }}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: BROWN_LIGHT }}
                  />
                  Lunch
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: BROWN_LIGHTER }}
                  />
                  Dinner
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MealPlannerPromo;
