import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getUserDashboardMetrics,
  getWeeklyLeaderboard,
} from "@/lib/actions/general.action";

const getRankBadge = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

const DashboardPage = async () => {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in");

  const weeklyLeaderboard = await getWeeklyLeaderboard();
  const {
    totalCompletedInterviews,
    completedInterviewsLastWeek,
    completedInterviewsLastMonth,
    completedInterviewsLastYear,
    scoreSeries,
  } = await getUserDashboardMetrics(user.id);

  const chartWidth = 820;
  const chartHeight = 300;
  const chartPaddingTop = 24;
  const chartPaddingRight = 24;
  const chartPaddingBottom = 50;
  const chartPaddingLeft = 96;
  const chartInnerWidth = chartWidth - chartPaddingLeft - chartPaddingRight;
  const chartInnerHeight = chartHeight - chartPaddingTop - chartPaddingBottom;

  const yTicks = [0, 25, 50, 75, 100];
  const points = scoreSeries.map((item, i) => {
    const x =
      chartPaddingLeft +
      (scoreSeries.length === 1
        ? chartInnerWidth / 2
        : (i / (scoreSeries.length - 1)) * chartInnerWidth);
    const y = chartPaddingTop + ((100 - item.score) / 100) * chartInnerHeight;
    const radius = 8 + (item.score / 100) * 14;

    return { ...item, x, y, radius };
  });

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <section className="flex flex-col gap-8">
      <div className="card-border w-full">
        <div className="dark-gradient rounded-2xl p-6 md:p-8">
          <h1 className="text-primary-100">Dashboard</h1>
          <p className="text-light-100 mt-2">
            Track your interview practice activity and progress over time.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-dark-200 p-4 border border-light-800">
              <p className="text-sm text-light-100">Name</p>
              <p className="mt-1 text-primary-100 font-semibold">{user.name}</p>
            </div>
            <div className="rounded-xl bg-dark-200 p-4 border border-light-800">
              <p className="text-sm text-light-100">Email</p>
              <p className="mt-1 text-primary-100 font-semibold break-all">
                {user.email}
              </p>
            </div>
            <div className="rounded-xl bg-dark-200 p-4 border border-light-800">
              <p className="text-sm text-light-100">Total Interviews</p>
              <p className="mt-1 text-primary-100 font-semibold">
                {totalCompletedInterviews}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-border w-full">
          <div className="dark-gradient rounded-2xl p-6">
            <p className="text-light-100 text-sm">Interviews in last week</p>
              <h2 className="text-primary-100 mt-2">
                {completedInterviewsLastWeek}
              </h2>
          </div>
        </div>
        <div className="card-border w-full">
          <div className="dark-gradient rounded-2xl p-6">
            <p className="text-light-100 text-sm">Interviews in last month</p>
              <h2 className="text-primary-100 mt-2">
                {completedInterviewsLastMonth}
              </h2>
          </div>
        </div>
        <div className="card-border w-full">
          <div className="dark-gradient rounded-2xl p-6">
            <p className="text-light-100 text-sm">Interviews in last year</p>
              <h2 className="text-primary-100 mt-2">
                {completedInterviewsLastYear}
              </h2>
          </div>
        </div>
      </div>

      <div className="card-border w-full">
        <div className="rounded-2xl p-6 md:p-8 bg-[radial-gradient(circle_at_top,_rgba(120,128,255,0.18),_rgba(8,9,13,0.96)_55%)]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-primary-100 tracking-wide">Weekly Leaderboard</h3>
            <span className="rounded-full border border-primary-200/40 bg-primary-200/15 px-3 py-1 text-xs font-semibold text-primary-100">
              TOP SCORES
            </span>
          </div>
          <p className="text-light-100 mt-2 text-sm">
            Highest interview score per user in the last 7 days.
          </p>

          <div className="mt-6 rounded-2xl border border-light-800/80 bg-[#0b0d14]/90 p-3 md:p-5 overflow-x-auto shadow-[0_20px_60px_-35px_rgba(100,110,255,0.55)]">
            {weeklyLeaderboard.length ? (
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="text-left text-light-100/90 border-b border-light-800/80">
                    <th className="py-3 pr-4 text-xs tracking-widest">RANK</th>
                    <th className="py-3 pr-4 text-xs tracking-widest">CHAMPION</th>
                    <th className="py-3 pr-4 text-xs tracking-widest">EMAIL</th>
                    <th className="py-3 pr-4 text-xs tracking-widest">SCORE</th>
                    <th className="py-3 text-xs tracking-widest">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyLeaderboard.map((entry, index) => (
                    <tr
                      key={entry.userId}
                      className={
                        index === 0
                          ? "border-b border-amber-400/30 bg-gradient-to-r from-amber-400/20 via-amber-200/10 to-transparent text-primary-100"
                          : index === 1
                          ? "border-b border-slate-300/20 bg-gradient-to-r from-slate-300/15 via-slate-100/5 to-transparent text-primary-100"
                          : index === 2
                          ? "border-b border-orange-500/25 bg-gradient-to-r from-orange-500/20 via-orange-300/8 to-transparent text-primary-100"
                          : "border-b border-light-800/50 last:border-b-0 text-primary-100/95 hover:bg-primary-200/5"
                      }
                    >
                      <td className="py-3 pr-4 font-semibold">
                        <span className="inline-flex items-center gap-2 rounded-full border border-light-800 px-2.5 py-1 text-xs bg-dark-200/80">
                          {getRankBadge(index + 1)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-semibold uppercase tracking-wide">
                        {entry.name}
                      </td>
                      <td className="py-3 pr-4 break-all">{entry.email}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-primary-200/15 border border-primary-200/30 px-3 py-1 font-semibold text-primary-100">
                          {entry.highestScore}
                        </span>
                      </td>
                      <td className="py-3">
                        {new Date(entry.achievedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-light-100">
                No interview scores available for this week yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="card-border w-full">
        <div className="dark-gradient rounded-2xl p-6 md:p-8">
          <h3 className="text-primary-100">Interview Score Bubble Graph</h3>
          <p className="text-light-100 mt-2 text-sm">
            Bubble chart style: X-axis is interview number, Y-axis is score (0-100).
          </p>

          <div className="mt-6 rounded-2xl border border-light-800 bg-dark-200 p-3 md:p-5">
            {points.length ? (
              <div className="w-full overflow-x-auto">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full min-w-[680px]"
                  role="img"
                  aria-label="Interview score trend graph"
                >
                  <defs>
                    <linearGradient
                      id="scoreBubbleGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#d7d5ff" />
                      <stop offset="100%" stopColor="#6d7cff" />
                    </linearGradient>
                    <linearGradient
                      id="scoreLineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#d7d5ff" />
                      <stop offset="100%" stopColor="#7f8cff" />
                    </linearGradient>
                  </defs>

                  {yTicks.map((tick) => {
                    const y =
                      chartPaddingTop + ((100 - tick) / 100) * chartInnerHeight;

                    return (
                      <g key={tick}>
                        <line
                          x1={chartPaddingLeft}
                          y1={y}
                          x2={chartWidth - chartPaddingRight}
                          y2={y}
                          stroke="rgba(165, 180, 252, 0.2)"
                          strokeWidth="1"
                        />
                        <text
                          x={chartPaddingLeft - 18}
                          y={y + 4}
                          fontSize="11"
                          textAnchor="end"
                          fill="rgba(226, 232, 240, 0.8)"
                        >
                          {tick}
                        </text>
                      </g>
                    );
                  })}

                  <line
                    x1={chartPaddingLeft}
                    y1={chartHeight - chartPaddingBottom}
                    x2={chartWidth - chartPaddingRight}
                    y2={chartHeight - chartPaddingBottom}
                    stroke="rgba(226, 232, 240, 0.8)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={chartPaddingLeft}
                    y1={chartPaddingTop}
                    x2={chartPaddingLeft}
                    y2={chartHeight - chartPaddingBottom}
                    stroke="rgba(226, 232, 240, 0.8)"
                    strokeWidth="1.5"
                  />

                  {points.length > 1 && (
                    <polyline
                      points={polylinePoints}
                      fill="none"
                      stroke="url(#scoreLineGradient)"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.7"
                    />
                  )}

                  {points.map((point) => (
                    <g key={point.index}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={point.radius + 3}
                        fill="rgba(109, 124, 255, 0.2)"
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={point.radius}
                        fill="url(#scoreBubbleGradient)"
                        opacity="0.95"
                      />
                      <text
                        x={point.x}
                        y={point.y + 4}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill="#0b1020"
                      >
                        {point.score}
                      </text>
                    </g>
                  ))}

                  {points.map((point, index) => {
                    const shouldShowLabel =
                      points.length <= 8 ||
                      index === 0 ||
                      index === points.length - 1 ||
                      index % Math.ceil(points.length / 6) === 0;

                    if (!shouldShowLabel) return null;

                    return (
                      <text
                        key={`x-label-${point.index}`}
                        x={point.x}
                        y={chartHeight - chartPaddingBottom + 18}
                        textAnchor="middle"
                        fontSize="10"
                        fill="rgba(226, 232, 240, 0.85)"
                      >
                        {`Interview ${point.index}`}
                      </text>
                    );
                  })}

                  <text
                    x={chartWidth / 2}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fontSize="12"
                    fill="rgba(226, 232, 240, 0.85)"
                  >
                    Interview Number
                  </text>
                  <text
                    x={28}
                    y={chartHeight / 2}
                    textAnchor="middle"
                    fontSize="12"
                    fill="rgba(226, 232, 240, 0.85)"
                    transform={`rotate(-90 28 ${chartHeight / 2})`}
                  >
                    Score
                  </text>
                </svg>

                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {scoreSeries.slice(-8).map((item) => (
                    <div
                      key={`${item.index}-${item.role}`}
                      className="rounded-lg border border-light-800 px-3 py-2 text-xs text-light-100"
                    >
                      #{item.index} - {item.role}:{" "}
                      <span className="text-primary-100 font-semibold">
                        {item.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-light-100">
                No scored interviews yet. Complete an interview to see your 2D
                score graph.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
