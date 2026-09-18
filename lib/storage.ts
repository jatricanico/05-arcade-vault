// ===== storage.ts — persistencia en localStorage =====

export interface User {
  name: string;
}

export interface ScoreEntry {
  game: string;
  name: string;
  score: number;
  at: number;
}

const USER_KEY = "av_user";
const SCORES_KEY = "av_scores";

export function getUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function setUser(user: User | null): void {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    // localStorage no disponible; ignorar
  }
}

export function getScores(): ScoreEntry[] {
  try {
    return JSON.parse(localStorage.getItem(SCORES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addScore(entry: Omit<ScoreEntry, "at">): void {
  try {
    const all = getScores();
    all.push({ ...entry, at: Date.now() });
    localStorage.setItem(SCORES_KEY, JSON.stringify(all));
  } catch {
    // localStorage no disponible; ignorar
  }
}
