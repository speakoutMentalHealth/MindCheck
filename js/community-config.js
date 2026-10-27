/* Disabled until SpeakOut Forum passes privacy, moderation and age-verification release gates.
 * This switch changes navigation only. The forum backend must independently verify adult grants.
 * Do NOT enable by changing client code alone; confirm the destination is production ready.
 */
window.MindCheckCommunityConfig = Object.freeze({
  enabled: false,
  destination: "https://speakoutmentalhealth.org/forum.html"
});
