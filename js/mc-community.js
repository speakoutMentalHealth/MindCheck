/* Adult MindCheck community handoff. Does not claim or grant adult entitlement.
 * Restricted content is controlled by the SpeakOut Forum backend, never these flags.
 */
(() => {
  "use strict";
  const config = window.MindCheckCommunityConfig || {};
  const status = document.getElementById("mcCommunityStatus");
  const open = document.getElementById("mcCommunityOpen");
  const pending = document.getElementById("mcCommunityNotOpen");
  if (!status || !open || !pending) return;
  let adultPath = false;
  try {
    adultPath = sessionStorage.getItem("mc-age-entry-band") === "adult" &&
      sessionStorage.getItem("mc-age-entry-adult") === "1";
  } catch (_) {}
  const approvedHost = "https://speakoutmentalhealth.org";
  const approvedPath = "/forum.html";
  let validDestination = false;
  try {
    const url = new URL(config.destination);
    validDestination = url.origin === approvedHost && url.pathname === approvedPath &&
      url.search === "" && url.hash === "";
  } catch (_) {}
  if (config.enabled !== true || !adultPath || !validDestination) return;
  // This only links out to a separate account. No MindCheck data is ever sent.
  open.href = approvedHost + approvedPath;
  open.hidden = false;
  pending.hidden = true;
  status.textContent = "The SpeakOut Community is available for approved adult members. A separate verified forum account is required to participate.";
})();
