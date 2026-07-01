export class UseApiError extends Error {
  constructor(public status: number, public code: string, public safeMessage: string, public details?: unknown) { super(safeMessage); this.name = "UseApiError"; }
}
