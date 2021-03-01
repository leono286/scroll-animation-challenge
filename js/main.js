let chars;
let masterTl;
let subtitleOverflowVisible = false;

const init = () => {
  
  chars = chars[0].chars;
  
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  
  const firstI = chars.filter(char => char.dataset['char'] === 'i')[0];
  const firstIRect = firstI.getBoundingClientRect();
  const firstICenterX = firstIRect.x + firstIRect.width / 2;
  const customFixFactor = 0.0113 * firstICenterX;


  const circle = document.getElementById('circle');
  const circleRect = circle.getBoundingClientRect();
  let circleFinalX = firstICenterX - circleRect.width / 2 - customFixFactor;


  const scaleToApply = vw * 0.9 / 500;

  const circleTargetY = firstIRect.y + (0.33 * firstIRect.height) - circleRect.y - circleRect.width / 2;


  
  const subtitle = document.querySelector('.subtitle h2');
  const subtitleRect = subtitle.getBoundingClientRect();
  const subtitleVisualBottom = subtitleRect.y + 0.82 * subtitleRect.height;

  const grid = document.querySelector('.subtitle .grid');
  grid.style.top = `${subtitleVisualBottom}px`

  const charsGroups = [];
  for (let index = 0; index < chars.length; index += 3) {
    charsGroups.push(chars.slice(index, index + 3));
  }

  



  circle.style.left = `${circleFinalX}px`;


  masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".subtitle",
      start: "top top", // when the top of the trigger hits the top of the viewport
      pin: '.subtitle',
      end: '+=3500',
      scrub: 1.5, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      // markers: true,
    },
    onUpdate: timelineUpdate,
  });



  masterTl.to('.hero', { y: '-100%', duration: 8});
  masterTl.to('#circle', { duration: 8, y: circleTargetY }, "-=8");
  masterTl.fromTo('#circle', { scale: scaleToApply }, { duration: 10.3, scale: 0}, "-=8");
  masterTl.to('#circle', { duration: 0.3, opacity: 0 }, "-=0.2");
  masterTl.from('.subtitle h2 .char', { opacity: 0, y: '120%', stagger: 0.8, duration: 5 }, '-=9.5');
  masterTl.fromTo('.subtitle .column', { y: '50vh', stagger: 3, duration: 9 }, { y: '-50vh', stagger: 3, duration: 9 });
  masterTl.to(charsGroups[0], { y: '-75vh', duration: 9}, '-=12.35');
  masterTl.to(charsGroups[1], { y: '-75vh', duration: 9}, '-=9.35');
  masterTl.to(charsGroups[2], { y: '-75vh', duration: 9 }, '-=6.35');
}

const warmUp = () => {
  chars = Splitting({
    target: "[data-splitting]",
    by: "chars",
  });
  gsap.registerPlugin(ScrollTrigger);
  setTimeout(() => {
    init();
  }, 350);
}

const timelineUpdate = () => {
  const animationTreshold = 0.42;
  if (masterTl.progress() > animationTreshold && !subtitleOverflowVisible) {
    toggleSubtitleOverflow(true);
  } else if (masterTl.progress() <= animationTreshold && subtitleOverflowVisible) {
    toggleSubtitleOverflow(false);
  }
};

const toggleSubtitleOverflow = (makeItVisible) => {
  document.querySelector('.subtitle h2').style.overflow = makeItVisible ? 'visible' : 'hidden';
  subtitleOverflowVisible = makeItVisible;
};

warmUp(); 
