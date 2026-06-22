/**
 * SM-2 Spaced Repetition Algorithm (same one used by Anki)
 */
function calculateSM2(quality, prevEaseFactor = 2.5, prevInterval = 0) {
  let easeFactor = prevEaseFactor;
  let interval;

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  if (quality < 3) {
    interval = 1;
  } else if (prevInterval <= 0) {
    // First-ever attempt — reward quality immediately
    const firstIntervalByQuality = { 3: 2, 4: 3, 5: 4 };
    interval = firstIntervalByQuality[quality] || 1;
  } else if (prevInterval === 1) {
    interval = 6;
  } else {
    interval = Math.round(prevInterval * easeFactor);
  }

  // FIX: Build date using UTC to avoid IST timezone shifting date back by 1 day.
  // e.g. "new Date()" in IST at any time before midnight UTC would make
  // setDate() land on yesterday in UTC → stored as wrong date in DB.
  const now = new Date();
  const nextReviewDate = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + interval
  ));

  return {
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    interval,
    // Store as plain YYYY-MM-DD — no time component, no timezone ambiguity
    nextReviewDate: nextReviewDate.toISOString().split('T')[0],
  };
}

function verdictToQuality(verdict, timeTakenMinutes = null) {
  if (verdict === 'Solved') {
    if (timeTakenMinutes && timeTakenMinutes <= 15) return 5;
    return 4;
  }
  if (verdict === 'Hint_Used') return 3;
  if (verdict === 'Failed') return 1;
  return 2;
}

module.exports = { calculateSM2, verdictToQuality };
