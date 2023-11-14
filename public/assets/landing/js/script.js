function sequence_animation() {
  const canvas = document.querySelector('.about_bcg_image');
  const context = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  });

  function files(index) {
    var data = `assets/landing/images/device/1.webp
    assets/landing/images/device/2.webp
    assets/landing/images/device/3.webp
    assets/landing/images/device/4.webp
    assets/landing/images/device/5.webp
    assets/landing/images/device/6.webp
    assets/landing/images/device/7.webp
    assets/landing/images/device/8.webp
    assets/landing/images/device/9.webp
    assets/landing/images/device/10.webp
    assets/landing/images/device/11.webp
    assets/landing/images/device/12.webp
    assets/landing/images/device/13.webp
    assets/landing/images/device/14.webp
    assets/landing/images/device/15.webp
    assets/landing/images/device/16.webp
    assets/landing/images/device/17.webp
    assets/landing/images/device/18.webp
    assets/landing/images/device/19.webp
    assets/landing/images/device/20.webp
    assets/landing/images/device/21.webp
    assets/landing/images/device/23.webp
    assets/landing/images/device/24.webp
    assets/landing/images/device/25.webp
    assets/landing/images/device/26.webp
    assets/landing/images/device/27.webp
    assets/landing/images/device/28.webp
    assets/landing/images/device/29.webp
    assets/landing/images/device/30.webp
    assets/landing/images/device/31.webp
    assets/landing/images/device/32.webp
    assets/landing/images/device/33.webp
    assets/landing/images/device/34.webp
    assets/landing/images/device/35.webp
    assets/landing/images/device/36.webp
    assets/landing/images/device/37.webp
    assets/landing/images/device/38.webp
    assets/landing/images/device/39.webp
    assets/landing/images/device/40.webp
    `;
    return data.split('\n')[index];
  }

  const frameCount = 38;

  const images = [];
  const imageSeq = {
    frame: 0,
  };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = files(i);
    images.push(img);
  }

  setTimeout(() => {
    window.gsap.to(imageSeq, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: ".trigger_anim",
        scrub: 1.8,
        pin: true,
        end: "top bottom",
        start: "top 10%",
      },
      onUpdate: render,
    });
  }, 2000)

  images[1].onload = render;

  function render() {
    context.canvas.width = images[0].width;
    context.canvas.height = images[0].height;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[imageSeq.frame], 0, 0);
  }
}

sequence_animation();
