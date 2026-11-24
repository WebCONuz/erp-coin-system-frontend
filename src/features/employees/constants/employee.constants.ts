export const employeeKeys = {
  allEmployees: (params?: Record<string, unknown>) => [
    "all-employees",
    params ?? {},
  ],
  oneEmployeeById: (id: string) => ["one-employee-by-id", id],
} as const;

export const ALL_VALUE = "all";
