"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema, roleBasedInterviews } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.5-flash", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  if (!interview.exists) return null;

  return {
    id: interview.id,
    ...(interview.data() as Omit<Interview, "id">),
  } as Interview;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

// Returns only interviews the user has completed (i.e. there exists feedback for the user + interview).
export async function getCompletedInterviewsByUserId(
  userId: string
): Promise<Interview[]> {
  const feedbackSnapshot = await db
    .collection("feedback")
    .where("userId", "==", userId)
    .get();

  if (feedbackSnapshot.empty) return [];

  // Note: we intentionally do NOT use Firestore `.orderBy("createdAt")` here.
  // `where("userId", "==", ...) + orderBy("createdAt")` requires a composite index.
  // Instead we sort in memory.
  const uniqueInterviewIds: string[] = [];
  const seen = new Set<string>();

  const feedbackDocs = feedbackSnapshot.docs
    .map((doc) => ({ doc, data: doc.data() as Partial<Feedback> }))
    .filter(
      ({ data }) =>
        typeof data.interviewId === "string" && typeof data.createdAt === "string"
    )
    .sort((a, b) => (b.data.createdAt as string).localeCompare(a.data.createdAt as string));

  feedbackDocs.forEach(({ data }) => {
    const interviewId = data.interviewId;
    if (typeof interviewId !== "string") return;
    if (seen.has(interviewId)) return;
    seen.add(interviewId);
    uniqueInterviewIds.push(interviewId);
  });

  const interviews = await Promise.all(
    uniqueInterviewIds.map(async (interviewId) => {
      const interview = await getInterviewById(interviewId);
      if (interview) return interview;
      // Seed interviews aren't stored in Firestore; fall back to the in-app catalog.
      return roleBasedInterviews.find((i) => i.id === interviewId) ?? null;
    })
  );

  return interviews.filter((i): i is Interview => i !== null);
}

export async function getWeeklyLeaderboard(): Promise<LeaderboardEntry[]> {
  const oneWeekAgoISO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const feedbackSnapshot = await db
    .collection("feedback")
    .where("createdAt", ">=", oneWeekAgoISO)
    .get();

  if (feedbackSnapshot.empty) return [];

  const bestByUser = new Map<
    string,
    { highestScore: number; achievedAt: string }
  >();

  feedbackSnapshot.docs.forEach((doc) => {
    const data = doc.data() as Partial<Feedback>;
    const userId = data.userId;
    const totalScore = data.totalScore;
    const createdAt = data.createdAt;

    if (
      typeof userId !== "string" ||
      typeof totalScore !== "number" ||
      typeof createdAt !== "string"
    ) {
      return;
    }

    const existing = bestByUser.get(userId);
    if (
      !existing ||
      totalScore > existing.highestScore ||
      (totalScore === existing.highestScore && createdAt > existing.achievedAt)
    ) {
      bestByUser.set(userId, {
        highestScore: totalScore,
        achievedAt: createdAt,
      });
    }
  });

  const leaderboardEntries = await Promise.all(
    Array.from(bestByUser.entries()).map(async ([userId, scoreData]) => {
      const userDoc = await db.collection("users").doc(userId).get();
      const userData = (userDoc.data() ?? {}) as Partial<User>;

      return {
        userId,
        name: userData.name ?? "Unknown User",
        email: userData.email ?? "-",
        highestScore: scoreData.highestScore,
        achievedAt: scoreData.achievedAt,
      };
    })
  );

  return leaderboardEntries.sort((a, b) => {
    if (b.highestScore !== a.highestScore) return b.highestScore - a.highestScore;
    return b.achievedAt.localeCompare(a.achievedAt);
  });
}

// Dashboard metrics for a single user.
// IMPORTANT: these metrics are computed from `feedback` (completed/scored interviews),
// not from the `interviews` collection.
export async function getUserDashboardMetrics(userId: string): Promise<{
  totalCompletedInterviews: number;
  completedInterviewsLastWeek: number;
  completedInterviewsLastMonth: number;
  completedInterviewsLastYear: number;
  scoreSeries: Array<{ index: number; role: string; score: number }>;
}> {
  const DAY_IN_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();

  const feedbackSnapshot = await db
    .collection("feedback")
    .where("userId", "==", userId)
    .get();

  if (feedbackSnapshot.empty) {
    return {
      totalCompletedInterviews: 0,
      completedInterviewsLastWeek: 0,
      completedInterviewsLastMonth: 0,
      completedInterviewsLastYear: 0,
      scoreSeries: [],
    };
  }

  const feedbacks = feedbackSnapshot.docs
    .map((doc) => doc.data() as Partial<Feedback>)
    .filter((data): data is Required<Pick<Feedback, "interviewId" | "createdAt" | "totalScore">> => {
      return (
        typeof data.interviewId === "string" &&
        typeof data.createdAt === "string" &&
        typeof data.totalScore === "number"
      );
    });

  // Sort by completion time so the graph matches the timeline of scored attempts.
  feedbacks.sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const completedInterviewsLastWeek = feedbacks.filter((fb) => {
    return now - new Date(fb.createdAt).getTime() <= 7 * DAY_IN_MS;
  }).length;

  const completedInterviewsLastMonth = feedbacks.filter((fb) => {
    return now - new Date(fb.createdAt).getTime() <= 30 * DAY_IN_MS;
  }).length;

  const completedInterviewsLastYear = feedbacks.filter((fb) => {
    return now - new Date(fb.createdAt).getTime() <= 365 * DAY_IN_MS;
  }).length;

  const interviewIds = Array.from(new Set(feedbacks.map((fb) => fb.interviewId)));
  const interviewMap = new Map<string, Interview>();

  await Promise.all(
    interviewIds.map(async (interviewId) => {
      const interview = await getInterviewById(interviewId);
      if (interview) interviewMap.set(interviewId, interview);
    })
  );

  const scoreSeries = feedbacks.map((fb, i) => {
    const interview = interviewMap.get(fb.interviewId);
    return {
      index: i + 1,
      role: interview?.role ?? "Unknown",
      score: fb.totalScore,
    };
  });

  return {
    totalCompletedInterviews: scoreSeries.length,
    completedInterviewsLastWeek,
    completedInterviewsLastMonth,
    completedInterviewsLastYear,
    scoreSeries,
  };
}
