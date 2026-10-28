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
  if (!adultPath || !validDestination || (config.gatewayEnabled !== true && config.enabled !== true)) return;
  // This is only an adult navigation link. The forum independently checks sign-in,
  // approved account, real adult verification, private-room grants and pilot release.
  // No MindCheck wellness information or date of birth is transmitted.
  open.href = approvedHost + approvedPath;
  open.textContent = config.enabled === true ? "Open SpeakOut Community" : "Sign in or apply for forum access";
  open.hidden = false;
  pending.hidden = true;
  status.textContent = config.enabled === true
    ? "Approved adult members can access assigned discussion rooms after signing in."
    : "Volunteer applications and approved-account sign-in are open. Private discussions remain invitation-only and will appear only after the controlled pilot is activated.";
})();
