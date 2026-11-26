import test from "node:test";
import assert from "node:assert/strict";
import {
    exceedsMaxBookingHorizon,
    hasBufferCollision,
    isOverlappingBreak,
    violatesAdvanceNotice,
    violatesCancellationCutoff,
} from "../bookingRuleMath";

test("isOverlappingBreak blocks lunch break slots and leaves boundaries open", () => {
    assert.equal(isOverlappingBreak(14 * 60, 14 * 60 + 30, "14:00", "15:00"), true);
    assert.equal(isOverlappingBreak(13 * 60 + 45, 14 * 60 + 15, "14:00", "15:00"), true);
    assert.equal(isOverlappingBreak(13 * 60 + 30, 14 * 60, "14:00", "15:00"), false);
    assert.equal(isOverlappingBreak(15 * 60, 15 * 60 + 30, "14:00", "15:00"), false);
});

test("hasBufferCollision enforces turnaround buffer between appointments", () => {
    const existing = [
        { startTime: new Date("2026-11-26T09:00:00Z"), endTime: new Date("2026-11-26T09:30:00Z") },
    ];
    // 10-min gap blocked when bufferMin = 15
    assert.equal(
        hasBufferCollision(new Date("2026-11-26T09:40:00Z"), new Date("2026-11-26T10:10:00Z"), existing, 15),
        true
    );
    // 15-min gap allowed
    assert.equal(
        hasBufferCollision(new Date("2026-11-26T09:45:00Z"), new Date("2026-11-26T10:15:00Z"), existing, 15),
        false
    );
});

test("advanceNoticeMin, maxBookingDaysAhead, and cancellationCutoffHours enforce boundaries", () => {
    const now = new Date("2026-11-26T09:00:00Z");
    assert.equal(violatesAdvanceNotice(new Date("2026-11-26T09:30:00Z"), now, 60), true);
    assert.equal(violatesAdvanceNotice(new Date("2026-11-26T10:15:00Z"), now, 60), false);

    assert.equal(exceedsMaxBookingHorizon("2027-02-15", "2026-11-26", 60), true);
    assert.equal(exceedsMaxBookingHorizon("2026-12-10", "2026-11-26", 60), false);

    assert.equal(violatesCancellationCutoff(new Date("2026-11-26T14:00:00Z"), now, 12), true);
    assert.equal(violatesCancellationCutoff(new Date("2026-11-27T00:00:00Z"), now, 12), false);
});
