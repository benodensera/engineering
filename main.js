// cursor

const lineX = document.querySelector(".guide-x");
const lineY = document.querySelector(".guide-y");
const cross = document.querySelector(".cursor-cross");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let currentX = mouseX;
let currentY = mouseY;

// cursor hotspot offset
const cursorOffsetX = -7.9;
const cursorOffsetY = -7.9;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animate() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    const finalX = currentX + cursorOffsetX;
    const finalY = currentY + cursorOffsetY;

    // horizontal line
    lineX.style.transform = `translateY(${finalY}px)`;

    // vertical line
    lineY.style.transform = `translateX(${finalX}px)`;

    // exact cursor tip
    cross.style.left = `${finalX}px`;
    cross.style.top = `${finalY}px`;

    requestAnimationFrame(animate);
}
animate();

// reveal after loader function

window.revealAfterLoader = function () {
    const elements = document.querySelectorAll(".reveal-element");

    elements.forEach((element) => {
        const delay = element.dataset.delay || 0;

        setTimeout(() => {
            element.classList.add("is-visible");
        }, delay);
    });
};
