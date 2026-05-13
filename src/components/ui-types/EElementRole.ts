export enum EElementRole {
  /**
   * Informational drawer showing secondary content (stats, summaries).
   */
  INFO = 'complementary',
  /**
   * Non‑modal tools for filtering/sorting the view.
   */
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  TOOLS = 'complementary',
  /**
   * Modal dialog requiring an action before returning to content.
   */
  DIALOG = 'dialog',
}
