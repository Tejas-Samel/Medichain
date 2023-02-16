import React, { Component } from 'react';

class Sectionthree extends Component {
    state = {  } 
    render() { 
        return (
            <section id="about" class="about-section pt-150">
            <div class="container">
              <div class="row align-items-center">
                <div class="col-xl-6 col-lg-6">
                  <div class="about-img">
                    <img src="assets/img/about/about-1.png" alt="" class="w-100" />
                    <img
                      src="assets/img/about/about-left-shape.svg"
                      alt=""
                      class="shape shape-1"
                    />
                    <img
                      src="assets/img/about/left-dots.svg"
                      alt=""
                      class="shape shape-2"
                    />
                  </div>
                </div>
                <div class="col-xl-6 col-lg-6">
                  <div class="about-content">
                    <div class="section-title mb-30">
                      <h2 class="mb-25 wow fadeInUp" data-wow-delay=".2s">
                        Perfect Solution Thriving Online Business
                      </h2>
                      <p class="wow fadeInUp" data-wow-delay=".4s">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                        dinonumy eirmod tempor invidunt ut labore et dolore magna
                        aliquyam erat, sed diam voluptua. At vero eos et accusam et
                        justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                        sea takimata sanctus est Lorem.Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                    <a
                      href="javascript:void(0)"
                      class="main-btn btn-hover border-btn wow fadeInUp"
                      data-wow-delay=".6s"
                      >Discover More</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
    }
}
 
export default Sectionthree;






