// ParticleEffect.js
import React, { useLayoutEffect, useRef } from 'react';

const ParticleEffect = () => {
  const canvasRef = useRef();
  let canvas;
  let context;
  let particles = [];
  let mouseX, mouseY;
  let centerX, centerY;
  let canvasWidth, canvasHeight;
  let speed = 2;
  let targetSpeed = 2;

  const randomizeParticle = (p) => {
    p.x = Math.random() * canvasWidth;
    p.y = Math.random() * canvasHeight;
    p.z = Math.random() * 1500 + 500;
    return p;
  };

  useLayoutEffect(() => {
    canvas = canvasRef.current;
    context = canvas.getContext('2d');

    const resize = () => {
      canvasWidth = canvas.width = window.innerWidth;
      canvasHeight = canvas.height = window.innerHeight;
      centerX = canvasWidth * 0.5;
      centerY = canvasHeight * 0.5;
      context.fillStyle = 'rgb(255, 255, 255)';
    };

    document.addEventListener('resize', resize);
    resize();

    mouseX = centerX;
    mouseY = centerY;

    for (let i = 0; i < 500; i++) {
      particles[i] = randomizeParticle({});
      particles[i].z -= 500 * Math.random();
    }

    const loop = () => {
      context.save();
      context.fillStyle = 'rgb(0, 0, 0)';
      context.fillRect(0, 0, canvasWidth, canvasHeight);
      context.restore();

      speed += (targetSpeed - speed) * 0.01;

      for (let i = 0; i < 500; i++) {
        const p = particles[i];

        p.pastZ = p.z;
        p.z -= speed;

        if (p.z <= 0) {
          randomizeParticle(p);
          continue;
        }

        const cx = centerX - (mouseX - centerX) * 1.25;
        const cy = centerY - (mouseY - centerY) * 1.25;

        const rx = p.x - cx;
        const ry = p.y - cy;

        const f = 500 / p.z;
        const x = cx + rx * f;
        const y = cy + ry * f;
        const r = 0.5 * f;

        const pf = 500 / p.pastZ;
        const px = cx + rx * pf;
        const py = cy + ry * pf;
        const pr = 0.5 * pf;

        const a = Math.atan2(py - y, px - x);
        const a1 = a + Math.PI * 0.5;
        const a2 = a - Math.PI * 0.5;

        context.beginPath();
        context.moveTo(px + pr * Math.cos(a1), py + pr * Math.sin(a1));
        context.arc(px, py, pr, a1, a2, true);
        context.lineTo(x + r * Math.cos(a2), y + r * Math.sin(a2));
        context.arc(x, y, r, a2, a1, true);
        context.closePath();
        context.fill();
      }

      requestAnimationFrame(loop);
    };

    const mouseMoveHandler = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const mouseDownHandler = () => {
      targetSpeed = 300;
    };

    const mouseUpHandler = () => {
      targetSpeed = 2;
    };

    document.addEventListener('mousemove', mouseMoveHandler, false);
    document.addEventListener('mousedown', mouseDownHandler, false);
    document.addEventListener('mouseup', mouseUpHandler, false);

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mousedown', mouseDownHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  }, []);

  return <canvas ref={canvasRef} id="c"></canvas>;
};

export default ParticleEffect;
