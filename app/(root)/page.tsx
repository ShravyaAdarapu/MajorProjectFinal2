import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { roleBasedInterviews } from "@/constants";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getCompletedInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  const [completedInterviews, allInterview] = await Promise.all([
    user?.id
      ? getCompletedInterviewsByUserId(user.id)
      : Promise.resolve([]),
    user?.id ? getLatestInterviews({ userId: user.id }) : Promise.resolve([]),
  ]);

  const hasPastInterviews = completedInterviews?.length! > 0;
  const completedRoles = new Set(
    (completedInterviews ?? []).map((interview) => interview.role)
  );
  const allowedRoles = new Set([
    "AI Engineer",
    "Machine Learning Engineer",
    "Data Scientist",
    "Data Analyst",
    "Data Engineer",
    "AI/ML Architect",
    "NLP Engineer",
    "Computer Vision Engineer",
    "Prompt Engineer",
    "Business Intelligence Analyst",
    "Cloud Engineer",
    "Cloud Architect",
    "DevOps Engineer",
    "Site Reliability Engineer",
    "Platform Engineer",
    "Cloud Security Engineer",
    "Infrastructure Engineer",
    "Cybersecurity Analyst",
    "Ethical Hacker",
    "Security Engineer",
    "Security Analyst",
    "Information Security Manager",
    "SOC Analyst",
    "Network Security Engineer",
    "Software Engineer",
    "Software Developer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Mobile App Developer",
    "Game Developer",
    "Embedded Systems Engineer",
    "UI Designer",
    "UX Designer",
    "UI/UX Designer",
    "Web Developer",
    "Database Administrator",
    "System Administrator",
    "Network Administrator",
    "Systems Engineer",
    "IT Support Engineer",
    "Product Manager",
    "Project Manager",
    "Technical Program Manager",
    "Scrum Master",
    "Business Analyst",
    "Blockchain Developer",
    "AR/VR Developer",
    "IoT Engineer",
    "Robotics Engineer",
  ]);

  const mergedUpcomingInterviews = (() => {
    const liveInterviews = allInterview ?? [];
    const usedRoles = new Set(liveInterviews.map((interview) => interview.role));
    const seedInterviews = roleBasedInterviews.filter(
      (interview) => !usedRoles.has(interview.role)
    );

    return [...liveInterviews, ...seedInterviews].slice(0, 50);
  })();

  const filteredUpcomingInterviews = mergedUpcomingInterviews.filter((i) =>
    allowedRoles.has(i.role) && !completedRoles.has(i.role)
  );
  const hasUpcomingInterviews = filteredUpcomingInterviews.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Customize your own interview, practice real questions, and get instant feedback.
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Completed Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            completedInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
              filteredUpcomingInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
