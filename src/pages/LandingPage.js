// LandingPage.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typed from 'typed.js';
import ParticleEffect from '../Particleeffect';
import './Landingstyle.css';
import './TextAnimation.css';

const LandingPage = () => {
  console.log('Rendering LandingPage');
  const introText = `Step into coding's fast lane with our real-time editor—your ideas, instantly tangible.No more waiting;
Just code,
Collaborate and
Create with unprecedented speed.`;

  useEffect(() => {
    const typedSubHeading = new Typed('.sub-heading', {
      strings: ["The real-time code editor that unleashes your creativity."],
      typeSpeed: 65,
      showCursor: false,
    });
    return () => {
      typedSubHeading.destroy();
    };
  }, []); 

  return (
    <div>
      <div className="container">
        <svg viewBox="0 0 960 300">
          <symbol id="s-text">
            <text textAnchor="middle" x="50%" y="80%">Code-pulse</text>
          </symbol>

          <g className="g-ants">
            <use xlinkHref="#s-text" className="text-copy"></use>
            <use xlinkHref="#s-text" className="text-copy"></use>
            <use xlinkHref="#s-text" className="text-copy"></use>
            <use xlinkHref="#s-text" className="text-copy"></use>
            <use xlinkHref="#s-text" className="text-copy"></use>
          </g>
        </svg>
      </div>
      <section className="bg-hero" id="home">
        <div className="container">
          <div className="row vh-md-100">
            <div className="col-md-8 col-sm-10 col-12 mx-auto my-auto">
              {/* <h1 className="heading-black text-capitalize fadeInLeft">Code-pulse</h1> */}
              <h2 className="sub-heading text-capitalize fadeInLeft"></h2>
              <p className="lead-typed py-3 fadeInLeft">
                <span className="type-in">{introText.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}</span>
              </p>
              <Link to="/home" className="btn btn-primary d-inline-flex flex-row align-items-center">
                Get started now
                <em className="ml-2" data-feather="arrow-right"></em>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ParticleEffect />
      <div className="footer">
        &copy; 2023 Codepulse - All Rights Reserved
      </div>
    </div>
  );
};

export default LandingPage;
