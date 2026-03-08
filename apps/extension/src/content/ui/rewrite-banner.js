let rewriteBanner = null;

export function showRewriteSuggestion(target, suggestion) {
  removeRewriteSuggestion();

  rewriteBanner = document.createElement("div");
  rewriteBanner.className = "escudo-rewrite-banner";
  rewriteBanner.innerHTML = `
    <span class="escudo-rewrite-icon">✍️</span>
    <div class="escudo-rewrite-content">
      <strong>Escudo Digital sugiere:</strong>
      <p>${suggestion}</p>
    </div>
    <button class="escudo-rewrite-close" title="Cerrar">✕</button>
  `;

  const closeButton = rewriteBanner.querySelector(".escudo-rewrite-close");
  closeButton?.addEventListener("click", removeRewriteSuggestion);

  const rect = target.getBoundingClientRect();
  rewriteBanner.style.bottom = `80px`;
  rewriteBanner.style.left = `${rect.left + window.scrollX}px`;

  document.body.appendChild(rewriteBanner);
}

export function removeRewriteSuggestion() {
  if (!rewriteBanner) return;
  rewriteBanner.remove();
  rewriteBanner = null;
}
