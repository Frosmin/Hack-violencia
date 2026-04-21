export function createWarningBanner(node, result, options) {
  const wrapper = document.createElement("div");
  wrapper.className = "escudo-warning-wrapper";
  wrapper.dataset.risk = result.riskLevel;

  const banner = document.createElement("div");
  banner.className = "escudo-warning-banner";
  banner.innerHTML = `
    <div class="escudo-banner-header">
      <span class="escudo-icon">⚠️</span>
      <span class="escudo-title">ESCUDO DIGITAL - CONTENIDO POTENCIALMENTE HOSTIL</span>
      <span class="escudo-badge">${result.category}</span>
    </div>
    <div class="escudo-banner-body">
      <p>Tu mensaje contiene contenido que puede ser hostil o violento.</p>
      <div class="escudo-actions">
        <button class="escudo-btn escudo-btn-send">Enviar igual</button>
        <button class="escudo-btn escudo-btn-edit">✏️ Modificar</button>
        <button class="escudo-btn escudo-btn-cancel">✕ Cancelar</button>
      </div>
    </div>
  `;

  const sendBtn = banner.querySelector(".escudo-btn-send");
  const editBtn = banner.querySelector(".escudo-btn-edit");
  const cancelBtn = banner.querySelector(".escudo-btn-cancel");

  sendBtn?.addEventListener("click", () => {
    wrapper.remove();
    if (typeof options.onSendAnyway === "function") {
      options.onSendAnyway();
    }
  });

  editBtn?.addEventListener("click", () => {
    wrapper.remove();
    if (typeof options.onEdit === "function") {
      options.onEdit();
    }
  });

  cancelBtn?.addEventListener("click", () => {
    wrapper.remove();
    if (typeof options.onCancel === "function") {
      options.onCancel();
    }
  });

  const parent = node.parentNode;
  if (parent) {
    parent.insertBefore(wrapper, node);
  } else {
    document.body.appendChild(wrapper);
  }

  return wrapper;
}
