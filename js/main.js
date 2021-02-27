console.log('splitting');

let chars;

let init = () => {
  chars = Splitting();
  const firstI = chars[0].chars.filter(char => char.dataset['char'] === 'i')[0];
  const firstIRect = firstI.getBoundingClientRect();
  const firstICenterX = firstIRect.x + firstIRect.width / 2;

  const circleRect = document.getElementById('circle').getBoundingClientRect();
  const circleFinalX = firstICenterX - (circleRect.x + circleRect.width / 2);

  const circleTargetY = firstIRect.y - (circleRect.y + circleRect.height / 2) + 92;
  const tl = gsap.timeline();
  console.log(circleRect);
  tl.fromTo('#circle', { x: circleFinalX, scale: 3 }, { duration: 3, y: circleTargetY, scale: 0});
  tl.to('#circle', { duration: 1, opacity: 0 }, "-=0.3");
}

init();
