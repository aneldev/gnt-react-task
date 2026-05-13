interface NavigatorExtended extends Navigator {
  userAgentData?: { platform: string };
}

export const isMac = (() => {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as NavigatorExtended;
  if (nav.userAgentData?.platform) {
    // Modern browsers (Chromium-based)
    return nav.userAgentData.platform.toLowerCase().includes('mac');
  }
  // Fallback for older browsers
  const platform = nav.platform || '';
  return platform.toLowerCase().startsWith('mac');
})();
