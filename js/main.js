let chars;
let timeLine;
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

  charsGroups.forEach((group, groupIndex) => {
    group.forEach((char, index) => {
      let orientation = index % 3 === 0 ? -1 : 1;
      if (groupIndex === 1 && index === 1) {
        orientation = -1;
      } 
      const maxAngle = (index - 1) % 3 === 0 ? 15 : 25;
      const minAngle = (index - 1) % 3 === 0 ? 10 : 15;
      const angle = Math.max(Math.random() * maxAngle, minAngle) * orientation; // max rotation angle 6deg
      const translation = Math.random() * 20 * orientation; // max translation value 12px
      char.dataset['collisionData'] = `{ "angle": ${angle.toFixed(2)}, "x": ${translation.toFixed(2)} }`;
    })
  }); 



  circle.style.left = `${circleFinalX}px`;


  timeLine = gsap.timeline({
    scrollTrigger: {
      trigger: ".subtitle",
      start: "top top", // when the top of the trigger hits the top of the viewport
      pin: '.subtitle',
      end: '+=5000',
      scrub: 1.5, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      // markers: true,
    },
    onUpdate: timelineUpdate,
  });

  

  timeLine.to('.hero', { y: '-100%', duration: 8});
  timeLine.to('#circle', { duration: 8, y: circleTargetY }, "-=8");
  timeLine.fromTo('#circle', { scale: scaleToApply }, { duration: 10.3, scale: 0}, "-=8");
  timeLine.to('#circle', { duration: 0.3, opacity: 0 }, "-=0.2");
  timeLine.from('.subtitle h2 .char', { opacity: 0, y: '120%', stagger: 0.8, duration: 5 }, '-=9.5');
  timeLine.from('.subtitle .column', { y: '50vh', stagger: 3, duration: 9, ease: 'linear' });

  chars.forEach((char, index) => {
    const { angle, x } = JSON.parse(char.dataset.collisionData);
    const stagger = 3;
    const animation = { y: '-80vh', rotationZ: angle, x: x, duration: 9 };
    const factor = index % stagger === 0 ? 0 : 3;
    const delay = 6 + factor;

    timeLine.to(char, animation, `-=${delay}`)
  });

  timeLine.to('.subtitle .column', { y: '-155vh', stagger: 3, duration: 21 }, '-=15');
  timeLine.to('.mario', { opacity: 1, duration: 8 }, '-=13');
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
  if (timeLine.progress() > animationTreshold && !subtitleOverflowVisible) {
    toggleSubtitleOverflow(true);
  } else if (timeLine.progress() <= animationTreshold && subtitleOverflowVisible) {
    toggleSubtitleOverflow(false);
  }
};

const toggleSubtitleOverflow = (makeItVisible) => {
  document.querySelector('.subtitle h2').style.overflow = makeItVisible ? 'visible' : 'hidden';
  subtitleOverflowVisible = makeItVisible;
};

const getRandomAngle = () => {

}

warmUp(); 
