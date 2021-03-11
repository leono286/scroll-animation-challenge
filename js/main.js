let splittedText, timeline, vw, vh, scrollTrigger, scrollDuration;
let subtitleOverflowVisible = false;
let processingResize = false;
let fisrtLoad = true;

const setUpTransitions = () => {
  
  const chars = splittedText[0].chars;
    
  // i char processing to find x coordinate for the dot of the i letter.
  const firstI = chars.filter(char => char.dataset['char'] === 'i')[0];
  const firstIRect = firstI.getBoundingClientRect();
  const firstICenterX = firstIRect.x + firstIRect.width / 2;
  const customFixDistance = 0.0113 * firstICenterX;


  // Position the center of the circle in the same x coordinate value that the dot of the i letter has. 
  const circle = document.getElementById('circle');
  const circleRect = circle.getBoundingClientRect();
  let circleFinalX = firstICenterX - circleRect.width / 2 - customFixDistance;
  circle.style.left = `${circleFinalX}px`;


  // Find the scale to apply to the circle to make it grow up to 90% of viewport width, no matter the screen size.
  const scaleToApply = vw * 0.9 / 500;


  // get the required translation of the circle over the y axis to align its center with the center of the dot over the i.
  // 33% is ~ the value meassured from the top of the span's box to the center of the dot. % to ensure responsiveness.
  const circleTargetY = firstIRect.y + (0.33 * firstIRect.height) - circleRect.y - circleRect.width / 2;


  // process the text to find the bottom line of the text and make it set as top position for the grid that contains the columns
  const subtitle = document.querySelector('.subtitle h2');
  const subtitleRect = subtitle.getBoundingClientRect();
  const subtitleVisualBottom = subtitleRect.y + 0.82 * subtitleRect.height;
  const grid = document.querySelector('.subtitle .grid');
  grid.style.top = `${subtitleVisualBottom}px`

  
  // TODO: improve this logic, I think I don't need to split them in groups anymore, also to avoid nested for.
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
      const maxAngle = (index - 1) % 3 === 0 ? 20 : 35;
      const minAngle = (index - 1) % 3 === 0 ? 15 : 20;
      const angle = Math.max(Math.random() * maxAngle, minAngle) * orientation; // max rotation angle 6deg
      const translation = Math.random() * 25 * orientation; // max translation value 12px
      char.dataset['collisionData'] = `{ "angle": ${angle.toFixed(2)}, "x": ${translation.toFixed(2)} }`;
    })
  }); 

  
  //Set up the timeline
  timeline = gsap.timeline({
    scrollTrigger: {
      id: 'scrollTriggerId',
      trigger: ".subtitle",
      start: "top top", // when the top of the trigger hits the top of the viewport
      pin: '.subtitle',
      end: `+=${scrollDuration}`,
      scrub: 1.5, // smooth scrubbing, takes 1.5 second to "catch up" to the scrollbar
      onUpdate: self =>  {scrollTriggerProgress = self.progress}
      // markers: true,
    },
    onUpdate: timelineUpdate,
  });

  
  timeline.to('.hero', { y: '-100%', duration: 8, id: 'first'});
  timeline.fromTo('#circle', {y: '30vh'}, { duration: 8, y: circleTargetY }, "-=8");
  timeline.fromTo('#circle', { scale: scaleToApply }, { duration: 10.3, scale: 0}, "-=8");
  timeline.to('#circle', { duration: 0.3, opacity: 0 }, "-=0.2");
  timeline.from('.subtitle h2 .char', { y: '120%', stagger: 0.8, duration: 5 }, '-=9.5');
  timeline.from('.subtitle h2 .char', { opacity: 0, stagger: 0.8, duration: 4 }, '-=10');
  timeline.from('.subtitle .column', { y: '50vh', stagger: 2, duration: 6, ease: 'linear' });

  chars.forEach((char, index) => {
    const { angle, x } = JSON.parse(char.dataset.collisionData);
    const animation = { y: '-80vh', rotationZ: angle, x: x, duration: 9 };
    let delay; 

    switch (index) {
      case 0:
        delay = 4;
        break;
    
      case 3:
      case 6:
        delay = 7;
        break;
      
      default:
        delay = 9;
        break;
    }

    timeline.to(char, animation, `-=${delay}`)
  });

  timeline.to('.subtitle .column', { y: `-${subtitleVisualBottom + vh}`, stagger: 2, duration: 23 }, '-=13');
  timeline.to('.goomba', { opacity: 1, duration: 8 }, '-=14');

  fisrtLoad && showLoading(false);
}




const timelineUpdate = () => {
  const animationTreshold = 0.3;
  if (timeline.progress() > animationTreshold && !subtitleOverflowVisible) {
    toggleSubtitleOverflow(true);
  } else if (timeline.progress() <= animationTreshold && subtitleOverflowVisible) {
    toggleSubtitleOverflow(false);
  }
};





const toggleSubtitleOverflow = (makeItVisible) => {
  document.querySelector('.subtitle h2').style.overflow = makeItVisible ? 'visible' : 'hidden';
  subtitleOverflowVisible = makeItVisible;
};




const init = async () => {
  vw = document.documentElement.clientWidth;
  vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  scrollDuration = vh * 4;
  splittedText = Splitting({
    target: "[data-splitting]",
    by: "chars",
  });
  gsap.registerPlugin(ScrollTrigger);
  await sleep(150);
  setUpTransitions();

  window.addEventListener('resize', () => { !processingResize && shouldReset()})
}




const shouldReset = () => {
  const vwCurrent = document.documentElement.clientWidth;
  Math.abs(vwCurrent - vw) > 10 && reload() ;
}




const resetTextSplitted = () => {
  document.querySelector('h2[data-splitting]').outerHTML = '<h2 data-splitting>Alignment</h2>';
}




const reload = async () => {
  processingResize = true;
  showLoading(true);
  resetTextSplitted();  
  const scrollTrigger = ScrollTrigger.getById("scrollTriggerId");
  const currentProgress = scrollTrigger.progress;
  scrollTrigger.scroll(0);
  timeline.pause(0).kill(true);
  scrollTrigger.kill(true);

  const itemsToReset = ['.hero', '#circle', '.subtitle .column']
  itemsToReset.forEach(item => { gsap.set(item, { clearProps: true }) });

  init();
  await sleep(300);
  
  const newScrollTrigger = ScrollTrigger.getById("scrollTriggerId");
  const targetScroll = currentProgress * scrollDuration;
  timeline.progress(currentProgress);
  newScrollTrigger.scroll(targetScroll);
  await sleep(400);
  timelineUpdate();
  processingResize = false;
  showLoading(false);
}





const showLoading = (show) => {
  const body = document.body;
  if (show) {
    body.classList.add('loading');
  } else {
    body.classList.remove('loading');
  }
}





const sleep = t => new Promise(resolve => setTimeout(resolve, t));





init(); 


//instantiate GSDevTools with default settings
// GSDevTools.create();
