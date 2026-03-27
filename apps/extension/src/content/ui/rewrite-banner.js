let rewriteBanner = null;

export function showRewriteSuggestion(target, suggestion) {
  removeRewriteSuggestion();

  rewriteBanner = document.createElement("div");
  rewriteBanner.className = "escudo-rewrite-banner";
  rewriteBanner.innerHTML = `
    <div class="escudo-rewrite-content">
      <strong style="font-size: 10px;">Escudo Digital sugiere:</strong>
      <p style="font-size: 9px;">${suggestion}</p>
    </div>
    <button class="escudo-rewrite-close" title="Cerrar" style="font-size: 10px;">✕</button>
  `;

  const closeButton = rewriteBanner.querySelector(".escudo-rewrite-close");
  closeButton?.addEventListener("click", removeRewriteSuggestion);

  const rect = target.getBoundingClientRect();
  rewriteBanner.style.bottom = `60px`;
  rewriteBanner.style.left = `${rect.left + window.scrollX}px`;
  rewriteBanner.style.maxWidth = "250px";

  document.body.appendChild(rewriteBanner);
}

export function removeRewriteSuggestion() {
  if (!rewriteBanner) return;
  rewriteBanner.remove();
  rewriteBanner = null;
}
