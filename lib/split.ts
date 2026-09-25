// Text splitting for the reveal system. Markup such as <br> and <em> is preserved and every split can be reverted.

/** Wraps each word in a clipping span with an inner span that can slide up out of it. */
export function splitMask(root: HTMLElement) {
  const original = root.innerHTML;
  const inner: HTMLElement[] = [];
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        (child.textContent ?? "").split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { fragment.appendChild(document.createTextNode(" ")); return; }
          const mask = document.createElement("span");
          mask.className = "mw";
          const slide = document.createElement("span");
          slide.className = "mi";
          slide.textContent = part;
          mask.appendChild(slide);
          inner.push(slide);
          fragment.appendChild(mask);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName !== "BR") {
        walk(child);
      }
    });
  };
  walk(root);
  return { inner, revert: () => { root.innerHTML = original; } };
}

/** Groups the masked words of an element into visual lines, so a heading can rise line by line (hero only). */
export function lines(words: HTMLElement[]) {
  const rows: HTMLElement[][] = [];
  let top = Number.NaN;
  words.forEach((word) => {
    const y = Math.round(word.parentElement!.offsetTop);
    if (y !== top) { rows.push([]); top = y; }
    rows[rows.length - 1].push(word);
  });
  return rows;
}
