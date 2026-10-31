/* Filter conceptual space categories only. No demo posts, fake rooms, or account access. */
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

})();
