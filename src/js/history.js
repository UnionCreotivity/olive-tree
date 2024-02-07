window.onload = function () {
    var window_width = window.screen.width;
    var window_height = window.innerHeight;
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    gsap.registerPlugin(ScrollTrigger);

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
            $('body').css('overflow', 'unset');
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

    function hoverCard() {
        const history_cards = document.querySelectorAll('.history-card');

        if (window_width > 1024) {
            history_cards.forEach((history_card) => {

                const history_card_font = history_card.querySelector('.history-card-font');
                const history_card_back = history_card.querySelector('.history-card-back');

                let tl = gsap.timeline({});
                history_card.addEventListener('mouseenter', () => {
                    enterHistoryCardAni(tl, history_card_font, history_card_back);
                });

                history_card.addEventListener('mouseleave', () => {
                    leaveHistoryCardAni(tl, history_card_font, history_card_back);
                });
            })
        }
    }
    hoverCard();

    function enterHistoryCardAni(tl, history_card_font, history_card_back) {

        if (tl.reversed()) {
            tl.play();
        }
        tl.to(history_card_back, { duration: 0.5, rotationY: '0', ease: "power1.inOut", }, "<")
            .to(history_card_font, { duration: 0.5, rotationY: '-180', ease: "power1.inOut", }, "<")

    }

    function leaveHistoryCardAni(tl, history_card_font, history_card_back) {
        tl.reverse();
    }
    if (window_width <= 500) {
        const swiper = new Swiper('.swiper', {
            speed: 800, loop: true,
            slidesPerView: 2,
            autoplay: {
                delay: 3000
            },
            centeredSlides: true,
            spaceBetween: 80,
            navigation: {
                prevEl: ".prev",
                nextEl: ".next"
            },
        })
    } else if (window_width <= 1024) {
        const swiper = new Swiper('.swiper', {
            speed: 800,
            loop: true,
            autoplay: {
                delay: 3000
            },
            slidesPerView: 2,
            centeredSlides: true,
            navigation: {
                prevEl: ".prev",
                nextEl: ".next"
            },
        })
    } else if (window_width <= 1920) {
        const swiper = new Swiper('.swiper', {
            slidesPerView: 4,
            spaceBetween: 0,
            speed: 800,
            spaceBetween: 0,
            autoplay: {
                delay: 3000
            },
            effect: "creative",
            creativeEffect: {

                prev: {
                    translate: ["-109.97%", "10%", 0],
                },
                next: {
                    translate: ["109.97%", "-10%", 0],
                },
                limitProgress: 4,
            },
            navigation: {
                prevEl: ".prev",
                nextEl: ".next"
            },
        })
    } else {
        const swiper = new Swiper('.swiper', {
            slidesPerView: 4,
            speed: 1000,
            spaceBetween: 0,
            autoplay: {
                delay: 3000
            },
            effect: "creative",
            creativeEffect: {

                prev: {
                    translate: ["-112.69%", "10%", 0],
                },
                next: {
                    translate: ["112.69%", "-10%", 0],
                },
                limitProgress: 4,
            },
            navigation: {
                prevEl: ".prev",
                nextEl: ".next"
            },
        })
    };


    function cardAni() {

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.main-container',
                start: "top 70%",
            },
        });

        tl.from('.card-box .swiper-wrapper', { duration: 1, y: 150, ease: "power1.inOut", })
    }
    cardAni();

    function historyTitleAni() {
        let text = document.querySelectorAll('.history-title-svg');
        let zhTitle = gsap.utils.toArray(".page-title");
        let splitZhTitle = zhTitle.map(heading => new SplitText(heading, {
            type: "chars,words,lines", linesClass: "clip-text"
        }));
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: text,
                start: "top 80%",
            }
        });

        tl.from(text, {
            x: gsap.utils.wrap([-100, 100]),
            filter: 'blur(5px)',
            opacity: 0,
            duration: 1,
            stagger: { each: 0.05, from: "start", }
        })
            .from(splitZhTitle[0].chars,
                {
                    y: -100,
                    stagger: { each: 0.05, from: 'start', },
                    opacity: 0,
                    duration: 1,

                }, '<0.3')



    }
    historyTitleAni();
}