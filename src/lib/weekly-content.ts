import { addDays, differenceInCalendarDays, format, isWithinInterval, parseISO } from "date-fns";
import week1 from "../../creator content petro/semana-01.json";

type Lesson = {
  title: string;
  subject: string;
  topic: string;
  subtopic: string;
  day: number;
  week: number;
  phase: string;
  videos: string[];
  key_concepts: string[];
  questions: number;
  question_source: string;
  prova_2023_items: number[];
  pitfalls: string[];
  review: string[];
  checklist: string[];
  estimated_time: {
    video_min: number;
    questions_min: number;
    review_min: number;
    total_min: number;
  };
};

type WeekDay = {
  day: string;
  day_number: number;
  type: string;
  lesson: Lesson;
};

type WeekPlan = {
  week: number;
  title: string;
  phase: string;
  main_subject: string;
  start_date: string;
  end_date: string;
  active_day_numbers: number[];
  goals: string[];
  prova_2023_items: number[];
  days: WeekDay[];
  weekly_simulado: {
    day: string;
    questions: number;
    topics_covered: string[];
    target_score: number;
  };
  spaced_review_topics: string[];
};

const weekPlans = [week1 as WeekPlan];

export function getActiveWeekPlan(referenceDate = new Date()) {
  return weekPlans.find((plan) =>
    isWithinInterval(referenceDate, {
      start: parseISO(plan.start_date),
      end: parseISO(plan.end_date),
    }),
  );
}

export function getActiveWeekSchedule(referenceDate = new Date()) {
  const plan = getActiveWeekPlan(referenceDate);
  if (!plan) {
    return null;
  }

  const activeDays = plan.days.filter((day) => plan.active_day_numbers.includes(day.day_number));
  return activeDays.map((entry, index) => {
    const date = addDays(parseISO(plan.start_date), index);
    return {
      ...entry,
      date,
      dateLabel: format(date, "dd/MM/yyyy"),
      isToday: differenceInCalendarDays(date, referenceDate) === 0,
      isPast: differenceInCalendarDays(referenceDate, date) > 0,
      isFuture: differenceInCalendarDays(date, referenceDate) > 0,
    };
  });
}

export function getTodayLesson(referenceDate = new Date()) {
  const schedule = getActiveWeekSchedule(referenceDate);
  return schedule?.find((entry) => entry.isToday) ?? schedule?.[0] ?? null;
}
