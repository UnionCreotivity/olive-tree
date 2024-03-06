import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

import {gsap} from './gsap/esm/index.js'
import {ScrollTrigger} from './gsap/esm/ScrollTrigger.js'

export default function caseTedJS () {
    var window_width = window.screen.width;
    var window_height = window.innerHeight;
    let vh = window.innerHeight * 0.01;

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    /* menu click */
    function menuClick() {
        let menu_btn = document.querySelector('.menu-btn');
        let menu_box = document.querySelector('.menu-box');
        let menu_close = document.querySelector('.close');
        var menu_tl = gsap.timeline({
            paused: true
        });
        var menu_close_tl = gsap.timeline({

        });

        menu_tl.
            to(menu_box,
                {
                    duration: 1,
                    opacity: 1,
                    zIndex: 9999,
                    // height: 'calc(var(--vh, 2.8vh) * 100)',
                    height: '100vh',
                    ease: "power1.inOut"
                }
            )
            .to('.menu .item',
                { duration: 1, opacity: 1, stagger: 0.2, ease: "power1.inOut", }, '<0.3')

            .fromTo(".menu-tree-shadow", {
                y: -10,
                x: -5,
                rotate: '-6deg',
            }, {
                y: 1,
                x: -10,
                rotate: '0deg',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 2,
            }, '<')


        menu_btn.addEventListener('click', () => {
            menu_tl.play(0);
            $('body').css('overflow', 'hidden');
        });

        menu_close.addEventListener('click', () => {
            $('body').css('overflow', 'visible');
            menu_close_tl
                .to('.menu .item',
                    { duration: 1, opacity: 0, stagger: 0.2, ease: "power1.inOut", })

                .to(menu_box,
                    {
                        duration: 1,
                        opacity: 0,
                        zIndex: 0,
                        height: '0vh',
                        ease: "power1.inOut"
                    }
                    , '<0.3')
        });
    };
    menuClick();


    if (window_width <= 1024) {
        var galleryThumbs = new Swiper('.gallery-thumbs', {
            spaceBetween: 5,
            slidesPerView: 4,
            // loop: true,
        });
    } else {
        var galleryThumbs = new Swiper('.gallery-thumbs', {
            spaceBetween: 30,
            slidesPerView: 6,
            // loop: true,
        });
    }

    var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 30,
        loop: true,
        effect: "fade",
        speed: 500,
        // loopedSlides: 6, 
        navigation: {
            prevEl: '.main-banner-box-prev',
            nextEl: '.main-banner-box-next',
        },
        thumbs: {
            swiper: galleryThumbs,
        },
        pagination: {
            el: '.swiper-pagination',
        },
    });


    var video_swiper = new Swiper(".video-swiper", {
        navigation: {
            prevEl: '.video-banner-box-prev',
            nextEl: '.video-banner-box-next',
        },

        pagination: {
            el: '.swiper-pagination-video',
        },
        effect: "fade",
        on: {
            slideChangeTransitionStart: function () {

                $('.yt_player_iframe').each(function () {
                    var video_el_src = $(this).attr("src");
                    $(this).attr("src", video_el_src);
                });

            }
        },
    });


    const swiper1 = new Swiper(".swiper1", {
        // autoplay: true,
        loop: true,
        effect: "fade",
    });
    const swiper2 = new Swiper(".swiper2", {
        // autoplay: true,
        loop: true,
        effect: "fade",
    });
    const swiper3 = new Swiper(".swiper3", {
        // autoplay: true,
        loop: true,
        effect: "fade",
    });
    const swiper4 = new Swiper(".swiper4", {
        // autoplay: true,
        loop: true,
        effect: "fade",
    });
    const swiper5 = new Swiper(".swiper5", {
        // autoplay: true,
        loop: true,
        effect: "fade",
    });

    function fixedVideoClose() {
        let swiper_close = document.querySelector('.swiper-close');
        var close_tl = gsap.timeline();

        swiper_close.addEventListener('click', () => {
            close_tl.to('.fixed-video-box',
                {
                    opacity: 0,
                    duration: 1,
                    ease: "power1.inOut"
                })
                .to('.video-banner',
                    {
                        opacity: 0,
                        duration: 0.5,
                    }, '<').to('.fixed-video-box',
                        {
                            display: 'none',
                            duration: 1,
                            // height: '0vh',
                            ease: "power1.inOut"
                        }
                        , '<')

            topBannerAni();

        });
    }
    fixedVideoClose();

    function topBannerAni() {
        let tl = gsap.timeline({});
        if (window_width <= 1024) {
            tl
                // .to('.gallery-top', { duration: 1, opacity: 1, ease: "power1.inOut", }, '<')
                // .to('.swiper-thumbs', { duration: 1, opacity: 1, ease: "power1.inOut", }, '<')
                .fromTo('.card1 .moblie-title .title-box div', {
                    opacity: 0,
                    y: 40
                }, {
                    opacity: 1,
                    ease: "power1.inOut",
                    y: 0,
                    stagger: 0.2,
                    duration: 1,
                })
                .fromTo('.gallery-top,.swiper-thumbs', {
                    opacity: 0,
                    y: 50
                }, {
                    opacity: 1,
                    ease: "power1.inOut",
                    y: 0,
                    stagger: 0.15,
                    duration: 1,
                }, "<0.3")
                .fromTo('.card1 .moblie-case-content', {
                    opacity: 0,
                    y: 50
                }, {
                    opacity: 1,
                    ease: "power1.inOut",
                    y: 0,
                    duration: 1,
                }, '<0.2')
                .fromTo('.card1 .moblie-case-content-box .line-box', {
                    opacity: 0,
                    y: 50
                }, {
                    opacity: 1,
                    ease: "power1.inOut",
                    y: 0,
                    stagger: 0.15,
                    duration: 1,
                }, "<0.3")
                .fromTo('.card1 .moblie-case-content-box .bottom-box .text-box', {
                    opacity: 0,
                    y: 50
                }, {
                    opacity: 1,
                    ease: "power1.inOut",
                    y: 0,
                    stagger: 0.2,
                    duration: 1,
                }, '<0.3')
        }
        else {
            tl.fromTo('.gallery-top,.swiper-thumbs', {
                opacity: 0,
                y: 50
            }, {
                opacity: 1,
                ease: "power1.inOut",
                y: 0,
                stagger: 0.15,
                duration: 1,
            }).to('.case-name-box', { duration: 1, opacity: 1, ease: "power1.inOut", }, '<')
                .fromTo('.card1 .top-box .title-box div', {
                    opacity: 0,
                    y: 40
                }, {
                    opacity: 1,
                    ease: "power1.inOut",
                    y: 0,
                    stagger: 0.2,
                    duration: 1,
                }, '<')
                .fromTo('.card1 .top-box .line-box', {
                    opacity: 0,
                    y: 40
                }, {
                    opacity: 1,
                    ease: "power1.inOut",
                    y: 0,
                    duration: 1,
                }, '<0.3')
                .fromTo('.card1 .top-box .case-content', {
                    opacity: 0,
                    y: 40
                }, {
                    opacity: 1,
                    ease: "power1.inOut",
                    y: 0,
                    duration: 1,
                }, '<0.2')
                .fromTo('.card1 .case-name-box .bottom-box .text-box', {
                    opacity: 0,
                    y: 50,

                }, {
                    opacity: 1,
                    ease: "power1.inOut",
                    y: 0,
                    stagger: 0.15,
                    duration: 1,
                }, '<0.3')

        }

    }
    // topBannerAni();

    function bannerAni() {

        const boxes = gsap.utils.toArray('.banner-box');

        boxes.forEach(box => {
            const img = box.querySelectorAll('.swiper .swiper-slide img')

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: box,
                    start: "top 90%",
                },
            });
            tl.fromTo(img, { scale: 1.2 }, { duration: 1, scale: 1, ease: "power1.inOut" })

        });


        boxes.forEach(box => {
            const boxes_title = box.querySelectorAll('.banner-content .title')
            const boxes_content = box.querySelectorAll('.banner-content .content')
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: box,
                    start: "top 75%",
                },
            });
            if (window_width <= 1024) {
                tl.fromTo(boxes_title, { y: 50, opacity: 0 }, { duration: 1, y: 0, opacity: 1, ease: "power1.inOut" },)
                    .fromTo(boxes_content, { y: 50, opacity: 0 }, { duration: 1, y: 0, opacity: 1, ease: "power1.inOut" }, '<0.3')
            } else {
                tl.fromTo(boxes_title, { y: 70, opacity: 0 }, { duration: 1, y: 0, opacity: 1, ease: "power1.inOut" },)
                    .fromTo(boxes_content, { y: 70, opacity: 0 }, { duration: 1, y: 0, opacity: 1, ease: "power1.inOut" }, '<0.2')
            }


        });

    }
    bannerAni();


    function formAni() {

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.reserve-box',
                start: "top 80%",
            },
        });
        if (window_width <= 1024) {
            tl.fromTo('.reserve-box iframe', { y: 100, opacity: 0 }, { duration: 1, y: 0, opacity: 1, ease: "power1.inOut" },)
                .fromTo('.reserve-box .form-content', { y: 100, opacity: 0 }, { duration: 1, y: 0, opacity: 1, ease: "power1.inOut" }, '<0.3')
        } else {
            tl.fromTo('.reserve-box iframe', { y: 100, opacity: 0 }, { duration: 1, y: 0, opacity: 1, ease: "power1.inOut" },)
                .fromTo('.reserve-box .form-content', { y: 100, opacity: 0 }, { duration: 1, y: 0, opacity: 1, ease: "power1.inOut" }, '<')
        }

    }
    formAni();
}