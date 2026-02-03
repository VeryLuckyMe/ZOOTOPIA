document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    let lastScrollY = window.scrollY;
    const header = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
            header.style.opacity = '0';
        } else if (currentScrollY < lastScrollY) {
            // Scrolling up
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
        }

        lastScrollY = currentScrollY;
    });

    const pawPositions = [
        { top: '8%', left: '5%', delay: '0s' },
        { top: '15%', right: '8%', delay: '0.5s' },
        { bottom: '20%', left: '10%', delay: '1s' },
        { bottom: '12%', right: '6%', delay: '1.5s' },
        { top: '35%', left: '3%', delay: '2s' },
        { bottom: '30%', right: '12%', delay: '2.5s' },
        { top: '45%', left: '7%', delay: '3s' },
        { bottom: '8%', right: '18%', delay: '3.5s' },
        { top: '25%', right: '15%', delay: '4s' },
        { bottom: '35%', left: '15%', delay: '4.5s' },
    ];
    // Note: The HTML already has some hardcoded paws. 
});
