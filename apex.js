(function initPricingIsland() {
  const root = document.querySelector("[data-pricing-root]");
  const currencySelect = document.querySelector("#currencySelect");
  const cycleButtons = Array.from(document.querySelectorAll(".cycle-toggle"));
  if (!root || !currencySelect || cycleButtons.length === 0) return;

  const matrix = Object.freeze({
    tiers: {
      starter: { baseMonthlyUsd: 24, complexity: 1 },
      growth: { baseMonthlyUsd: 59, complexity: 1.08 },
      scale: { baseMonthlyUsd: 129, complexity: 1.16 }
    },
    cycles: {
      monthly: { months: 1, discount: 1, label: "/mo" },
      annual: { months: 12, discount: 0.8, label: "/yr" }
    },
    currencies: {
      INR: { code: "INR", rate: 83, tariff: 0.92, locale: "en-IN" },
      USD: { code: "USD", rate: 1, tariff: 1, locale: "en-US" },
      EUR: { code: "EUR", rate: 0.93, tariff: 1.08, locale: "de-DE" },
      GBP: { code: "GBP", rate: 0.79, tariff: 1.04, locale: "en-GB" }
    }
  });

  let activeCycle = "monthly";
  let activeCurrency = currencySelect.value;

  const priceNodes = Array.from(root.querySelectorAll(".price-card")).map((card) => ({
    tier: card.dataset.tier,
    priceNode: card.querySelector("[data-price]").firstChild || card.querySelector("[data-price]").appendChild(document.createTextNode("")),
    cycleNode: card.querySelector("[data-cycle-label]").firstChild || card.querySelector("[data-cycle-label]").appendChild(document.createTextNode(""))
  }));

  function computePrice(tierKey) {
    const tier = matrix.tiers[tierKey];
    const cycle = matrix.cycles[activeCycle];
    const currency = matrix.currencies[activeCurrency];
    return tier.baseMonthlyUsd * tier.complexity * cycle.months * cycle.discount * currency.rate * currency.tariff;
  }

  function formatPrice(value) {
    const currency = matrix.currencies[activeCurrency];
    const rounded = activeCurrency === "INR" ? Math.round(value / 10) * 10 : Math.round(value);
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: 0
    }).format(rounded);
  }

  function patchPriceText() {
    const cycleLabel = matrix.cycles[activeCycle].label;
    priceNodes.forEach(({ tier, priceNode, cycleNode }) => {
      priceNode.nodeValue = formatPrice(computePrice(tier));
      cycleNode.nodeValue = cycleLabel;
    });
  }

  cycleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCycle = button.dataset.cycle;
      cycleButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      patchPriceText();
    });
  });

  currencySelect.addEventListener("change", () => {
    activeCurrency = currencySelect.value;
    patchPriceText();
  });

  patchPriceText();
})();

(function initResponsiveWorkflow() {
  const layout = document.querySelector(".workflow-layout");
  if (!layout) return;

  const cards = Array.from(layout.querySelectorAll(".workflow-card:not(.utility-card)"));
  let activeIndex = Number(layout.dataset.activeIndex || 0);

  function setActive(index, animate) {
    activeIndex = index;
    layout.dataset.activeIndex = String(index);

    cards.forEach((card, cardIndex) => {
      const selected = cardIndex === index;
      const button = card.querySelector("button");
      card.classList.toggle("is-active", selected);
      button.setAttribute("aria-expanded", String(selected));

      if (animate && selected && card.animate) {
        card.animate([
          { transform: "translateY(4px)", opacity: 0.82 },
          { transform: "translateY(0)", opacity: 1 }
        ], { duration: 180, easing: "ease-out" });
      }
    });
  }

  function syncLayoutMode() {
    layout.dataset.layout = window.innerWidth <= 680 ? "accordion" : "bento";
    setActive(activeIndex, false);
  }

  cards.forEach((card, index) => {
    card.querySelector("button").addEventListener("click", () => setActive(index, true));
  });

  window.addEventListener("resize", syncLayoutMode, { passive: true });
  if ("ResizeObserver" in window) {
    new ResizeObserver(syncLayoutMode).observe(document.documentElement);
  }

  syncLayoutMode();
})();

(function initLaunchForm() {
  const form = document.querySelector(".launch-form");
  const status = document.querySelector(".form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    status.textContent = data.get("email")
      ? "Access request staged. Prototype is ready for judging."
      : "";
    form.reset();
  });
})();
document.addEventListener('DOMContentLoaded', () => {
    const ctaButton = document.getElementById('cta-button');
    const runButton = document.getElementById('run-button');

    if (ctaButton) {
        ctaButton.addEventListener('click', startSpeedrun);
    }

    if (runButton) {
        runButton.addEventListener('click', simulateAI);
    }
});

function simulateAI() {
    const outputBox = document.getElementById('output-screen');
    const clock = document.getElementById('speed-clock');
    const btnIcon = document.getElementById('btn-icon');
    const btnText = document.getElementById('btn-text');

    outputBox.classList.remove('success-glow');
    outputBox.innerHTML = "Processing tokens...";
    outputBox.style.color = "#ff9932";
    
    btnIcon.src = "arrow-path.svg";
    btnIcon.classList.add('icon-spin');
    btnText.innerText = "Running...";

    let startTime = performance.now();
    let timerInterval = setInterval(() => {
        let elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
        clock.innerHTML = elapsed + "s";
    }, 50);

    setTimeout(() => {
        clearInterval(timerInterval);
        clock.innerHTML = "0.41s ✨";
        outputBox.style.color = "#d9e8e2";
        outputBox.innerHTML = "<strong>Success:</strong> Generated fully responsive HTML/CSS Stripe checkout UI frame.";
        outputBox.classList.add('success-glow');
        
        btnIcon.src = "cog-8-tooth.svg";
        btnIcon.classList.remove('icon-spin');
        btnText.innerText = "Execute Run";
    }, 410);
}

function startSpeedrun() {
    const btn = document.getElementById('cta-button');
    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
        btn.style.transform = "none";
        alert("Account created instantly! Redirecting you to your temporary sandbox environment console dashboard...");
    }, 100);
}