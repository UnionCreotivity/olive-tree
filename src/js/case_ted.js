window.onload = function () {
    var window_width = window.screen.width;
    var window_height = window.innerHeight;
    let vh = window.innerHeight * 0.01;

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
    function footerInsert() {
        var footer_div =
            '<div class="page-footer-info-moblie">' +
            '<div class="copy-right">Copyright © 2023橄欖樹廣告行銷有限公司 版權所有</div>' +
            '<div class="address">地址 ｜ 244新北市林口區忠孝路7號</div>' +
            '<div class="phone">TEL | (02) 2606 8068</div>' +
            '</div>'

        $('body').append(footer_div);
    }
    footerInsert();

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
        });
    }
    fixedVideoClose();

    function topBannerAni() {
        let tl = gsap.timeline({});
        tl
            .to('.gallery-top', { duration: 0.7, opacity: 1, ease: "power1.inOut", }, '<')
            .to('.swiper-thumbs', { duration: 0.7, opacity: 1, ease: "power1.inOut", }, '<')
            .to('.case-ted-contanier .card1 .right-box', { duration: 0.7, opacity: 1, ease: "power1.inOut", }, '<')
    }
    topBannerAni();

}