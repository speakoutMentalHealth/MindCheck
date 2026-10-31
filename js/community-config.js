/* Adult-only public sign-in gateway is available for volunteer registration.
 * The independent forum room-release gate stays disabled until verified membership,
 * moderator coverage and backend production acceptance are complete. This client
 * never grants adult/room entitlement; Firestore rules enforce all access.
 */
window.MindCheckCommunityConfig = Object.freeze({
  enabled: false,
  gatewayEnabled: true,
  destination: "https://speakoutmentalhealth.org/forum.html"
});
