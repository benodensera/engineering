// capabilities reveal

const capabilityCards = gsap.utils.toArray(".capability-card");

capabilityCards.forEach((card, index) => {
    gsap.set(card, {
        opacity: 0,

        y: 80,

        scale: 0.96,

    });

    ScrollTrigger.create({
        trigger: card,

        start: "top 88%",

        onEnter: () => {
            gsap.to(card, {
                opacity: 1,

                y: 0,

                scale: 1,

                duration: 0.9,

                delay: (index % 3) * 0.15,

                ease: "power2.out",
            });
        },

        onLeaveBack: () => {
            gsap.to(card, {
                opacity: 0,

                y: 50,

                scale: 0.96,

                duration: 0.45,

                ease: "power2.out",
            });
        },
    });
});