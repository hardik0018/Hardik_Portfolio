export function splitChars(el: HTMLElement) {
  const text = el.innerText;
  el.innerHTML = text
    .split("")
    .map(c => c === " " 
      ? `<span style="display:inline-block;width:0.3em"> </span>` 
      : `<span style="display:inline-block;overflow:hidden">
           <span class="char" style="display:inline-block">${c}</span>
         </span>`)
    .join("");
  return el.querySelectorAll(".char");
}
