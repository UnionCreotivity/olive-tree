
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

    const swiper = new Swiper(".swiper", {
        slidesPerView: 2.5,
        // spaceBetween: 50,
        centeredSlides: true,
        loop: true,
        effect: "creative",
        navigation: {
            prevEl: ".prev",
            nextEl: ".next"
        },
        creativeEffect: {

            prev: {
                translate: ["-92.45%", "50%", 0],
                opacity: "0",
                scale: 0.65,
            },
            next: {
                translate: ["92.45%", "-50%", 0],
                opacity: "0",
                scale: 0.65,
            },
            limitProgress: 1,
        },
        on: {

            slideChange: function () {
                const index_currentSlide = this.realIndex;
                const banner_text = document.querySelectorAll('.swiper .case-title-box');
                const banner_year = document.querySelectorAll('.swiper .case-sign-box .case-sign');
                banner_text.forEach((text, index) => {

                    let tl = gsap.timeline({});
                    tl.to(text, { duration: 0.8, opacity: index === index_currentSlide ? 1 : 0, ease: "power1.inOut" });

                });

                banner_year.forEach((year, index) => {

                    let tl = gsap.timeline({});
                    tl.to(year, { duration: 0.8, opacity: index === index_currentSlide ? 1 : 0, ease: "power1.inOut" });

                });

            },

        },

    });

    /* menu */
    function menuInsert() {
        var menu_div =
            '<div class="menu-box">' +
            '<div class="menu-tree-shadow">' +
            '<img src="../assets/images/tree_shadow.webp" alt="tree_shadow" srcset="">' +
            '</div>' +
            '<div class="close">' +
            '<img src="../assets/images/menu/close.svg" alt="close" srcset="">' +
            '</div>' +
            '<div class="menu">' +
            '<div class="item-box">' +
            '<div class="item btn-about">' +
            '<div class="about">' +
            '<img src="../assets/images/menu/about.png" alt="about" srcset="">' +
            '</div>' +
            '<div class="text">關於橄欖樹</div>' +
            '</div>' +
            '<div class="item btn-hot">' +
            '<div class="hot">' +
            '<img src="../assets/images/menu/hot.png" alt="hot" srcset="">' +
            '</div>' +
            '<div class="text">熱銷建案</div>' + '</div>' +
            '<div class="item btn-history">' +
            '<div class="history">' +
            '<img src="../assets/images/menu/history.png" alt="history" srcset="">' +
            '</div>' +
            '<div class="text">歷屆業績</div>' +
            '</div>' +
            '<div class="item btn-news">' +
            '<div class="news">' +
            '<img src="../assets/images/menu/news.png" alt="news" srcset="">' +
            '</div>' +
            '<div class="text">最新消息</div>' +
            '</div>' +
            '<div class="item btn-contact">' +
            '<div class="contact">' +
            '<img src="../assets/images/menu/email.png" alt="email" srcset="">' +
            '</div>' +
            '<div class="text">聯絡我們</div>' +
            '</div>' +
            '<div class="item btn-line">' +
            '<div class="menu-line">' +
            '<img src="../assets/images/menu/line.png" alt="line" srcset="">' +
            '</div>' +
            '<div class="text">LINE</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            ' </div>';
        $('body').append(menu_div);
    }
    menuInsert();

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
                    height: 'calc(var(--vh, 2.8vh) * 100)',
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
        });

        menu_close.addEventListener('click', () => {
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

    function caseNameAni() {
        if (window_width <= 1024) {

            const boxes = gsap.utils.toArray('.case-box');

            boxes.forEach(box => {
                const img = box.querySelectorAll('.case-img')
                // const text = box.querySelectorAll('.case-title-box div')
                const name = box.querySelectorAll('.case-title-box .case-name')
                const title = box.querySelectorAll('.case-title-box .case-title')
                const more = box.querySelectorAll('.case-title-box .more-box')
                const sign = box.querySelectorAll('.case-sign-box')
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: box,
                        start: "top 90%",
                    },
                });
                tl.fromTo(img, { y: 50, opacity: 0 }, { duration: 1, y: 0, ease: "power1.inOut", opacity: 1 })
                    // .fromTo(text, { y: 50, opacity: 0 }, { duration: 1, y: 0, ease: "power1.inOut", stagger: 0.2, opacity: 1 }, '<0.3')
                    .fromTo(name, { y: 50, opacity: 0 }, { duration: 1, y: 0, ease: "power1.inOut", opacity: 1 }, '<0.3')
                    .fromTo(title, { y: 50, opacity: 0 }, { duration: 1, y: 0, ease: "power1.inOut", opacity: 1 }, '<0.3')
                    .fromTo(more, { y: 50, opacity: 0 }, { duration: 1, y: 0, ease: "power1.inOut", opacity: 1 }, '<0.3')
                    .fromTo(sign, { y: 50, opacity: 0 }, { duration: 1, y: 0, ease: "power1.inOut", stagger: 0.2, opacity: 1 }, '<')

            });



        }
    }
    caseNameAni();
}