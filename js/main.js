let chars;

const init = () => {
  
  
  const firstI = chars[0].chars.filter(char => char.dataset['char'] === 'i')[0];
  const firstIRect = firstI.getBoundingClientRect();
  const firstICenterX = firstIRect.x + firstIRect.width / 2;

  const circleRect = document.getElementById('circle').getBoundingClientRect();
  const circleFinalX = firstICenterX - (circleRect.x + circleRect.width / 2) - 10;

  const circleTargetY = firstIRect.y - (circleRect.y + circleRect.height / 2) + 110;


  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".subtitle",
      start: "top top", // when the top of the trigger hits the top of the viewport
      pin: '.subtitle',
      end: '+=1500',
      scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      // markers: true,
    }
  });

  tl.to('.hero', { y: '-100%', duration: 1 });
  tl.fromTo('#circle', { x: circleFinalX, scale: 3.7 }, { duration: 2.5, y: circleTargetY, scale: 0}, "-=2");
  tl.to('#circle', { duration: 0.3, opacity: 0 }, "-=0.2");
  tl.from('h2 .char', {opacity: 0, y: '190%', stagger: 0.15, duration: 1.5}, '-=2.5')
}

const warmUp = () => {
  gsap.registerPlugin(ScrollTrigger);
  chars = Splitting();
  init();
}

warmUp();
