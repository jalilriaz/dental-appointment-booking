import test from "node:test";
import assert from "node:assert/strict";
import {
    findInvalidPlaceholders,
    renderMessageTemplate,
    SAMPLE_TEMPLATE_DATA,
} from "../messageTemplates";
import { isKarachiNightHours, isRecallEligible } from "../recallMath";

test("findInvalidPlaceholders accepts only whitelisted placeholders", () => {
    const valid =
        "Hi {{patient_name}}, your {{treatment}} is on {{date}} at {{time}}. Call {{clinic_phone}}.";
    assert.deepEqual(findInvalidPlaceholders(valid), []);

    const invalid =
        "Hi {{patient_name}}, your balance {{outstanding_balance}} and {{doctor_secret}}.";
    assert.deepEqual(findInvalidPlaceholders(invalid), [
        "{{outstanding_balance}}",
        "{{doctor_secret}}",
    ]);
});

test("renderMessageTemplate substitutes whitelisted placeholders", () => {
    const out = renderMessageTemplate(
        "Dear {{patient_name}}, visit on {{date}} at {{time}} ({{clinic_phone}})",
        SAMPLE_TEMPLATE_DATA
    );
    assert.equal(out, "Dear Ayesha Khan, visit on 28 Nov 2026 at 3:30 PM (0303-5080011)");
});

test("isKarachiNightHours blocks night sends (Asia/Karachi 21:00-07:59)", () => {
    // 22:30 PKT = 17:30 UTC
    assert.equal(isKarachiNightHours(new Date("2026-11-26T17:30:00Z")), true);
    // 06:15 PKT = 01:15 UTC
    assert.equal(isKarachiNightHours(new Date("2026-11-26T01:15:00Z")), true);
    // 14:00 PKT = 09:00 UTC
    assert.equal(isKarachiNightHours(new Date("2026-11-26T09:00:00Z")), false);
});

test("isRecallEligible enforces 6-month window, opt-out, future appt, and deduplication", () => {
    const now = new Date("2026-11-26T09:00:00Z");
    const sixMonthsAgo = new Date("2026-05-25T09:00:00Z");

    assert.equal(
        isRecallEligible({
            lastCompletedAt: sixMonthsAgo,
            hasFutureAppt: false,
            deletedAt: null,
            isActive: true,
            recallOptOut: false,
            lastRecallSentAt: null,
            now,
        }),
        true
    );

    assert.equal(
        isRecallEligible({
            lastCompletedAt: sixMonthsAgo,
            hasFutureAppt: false,
            deletedAt: null,
            isActive: true,
            recallOptOut: true,
            lastRecallSentAt: null,
            now,
        }),
        false
    );

    assert.equal(
        isRecallEligible({
            lastCompletedAt: sixMonthsAgo,
            hasFutureAppt: true,
            deletedAt: null,
            isActive: true,
            recallOptOut: false,
            lastRecallSentAt: null,
            now,
        }),
        false
    );

    assert.equal(
        isRecallEligible({
            lastCompletedAt: sixMonthsAgo,
            hasFutureAppt: false,
            deletedAt: null,
            isActive: true,
            recallOptOut: false,
            lastRecallSentAt: new Date("2026-10-15T09:00:00Z"),
            now,
        }),
        false
    );
});
