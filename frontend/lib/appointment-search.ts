/**
 * Builds Prisma `OR` filter clauses for querying appointments by patient name,
 * phone (including normalized local digits), MRN (`patientCode`), treatment, or ID.
 */
export function buildAppointmentSearchOr(rawQuery: string) {
  const query = rawQuery.trim();
  const orConditions: Record<string, unknown>[] = [
    { id: { contains: query, mode: "insensitive" } },
    { guestName: { contains: query, mode: "insensitive" } },
    { guestPhone: { contains: query, mode: "insensitive" } },
    { patient: { name: { contains: query, mode: "insensitive" } } },
    { patient: { phone: { contains: query, mode: "insensitive" } } },
    { treatment: { name: { contains: query, mode: "insensitive" } } },
  ];

  const digitsOnly = query.replace(/\D/g, "");
  if (digitsOnly.length >= 4) {
    let localNumber = digitsOnly;
    if (localNumber.startsWith("92") && localNumber.length > 2) {
      localNumber = localNumber.slice(2);
    } else if (localNumber.startsWith("0") && localNumber.length > 1) {
      localNumber = localNumber.slice(1);
    }
    orConditions.push({ guestPhone: { contains: localNumber } });
    orConditions.push({ patient: { phone: { contains: localNumber } } });
  }

  const numericQuery = parseInt(query.replace(/^#/, ""), 10);
  if (
    !Number.isNaN(numericQuery) &&
    numericQuery > 0 &&
    numericQuery <= 2147483647 &&
    query.length <= 9
  ) {
    orConditions.push({ patient: { patientCode: numericQuery } });
  }

  return orConditions;
}
