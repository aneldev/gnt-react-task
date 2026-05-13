export enum ECSSDuration {
  SHORTEST = 'shortest',        // MUI's Default: 150ms
  SHORTER = 'shorter',          // MUI's Default: 200ms
  SHORT = 'short',              // MUI's Default: 250ms
  STANDARD = 'standard',        // MUI's Default: 300ms
  COMPLEX = 'complex',          // MUI's Default: 375ms
  ENTERING = 'enteringScreen',  // MUI's Default: 225ms
  LEAVING = 'leavingScreen',    // MUI's Default: 195ms
}

export const ECSSDurationValues: Record<ECSSDuration, number> = {
  [ECSSDuration.SHORTEST]: 150,
  [ECSSDuration.SHORTER]: 200,
  [ECSSDuration.SHORT]: 250,
  [ECSSDuration.STANDARD]: 300,
  [ECSSDuration.COMPLEX]: 375,
  [ECSSDuration.ENTERING]: 225,
  [ECSSDuration.LEAVING]: 195,
};
