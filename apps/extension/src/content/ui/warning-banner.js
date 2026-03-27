export function createWarningBanner(node, result, options) {
  const parent = node.parentNode;
  if (!parent) return null;

  const compactPreview = Boolean(options.compactPreview);
  const bannerMessage =
    options.bannerMessage || "Se detecto un mensaje potencialmente peligroso";

  const wrapper = document.createElement("div");
  wrapper.className = "escudo-warning-wrapper";
  wrapper.dataset.risk = result.riskLevel;
  if (compactPreview) {
    wrapper.dataset.compact = "true";
  }

  const banner = document.createElement("div");
  banner.className = "escudo-warning-banner";
  banner.innerHTML = compactPreview
    ? `
      <div class="escudo-banner-header">
        <span class="escudo-icon">${result.emoji}</span>
        <span class="escudo-title">ESCUDO DIGITAL</span>
      </div>
      <div class="escudo-banner-body">
        <p>${bannerMessage}</p>
      </div>
    `
    : `
      <div class="escudo-banner-header">
        <span class="escudo-icon">${result.emoji}</span>
        <span class="escudo-title">ESCUDO DIGITAL - ${result.riskLevel === "HIGH" ? "RIESGO ALTO" : "ADVERTENCIA"}</span>
        <span class="escudo-badge">${result.category}</span>
      </div>
      <div class="escudo-banner-body">
        <p>Se detecto un mensaje potencialmente peligroso: <strong>${result.category}</strong></p>
        <div class="escudo-actions">
          <button class="escudo-btn escudo-btn-show">Ver mensaje</button>
          <button class="escudo-btn escudo-btn-evidence">Guardar evidencia</button>
          <button class="escudo-btn escudo-btn-dismiss">✕ Ignorar</button>
        </div>
      </div>
    `;

  let hidden = Boolean(options.initiallyHidden);
  if (options.forceHidden) hidden = true;
  if (hidden) node.style.display = "none";

  const showButton = banner.querySelector(".escudo-btn-show");
  const evidenceButton = banner.querySelector(".escudo-btn-evidence");
  const dismissButton = banner.querySelector(".escudo-btn-dismiss");

  if (showButton) {
    showButton.addEventListener("click", () => {
      hidden = !hidden;
      node.style.display = hidden ? "none" : "";
      showButton.textContent = hidden ? "👁️ Ver mensaje" : "🙈 Ocultar";
    });
  }

  evidenceButton?.addEventListener("click", () => {
    if (typeof options.onSaveEvidence === "function") {
      options.onSaveEvidence();
    }
  });

  dismissButton?.addEventListener("click", () => {
    wrapper.remove();
    node.style.display = "";
    if (typeof options.onDismiss === "function") {
      options.onDismiss();
    }
  });

  wrapper.appendChild(banner);
  parent.insertBefore(wrapper, node);
  wrapper.appendChild(node);

  return wrapper;
}
