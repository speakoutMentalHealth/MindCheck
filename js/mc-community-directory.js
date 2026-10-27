/* Visual space-category filtering only. No forum data or account access is requested. */
(() => {
  "use strict";
  const controls = [...document.querySelectorAll("[data-c-filter]")];
  const cards = [...document.querySelectorAll("#mcRoomDirectory .mc-c-room")];
  const empty = document.getElementById("mcDirectoryEmpty");
  if (!controls.length || !cards.length || !empty) return;
  function select(type) {
    if (!["all","learn","opportunity","connect"].includes(type)) return;
    controls.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.cFilter === type)));
    let visible = 0;
    cards.forEach(card => {
      const shown = type === "all" || card.dataset.group === type;
      card.hidden = !shown;
      if (shown) visible++;
    });
    empty.hidden = visible !== 0;
  }
  controls.forEach(button => button.addEventListener("click", () => select(button.dataset.cFilter)));

  // Explicitly labelled UI walkthroughs, not production Firestore room access.
  // IDs here identify fictional demo rooms; they do not grant membership.
  const demoRoomIds = [
    "start-here", "learn-build", "opportunities-careers",
    "networking-mentorship", "projects-volunteering", "private-groups"
  ];
  cards.forEach((card, index) => {
    const id = demoRoomIds[index];
    if (!id) return;
    const title = card.querySelector("h3")?.textContent || "Community room";
    const link = document.createElement("a");
    link.className = "mc-c-room-preview-link";
    link.href = "community-preview.html?room=" + encodeURIComponent(id);
    link.textContent = "Try room ›";
    link.setAttribute("aria-label", "Open interactive preview of " + title + " (demonstration only)");
    card.querySelector(".mc-c-chevron")?.replaceWith(link);
  });
})();
