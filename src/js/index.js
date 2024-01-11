import {
    Renderer,
    Program,
    Mesh,
    Triangle,
    Vec2,
    Texture
} from "https://cdn.jsdelivr.net/npm/ogl@1.0.3/src/index.min.js";

function canvas() {
    const imageSrc =
        '../assets/images/1x_olive.png';

    const vertex = `
        attribute vec2 uv;
        attribute vec2 position;
        uniform vec2 uResolution;
        uniform vec2 uTextureResolution;
        varying vec2 vUv;

        vec2 resizeUvCover() {
            vec2 ratio = vec2(
                min((uResolution.x / uResolution.y) / (uTextureResolution.x / uTextureResolution.y), 1.0),
                min((uResolution.y / uResolution.x) / (uTextureResolution.y / uTextureResolution.x), 1.0)
            );

            return vec2(
                uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                uv.y * ratio.y + (1.0 - ratio.y) * 0.5
            );
        }

        void main() {
            
          vUv = resizeUvCover();
          gl_Position = vec4(position, 0, 1);
        }
`;

    const fragment = `
            precision highp float;
            uniform float uTime;
            uniform sampler2D uTexture;
            uniform vec2 uMouse;
            uniform vec2 uMouseIntro;
            uniform float uIntro;
            uniform float uRadius;
            uniform float uStrength;
            uniform float uBulge;
            varying vec2 vUv;
  
            vec2 bulge(vec2 uv, vec2 center) {
  
              uv -= center; //將紋理坐標（uv）減去鼠標的位置，使鼠標位置成為中心。
  
              float dist = length(uv) / uRadius; // 計算每個點到鼠標的距離，然後除以 uRadius 以獲得在 [0, 1] 范圍內的歸一化距離。
              float distPow = pow(dist, 4.); // 對距離進行指數運算，增加距離的影響，這是為了使遠離鼠標的區域更受影響。
              float strengthAmount = uStrength / (1.0 + distPow); // 計算變形的強度，通過 uStrength 控制。
  
              uv *= (1. - uBulge) + uBulge * strengthAmount; // 根據強度應用變形，uBulge 控制變形的平滑度。
  
              uv += center; //將坐標還原為原始位置。
  
              return uv;
            }
  
            void main() {
                // Add bulge effect based on mouse
                vec2 mixMouse = mix(uMouseIntro, uMouse, uIntro);
                vec2 bulgeUV = bulge(vUv, mixMouse);
            
                vec4 tex = texture2D(uTexture, bulgeUV);
            
                gl_FragColor.rgb = tex.rgb;
                gl_FragColor.a = tex.a;  // Ensure alpha channel is correctly set
            }
  `;


    {
        class IntersectObserver {
            entries = {};
            observer;

            constructor() {
                this.observer = new IntersectionObserver(this.onElementObserved, {
                    threshold: 0.0
                });
            }

            observe(id, el, methodIn, methodOut) {
                this.entries[id] = { el, methodIn, methodOut };

                this.observer.observe(el);
            }

            onElementObserved = (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.dataset.intersectId;

                    if (id && this.entries[id]) {
                        if (entry.isIntersecting) {
                            this.entries[id].methodIn(entry);
                        } else {
                            this.entries[id].methodOut(entry);
                        }
                    }
                });
            };
        }

        class BulgeImage {
            #el;
            #renderer;
            #mesh;
            #program;
            #mouse = new Vec2(0, 0);
            #mouseTarget = new Vec2(0, 0);
            #elRect;
            #canMove = true;
            #index;
            #isTouch;
            #visible;
            constructor() {
                const bulgeImage = document.querySelector(".bulge");
                this.#el = bulgeImage.querySelector("canvas");
                this.#index = 0;
                this.setScene();
                this.#el.dataset.intersectId = this.#index;

                this.#isTouch = this.isTouch();

            }

            async setScene() {
                this.#renderer = new Renderer({
                    dpr: Math.min(window.devicePixelRatio, 2),
                    canvas: this.#el,
                    width: this.#el.offsetWidth / 2,
                    height: this.#el.offsetHeight / 2,
                    alpha: true,  // 確保 Canvas 支持透明度
                });
                const { gl } = this.#renderer;

                // Preloading
                let texture;
                await new Promise((resolve) => {
                    const image = new Image();
                    const textureGl = new Texture(gl);

                    image.onload = () => {
                        textureGl.image = image;
                        texture = textureGl;
                        resolve(image);
                    };
                    image.src = imageSrc;
                    image.crossOrigin = "Anonymous";
                });

                gl.clearColor(1, 1, 1, 1);

                this.resize();

                const geometry = new Triangle(gl);

                this.#program = new Program(gl, {
                    vertex,
                    fragment,
                    uniforms: {
                        uTime: { value: 0 },
                        uTexture: { value: texture },
                        uTextureResolution: {
                            value: new Vec2(texture.image.width, texture.image.height)
                        },
                        uResolution: {
                            value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight)
                        },
                        uMouse: { value: this.#mouse },
                        uMouseIntro: { value: new Vec2(15, 5) },
                        uIntro: { value: 0 },
                        uBulge: { value: 0 },
                        uRadius: { value: 0.6 },
                        uStrength: { value: 1 }
                    }
                });

                this.#mesh = new Mesh(gl, { geometry, program: this.#program });

                this.events();
                new IntersectObserver().observe(
                    this.#index,
                    this.#el,
                    this.show,
                    this.hide
                );


            }

            show = () => {
                let delay = 0;

                this.tlHide?.kill();
                this.tlShow = gsap.timeline();

                gsap.delayedCall(delay, () => {
                    this.#el.parentNode.classList.add("is-visible");
                });

                this.tlShow.fromTo(
                    this.#program.uniforms.uBulge,
                    { value: 1 },
                    {
                        value: 0,

                        duration: 8.5,
                        // ease: "power3.out",
                        delay
                    }
                );

                this.tlShow.to(
                    this.#program.uniforms.uIntro,
                    { value: 1, duration: 1, delay },
                    0
                );
                this.#elRect = this.#el.getBoundingClientRect();

                let eventX = this.#isTouch ? e.touches[0].pageX : this.#elRect.clientX;
                let eventY = this.#isTouch ? e.touches[0].pageY : this.#elRect.clientY;
                const x = (eventX - this.#elRect.left) / this.#el.offsetWidth;
                const y = 1 - (eventY - this.#elRect.top) / this.#el.offsetHeight;

                this.#mouse.x = gsap.utils.clamp(0, 1, x);
                this.#mouse.y = gsap.utils.clamp(0, 1, y);



                this.#visible = true;
            };

            hide = () => {
                let delay = 0;

                this.tlShow?.kill();
                this.tlHide = gsap.timeline();

                gsap.delayedCall(delay, () => {
                    this.#el.parentNode.classList.remove("is-visible");
                });

                this.tlHide.to(this.#program.uniforms.uBulge, {
                    value: 1,
                    duration: 1.8,
                    ease: "power3.out",
                    delay
                });

                this.tlHide.to(
                    this.#program.uniforms.uIntro,
                    { value: 1, duration: 1, delay },
                    0
                );

                this.#visible = false;
            };


            f_move = () => {
                this.tlShow = gsap.timeline();
                this.tlShow.to(this.#program.uniforms.uIntro, { value: 1, duration: 5, delay });
            }

            events() {
                this.#el.addEventListener("mouseenter", this.handleMouseEnter, false);
                this.#el.addEventListener("mouseleave", this.handleMouseLeave, false);
            }

            render = () => {
                if (!this.#program) return;



                this.#mouseTarget.x = gsap.utils.interpolate(
                    this.#mouseTarget.x,
                    this.#mouse.x,
                    0.1
                );
                this.#mouseTarget.y = gsap.utils.interpolate(
                    this.#mouseTarget.y,
                    this.#mouse.y,
                    0.1
                );

                this.#program.uniforms.uMouse.value = this.#mouseTarget;

                // Don't need a camera if camera uniforms aren't required
                this.#renderer.render({ scene: this.#mesh });


            };

            mouseMove = (e) => {
                if (!this.#canMove || !this.#program || !this.#visible) return;

                this.#elRect = this.#el.getBoundingClientRect();

                let eventX = this.#isTouch ? e.touches[0].pageX : e.clientX;
                let eventY = this.#isTouch ? e.touches[0].pageY : e.clientY;
                const x = (eventX - this.#elRect.left) / this.#el.offsetWidth;
                const y = 1 - (eventY - this.#elRect.top) / this.#el.offsetHeight;

                this.#mouse.x = gsap.utils.clamp(0, 1, x);
                this.#mouse.y = gsap.utils.clamp(0, 1, y);


            };

            handleMouseEnter = () => {
                if (!this.#canMove) return;
                this.tlHide?.kill();
                this.tlShow?.kill();
                this.tlForceIntro = new gsap.timeline();
                this.tlForceIntro.to(this.#program.uniforms.uIntro, {
                    value: 1,
                    duration: 5,
                    ease: "expo.out"
                });
                gsap.to(this.#program.uniforms.uBulge, {
                    value: 1,
                    duration: 1,
                    ease: "expo.out"
                });
            };

            handleMouseLeave = () => {
                if (!this.#canMove) return;
                this.tlForceIntro?.kill();
                this.tlLeave = new gsap.timeline();
                this.tlLeave.to(this.#program.uniforms.uBulge, {
                    value: 0,
                    duration: 1,
                    ease: "expo.out"
                });
            };

            resize = () => {
                const w = this.#el.parentNode.offsetWidth;
                const h = this.#el.parentNode.offsetHeight;
                this.#renderer.setSize(w, h);

                this.#elRect = this.#el.getBoundingClientRect();

                if (this.#program) {
                    this.#program.uniforms.uResolution.value = new Vec2(w, h);
                }

                this.#isTouch = this.isTouch();
            };

            isTouch() {
                // if ("standalone" in navigator) {
                //     return true; // iOS devices
                // }
                // const hasCoarse = window.matchMedia("(pointer: coarse)").matches;
                // if (hasCoarse) {
                //     return true;
                // }
                // const hasPointer = window.matchMedia("(pointer: fine)").matches;
                // if (hasPointer) {
                //     return false;
                // }


                // return "ontouchstart" in window || navigator.maxTouchPoints > 0;
            }
        }

        const bulgeImage = new BulgeImage();
        events();

        function events() {
            gsap.ticker.add((time) => {
                bulgeImage.render(time);
            });

            window.addEventListener(
                "resize",
                () => {
                    bulgeImage.resize();
                },
                false
            );

            if (bulgeImage.isTouch()) {
                window.addEventListener("touchmove", handleMouseMove, false);
            } else {
                window.addEventListener("mousemove", handleMouseMove, false);
            }
        }

        function handleMouseMove(e) {
            bulgeImage.mouseMove(e);
        }
    }
}

window.onload = function () {

    // canvSas();

    // fetch('footer.html')
    //     .then(response => response.text())
    //     .then(data => {
    //         document.body.insertAdjacentHTML('afterbegin', data);
    //     });

    var window_width = window.screen.width;
    var window_height = window.innerHeight;
    let vh = window.innerHeight * 0.01;

    document.documentElement.style.setProperty("--vh", `${vh}px`);

    /* parallax */


    // $(".tree_shadow").attr("data-depth", "0.14");
    // let tree_Shadow = document.querySelector("#scene-tree-shadow");
    // let parallaxTree = new Parallax(tree_Shadow, {
    //     relativeInput: true,
    // });
    // parallaxTree.friction(0.03, 0.03);

    /* header */
    function headerInsert() {
        var header_div =
            '<header class="header main-navigation">' +
            '<div class="logo-box">' +
            '<a href="../pages/index.html" target="_self">' +
            '<img src="../assets/images/header/logo.png" alt="logo" srcset="">' +
            '</a>' +
            '</div>' +
            '<div class="menu-btn">' +
            '<img src="../assets/images/header/menu_icon.svg" alt="menu_icon" srcset="">' +
            '</div>' +
            '</header>';

        $('body').append(header_div);
    }
    headerInsert();

    /* footer */
    function footerInsert() {
        var footer_div =
            '<div class="footer-info">' +
            '<div class="copy-right">Copyright © 2023橄欖樹廣告行銷有限公司 版權所有</div>' +
            '<div class="address">地址 ｜ 244新北市林口區忠孝路7號</div>' +
            '<div class="phone">TEL | (02) 2606 8068</div>' +
            '<div class="email-box">' +
            '<img src="../assets/images/header/mail.png" alt="mail" srcset="">' +
            '</div>' +
            '</div>' +
            '<div class="line">' +
            '<img src="../assets/images/header/line.png" alt="line" srcset="">' +
            '</div>'

        $('body').append(footer_div);
    }
    footerInsert();

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

    const card_boxes = gsap.utils.toArray(document.querySelectorAll(".card-box"));
    var isClicking = false;
    var isClickTimes = false;
    var clickedCardBoxes = [];
    var notClickedCardBoxes = [];
    card_boxes.forEach((card_box) => {
        let tl = gsap.timeline({});
        const card = card_box.querySelector('.card');
        const envelope = card_box.querySelector('.envelope');
        const font = card_box.querySelector('.font');
        const back = card_box.querySelector('.back');
        const text_content = card_box.querySelector('.text-content');
        const back_item_img_box = card_box.querySelector('.back-item-img');
        const back_item_img = card_box.querySelector('.back-item-img img');
        const back_item_title = card_box.querySelector('.title');
        const back_item_content = card_box.querySelector('.content');
        const scroll_card_box = document.querySelector('.scroll-card-box');
        const shadow = card_box.querySelector('.card-shadow');

        let isClicking = false;

        card_box.addEventListener('mouseenter', () => {
            if (isClicking !== true) {
                mouseenterCardAni(tl, card_box, card, envelope, back, font, back_item_img, text_content, back_item_title, back_item_content, shadow);
            }

        });

        card_box.addEventListener('mouseleave', () => {

            if (isClicking !== true) {
                mouseleaveCardAni(tl);
            }

        });

        card_box.addEventListener('click', (e) => {
            // if (isClickTimes !== true) {
            //     e.stopPropagation();
            //     isClicking = true;
            //     clickedCardBoxes.push(card_box);

            //     // 取得沒有被點擊過的 card_box
            //     notClickedCardBoxes = card_boxes.filter(box => !clickedCardBoxes.includes(box));
            //     clickCardAni(tl, card_box, scroll_card_box, card);
            // }

            mouseenterCardAni(tl, card_box, card, envelope, back, font, back_item_img, text_content, back_item_title, back_item_content, shadow);

        });
    });


    function mouseenterCardAni(tl, card_box, card, envelope, back, font, back_item_img, text_content, back_item_title, back_item_content, shadow) {
        if (window_width <= 500) {
            if (tl.reversed()) {
                tl.play();
            } else {
                switch (card_box.id) {
                    case 'olive-tree':
                        applyAnimation('160vw', '-59vw', '-15vw');
                        break;
                    case 'lily':
                        applyAnimation('135vw', '-55vw', '2vw');
                        break;
                    case 'cotton':
                        applyAnimation('120vw', '-37vw', '15vw');
                        break;
                    case 'campanula':
                        applyAnimation('200vw', '-51vw', '-90vw');
                        break;
                }
            }
        }

        else if (window_width <= 1024) {
            if (tl.reversed()) {
                tl.play();
            } else {
                switch (card_box.id) {
                    case 'olive-tree':
                        applyAnimation('125vw', '-42vw', '-25vw');
                        break;
                    case 'lily':
                        applyAnimation('97vw', '-52vw', '0vw');
                        break;
                    case 'cotton':
                        applyAnimation('85vw', '-33vw', '0vw');
                        break;
                    case 'campanula':
                        applyAnimation('150vw', '-43vw', '-74vw');
                        break;
                }
            }
        }

        else {
            if (tl.reversed()) {
                tl.play();
            } else {
                switch (card_box.id) {
                    case 'olive-tree':
                        applyAnimation('35vw', '-12vw', '-8vw');
                        break;
                    case 'lily':
                        applyAnimation('25vw', '-9vw', '-1vw');
                        break;
                    case 'cotton':
                        applyAnimation('20vw', '-7vw', '2vw');
                        break;
                    case 'campanula':
                        applyAnimation('45vw', '-12vw', '-19vw');
                        break;
                }
            }
        }

        function applyAnimation(width, translateX, translateY) {
            tl.to(card, { y: -40, duration: 0.5, ease: "back.out(1.7)" })
                .to(shadow, { y: -40, duration: 0.5, ease: "back.out(1.7)" }, '<')
                .to(shadow, { duration: 1.2, ease: "power1.out", opacity: 0 }, '<')
                .to(envelope, { opacity: 0, y: 80, ease: "power1.out", duration: 0.5 }, "<0.2")
                .to(back, { duration: 0.8, rotationY: '0', ease: "power1.out" }, "<")
                .to(font, { duration: 0.8, rotationY: '-180', ease: "power1.out" }, "<")
                .to(back_item_img, { width: width, translateX: translateX, translateY: translateY, ease: "power1.out", duration: 1 }, "<0.1")
                .to(text_content, { opacity: 1, ease: "power1.out", duration: 1 }, "<0.3")
                .to(back_item_title, { opacity: 1, ease: "power1.out", duration: 1 }, "<0.3")
                .to(back_item_content, { opacity: 1, ease: "power1.out", duration: 1 }, "<");
        }
    }

    function mouseleaveCardAni(tl) {
        tl.reverse();
        // tl.clear();
    }

    gsap.registerPlugin(CSSPlugin);

    function clickCardAni(tl, card_box, scroll_card_box, card) {
        // isClickTimes = true;
        tl.then(() => {

            const scrollCardBoxRect = scroll_card_box.getBoundingClientRect();
            const cardBoxRect = card_box.getBoundingClientRect();
            const deltaX = (scrollCardBoxRect.width - cardBoxRect.width) / 2 - (cardBoxRect.left - scrollCardBoxRect.left);

            //-- 更換卡片內容 --

            let cardObj = {
                backImg: {
                    src: '',
                    width: '',
                    top: '',
                    left: ''
                },
                marqueeImg: '',
                backBg: '',
            }

            let cardMv = {
                backImg: {
                    big: {
                        width: '',
                        top: '',
                        left: '',
                    }
                }
            }


            switch (card_box.id) {
                case 'olive-tree':
                    cardObj = {
                        backImg: {
                            src: '../assets/images/tree.svg',
                            width: '250%',
                            top: '50%',
                            left: '-76%',
                        },
                        marqueeImg: '../assets/images/case.png',
                        blurImg1: '../assets/images/tree_blur_1.png',
                        blurImg2: '../assets/images/tree_blur_2.png',
                        blurImg3: '../assets/images/tree_blur_3_2.png',
                        backChangeColor: 'linear-gradient(to bottom,  rgba(216,227,186,1) 35%,rgba(255,255,255,1) 100%)',
                    }
                    cardMv = {
                        backImg: {
                            big: {
                                width: '107%',
                                top: '28%',
                                left: '-5%',
                            },
                            small: {
                                // width: '56%',
                                // top: '37.5%',
                                // left: '20%',
                                bottom: '0',
                                top: 'inherit',
                                width: '55%',
                                left: '23%',
                            }
                        }
                    }
                    break;
                case 'lily':
                    cardObj = {
                        backImg: {
                            src: '../assets/images/SVG/lily_svg.svg',
                            width: '156%',
                            top: '11%',
                            left: '-53%'
                        },
                        marqueeImg: '../assets/images/case.png',
                        blurImg1: '../assets/images/blue_blur_1.png',
                        blurImg2: '../assets/images/blue_blur_2.png',
                        blurImg3: '../assets/images/blue_blur_3.png',
                        backChangeColor: 'linear-gradient(to bottom,  rgba(205,218,206,1) 25%,rgba(255,255,255,1) 100%)'
                    }
                    cardMv = {
                        backImg: {
                            big: {
                                width: '84%',
                                top: '28%',
                                left: '2%',
                            },
                            small: {
                                // width: '33%',
                                // top: '35%',
                                // left: '34%',
                                bottom: '0',
                                top: 'inherit',
                                width: '37%',
                                left: '33%',
                            }
                        }
                    }
                    break;
                case 'cotton':
                    cardObj = {
                        backImg: {
                            src: '../assets/images/SVG/cotton_svg.svg',
                            width: '176%',
                            top: '2%',
                            left: '-57%',
                        },
                        marqueeImg: '../assets/images/case.png',
                        blurImg1: '../assets/images/tree_blur_1.png',
                        blurImg2: '../assets/images/tree_blur_2.png',
                        blurImg3: '../assets/images/tree_blur_3_2.png',
                        backChangeColor: 'linear-gradient(to bottom,  rgba(216,227,186,1) 35%,rgba(255,255,255,1) 100%)',
                    }
                    cardMv = {
                        backImg: {
                            big: {
                                width: '80%',
                                top: '14%',
                                left: '4%',
                            },
                            small: {
                                // width: '30%',
                                // top: '34%',
                                // left: '35%',

                                bottom: '0',
                                top: 'inherit',
                                width: '32%',
                                left: '33%',
                            }
                        }
                    }
                    break;
                case 'campanula':
                    cardObj = {
                        backImg: {
                            src: '../assets/images/SVG/campanula_svg.svg',
                            width: '295%',
                            top: '-23%',
                            left: '-4%',
                        },
                        marqueeImg: '../assets/images/case.png',
                        blurImg1: '../assets/images/blue_blur_1.png',
                        blurImg2: '../assets/images/blue_blur_2.png',
                        blurImg3: '../assets/images/blue_blur_3.png',
                        backChangeColor: 'linear-gradient(to bottom,  rgba(205,218,206,1) 25%,rgba(255,255,255,1) 100%)'
                    }
                    cardMv = {
                        backImg: {
                            big: {
                                width: '95%',
                                top: '26%',
                                left: '11%',
                            },
                            small: {
                                // width: '42%',
                                // top: '36%',
                                // left: '31%',

                                bottom: '-1.5vw',
                                top: 'inherit',
                                width: '48%',
                                left: '26%',
                            }
                        }
                    }

                    break;
            }

            const cardInner = document.querySelector('.cardInner');
            cardInner.querySelector('.back-item-img').src = cardObj.backImg.src;
            cardInner.querySelectorAll('.lily-case-bg img').src = cardObj.marqueeImg;
            // cardInner.querySelector('.back').style.backgroundImage = `url(${cardObj.backBg})`;
            cardInner.querySelector('.back').style.background = 'linear-gradient(to bottom, rgb(208, 211, 196) 2%, rgb(167, 173, 145) 27%, rgb(145, 152, 110) 60%, rgb(128, 141, 103) 81%, rgb(101, 122, 92) 100%)';
            // cardInner.querySelector('.back-color').style.background = cardObj.backChangeColor;
            cardInner.querySelector('.back-item-img').style.width = cardObj.backImg?.width;
            cardInner.querySelector('.back-item-img').style.top = cardObj.backImg?.top;
            cardInner.querySelector('.back-item-img').style.left = cardObj.backImg?.left;

            cardInner.querySelector('.blur-img1').src = cardObj.blurImg1;
            cardInner.querySelector('.blur-img2').src = cardObj.blurImg2;
            cardInner.querySelector('.blur-img3').src = cardObj.blurImg3;

            cardInner.querySelector('.back-item-img').classList.add(card_box.id);



            //-- 卡片位移到中間 --
            tl.to(scroll_card_box, {
                x: deltaX,
                ease: "power1.inOut",
                duration: 1,
                onComplete() {
                    //-- 卡片定位 --
                    const cardRect = card.getBoundingClientRect();
                    const cardInnerCard = document.querySelector('.cardInner .card');
                    cardInnerCard.style.top = `${cardRect.top}px`;
                    cardInnerCard.style.left = `${cardRect.left}px`;
                }
            })
                //-- 卡片展開至滿版 --
                .to('.cardInner', {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power1.out",
                    pointerEvents: 'initial'
                })

                .to('.cardInner .card .back .back-content .back-item-img', {
                    opacity: 0,
                    ease: "power1.inOut",
                    duration: 0.1,
                }, '<')

                .to('.olive-tree-box', {
                    opacity: 0
                }, '<')

                .to('.cardInner .card', {
                    width: '120%',
                    height: '230%',
                    top: '-70%',
                    left: '-8%',
                    ease: "power1.inOut",
                    duration: 0.8,
                }, '<')

                .to('.cardInner .card .back', {
                    border: '0px solid white',
                    borderRadius: '100%',
                    ease: "power1.out",
                    duration: 0.8,
                }, '<')

                .to('.cardInner .card .back .back-content .back-item-img', {
                    width: cardMv.backImg.small.width,
                    top: cardMv.backImg.small.top,
                    left: cardMv.backImg.small.left,
                    bottom: cardMv.backImg.small.bottom,
                    position: 'fixed',
                    // filter: 'blur(10px)',
                    ease: "power1.inOut",
                    // duration: 2,
                    duration: 1,
                }, '<')
                .to('.cardInner .card .back', {
                    background: '#fff',
                    ease: "power1.inOut",
                    duration: 0.5,
                }, '<')
                .to('.cardInner .blur-1', {
                    opacity: 1,
                    scale: '1',
                    ease: "power1.inOut",
                    duration: 0.8,
                }, "<0.3")
                .to('.cardInner .blur-3', {
                    opacity: 1,
                    ease: "power1.inOut",
                    duration: 0.8,
                }, '<0.3')
                .to('.cardInner  .blur-2', {
                    opacity: 1,
                    ease: "power1.inOut",
                    duration: 0.8,
                }, "<0.3")

                .to('.cardInner .card .back .back-content .back-item-img', {

                    opacity: 1,
                    ease: "power1.inOut",
                }, '<')


                .to('.cardInner .leaf1,.cardInner .leaf2,.cardInner .leaf3,.cardInner .leaf4,.cardInner .leaf5', {
                    display: 'flex',
                    ease: "power1.in",
                })
                .to('.cardInner .leaf1,.cardInner .leaf2,.cardInner .leaf3,.cardInner .leaf4,.cardInner .leaf5', {
                    duration: 65,
                    backgroundPosition: 'right 102em bottom 100em', repeat: -1
                }, '<')

                .to('.cardInner .card .back .back-content .lily-case-bg-box', {
                    opacity: 1,
                    ease: "power1.in",
                    duration: 1,
                    onComplete() {
                        const lilyBox = document.querySelector('.cardInner .card .back .back-content .lily-case-bg-box .lily-case-bg');
                        lilyBox.classList.add('marquee');
                    }
                }, "<")
        });
    };

    function treeShadow() {
        let tl_treeshadow = gsap.timeline({

        });
        tl_treeshadow.to(".tree-shadow", {
            y: -10,
            x: -5,
            rotate: '-8deg',
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut",
            duration: 2.3,

        })
    }


    function bgShadow(shadowX) {
        let tl_bgshadow = gsap.timeline({});

        if (window_width <= 1024) {

            tl_bgshadow.to(".bg-shadow", {
                x: `${parseInt(shadowX) - 10}vw`,
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 2.5,
            })
        } else {
            tl_bgshadow.fromTo(".bg-shadow", {
                x: `${shadowX}vw`,
            }, {
                x: `${parseInt(shadowX) - 3}vw`,
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 2,
            })
        }
    }
    // bgShadow();

    // card_component

    function tree_sway() {
        let tree = gsap.timeline({

        });

        tree.to(".tree-component1 img", {
            rotate: '25deg',
            yoyo: true,
            repeat: -1, translateX: '0.15vw',
            ease: "power1.inOut",
            duration: 2.5,
            delay: 0.5
        })
            .to(".tree-component2 img", {
                rotate: '25deg',
                yoyo: true,
                repeat: -1, translateX: '0.15vw',
                ease: "power1.inOut",
                duration: 2,

            }, '<')
            .to(".tree-component3 img", {
                rotate: '30deg',
                yoyo: true,
                repeat: -1, translateX: '0.15vw',
                ease: "power1.inOut",
                duration: 2,
            }, '<')
            .to(".tree-component4 img", {
                rotate: '30deg',
                yoyo: true,
                repeat: -1, translateX: '0.15vw',
                ease: "power1.inOut",
                duration: 2,
            }, '<')
            .to(".tree-component5 img", {
                rotate: '30deg',
                yoyo: true, translateX: '0.15vw',
                repeat: -1,
                ease: "power1.inOut",
                duration: 2.3,
            }, '<')
            .to(".tree-component6 img", {
                rotate: '30deg',
                yoyo: true, translateX: '0.15vw',
                repeat: -1,
                ease: "power1.inOut",
                duration: 2,
            }, '<')
            .to(".tree-component7 img", {
                rotate: '33deg', translateX: '0.15vw',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 2,
            }, '<')
            .to(".tree-component-light8", {
                opacity: '1',
                yoyo: true, y: -7,
                repeat: -1,

                ease: "power1.inOut",
                duration: 1.5,
            }, '<')
            .to(".tree-component-light9", {
                opacity: '1',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 1.8,
                delay: 0.5, y: -7,
            }, '<')
            .to(".tree-component-light10", {
                opacity: '1',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 1.8, y: -7,
                delay: 0
            }, '<')
            .to(".tree-component-light11", {
                opacity: '1',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 1.5,
                y: -7,
                delay: 0
            }, '<')
            .to(".tree-component-light12", {
                opacity: '1',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut", y: -7,
                duration: 1.8,
                delay: 0.5
            }, '<')

    }
    tree_sway();

    function lily_sway() {
        let lily = gsap.timeline({

        });

        lily.to(".lily-component1 img", {
            rotate: '15deg',
            yoyo: true,
            repeat: -1, translateX: '0.15vw',
            ease: "power1.inOut",
            duration: 2,
        }).to(".lily-component2 img", {
            rotate: '12deg',
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut", translateX: '0.15vw',
            duration: 1.3,
        }, '<')
            .to(".lily-component3 img", {
                rotate: '15deg',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 1.4, translateX: '0.15vw',
            }, '<')
            .to(".lily-component4 img", {
                rotate: '10deg',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 1.3, translateX: '0.15vw',
            }, '<')
            .to(".lily-component5 img", {
                rotate: '10deg',
                yoyo: true,
                repeat: -1, translateX: '0.15vw',
                ease: "power1.inOut",
                duration: 2,
            }, '<')
            .to(".lily-component6 img", {
                rotate: '15deg',
                yoyo: true, translateX: '0.15vw',
                repeat: -1,
                ease: "power1.inOut",
                duration: 1.3,
            }, '<')

            .to('#lily .card .font .item-img', {
                rotate: '4deg',
                yoyo: true,
                translateX: '0.4vw',
                repeat: -1,
                ease: "power1.inOut",
                duration: 2.5,
            }, '<')
    }
    lily_sway();

    function cotton_big() {
        let cotton = gsap.timeline({

        });

        cotton.to(".cotton-component3 img,.cotton-component4 img", {
            scale: 1.3,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut",
            duration: 2,
        })

            .to('#cotton .card .font .item-img', {
                rotate: '4deg',
                yoyo: true,
                translateX: '0.6vw',
                repeat: -1,
                ease: "power1.inOut",
                duration: 2.5,
            }, '<')


    }
    cotton_big();

    function campanula_big() {

        let campanula = gsap.timeline({});
        campanula
            .to(".campanula-component3 img", {
                rotate: '10deg',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 2, translateX: '0.3vw',
            })
            .to(".campanula-component2 img", {
                rotate: '5deg',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 2, translateX: '0.3vw',

            }, '<')
            .to(".campanula-component1 img", {
                rotate: '10deg',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut", translateX: '0.3vw',
                duration: 2,
            }, '<')
            .to(".campanula-component4 img,.campanula-component6 img,.campanula-component8 img", {
                rotate: '25deg',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 2,
            }, '<')
            .to(".campanula-component5 img,.campanula-component7 img", {
                rotate: '-25deg',
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut",
                duration: 2,

            }, '<')

    }
    campanula_big();



    //-- 進場動態 --
    const opentl=gsap.timeline({
        onComplete(){

            function getMousePos(event) {
                // 获取鼠标在页面上的位置
                const x = event.clientX;
                const y = event.clientY;
                const windowXCenter=window_width/2;
                const windowYCenter=window_height/2;
                const windowX=x-windowXCenter;
                const windowY=y-windowYCenter;
                
                // gsap.to('.contanier', { 
                //     backgroundPosition: `0 ${0-(windowY/300)}vw`, 
                //     duration: 2, ease: 'power2.out' });
                gsap.to('.contanier .scroll-card-box', { 
                    x:`${(windowX/300)}vw`, 
                    y:`${(windowY/800)}vw`,
                    duration: 5, ease: 'power2.out' });
                gsap.to('.bg-shadow img', { 
                    x: `${0-(windowX/70)}vw`, 
                    // y:`${0-(windowY/200)}vw`, 
                    duration: 4, ease: 'power2.out' });
                gsap.to('.tree-shadow img', { 
                    x: `${0-(windowX/120)}vw`,  
                    // y:`${0-(windowY/300)}vw`, 
                    duration: 4.4, ease: 'power2.out' });
                // gsap.to('.card-box .card-shadow img', {x:`${0-(windowX/100)}px`});

                // console.log(windowX/180);
            }
            // 添加鼠标移动事件监听器
            if(window_width > 1024){
                document.addEventListener('mousemove', getMousePos);
            }
        }
    });
    opentl.pause();

    let time_out = 6;
    let movieTimeOut = setTimeout(mvTime, 1000);

    function mvTime() {
        time_out--;

        if (time_out <= 0) {
            let tl = gsap.timeline();
            tl.to('.movie_box', { opacity: 0, filter: 'blur(10px) brightness(3)', duration: 1 })
                .to('.movie_box', { visibility: 'hidden', }, '>');
            setTimeout(() => { opentl.play() }, 550);
        } else {
            setTimeout(mvTime, 1000);
        }
    }


    $('.skip_btn').click(function (e) {
        e.preventDefault();
        if (time_out > 0) {
            time_out = 0;
        }
    });


        //-- 範例動態 --
        let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let bgShadowX=windowWidth<550 ? 300 : 130;
        let treeShadowX=windowWidth<550 ? -200 : -200;
        // let treeShadowX=windowWidth<550 ? -200 : -120;

    opentl.from('.scroll-card-box .card-box', { x: '-400vw', duration: 3.3, stagger: 0.03, ease: 'power4.out' })

    if (windowWidth < 550) {
        opentl.to('.scroll-card-box', { x: '4vw', duration: 1 }, '<');
    }
    else if (windowWidth < 1024) {
        opentl.to('.scroll-card-box', { x: '20vw', duration: 1 }, '<');
    }

        opentl.fromTo('.contanier .bg-shadow', {x:'-115vw'}, {x:`${bgShadowX}vw`, duration:3, ease:'power4.out'},'<')
        opentl.from('.contanier .tree-shadow', {x:`${treeShadowX}vw`, rotate:'-3deg', duration:3, ease:'power4.out'},'<')
        opentl.fromTo('.contanier', {backgroundPosition:'100% 0%'},{backgroundPosition:'0% 0%', duration:3.5, ease:'power4.out'},'<')
              .from('.scroll-card-box .card-box .card-page-name-box', {opacity:0, y:30, filter:'blur(10px)', duration:1, stagger:0.1, ease:'power1.out'}, '<1.5')
        opentl.from('.scroll-card-box .card-box .envelope', {
                opacity:0, 
                y:20,
                duration:0.5,
                onComplete(){
                    treeShadow();
                    bgShadow(bgShadowX);
                }}, '<0.5');



    //-- 手機滑動卡片 --
    function phoneCardMove() {
        let startX, startY;
        let scrollX = 0;
        let bgX = 0;
        const scrollCard = document.querySelector('.scroll-card-box');
        scrollCard.addEventListener('touchstart', function (event) {
            // 记录触摸起始点的坐标
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
            console.log('觸控開始');
        });
        scrollCard.addEventListener('touchmove', function (event) {
            event.preventDefault();
            // 计算手指在水平和垂直方向上的移动距离
            let deltaX = event.touches[0].clientX - startX;
            let deltaY = event.touches[0].clientY - startY;
            let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            // 判断移动方向
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // 右移
                if (deltaX > 0) {
                    let minScrollX = windowWidth < 550 ? 4 : 20;
                    scrollX = scrollX >= minScrollX ? minScrollX : scrollX + (deltaX / 1.8);
                    bgX = bgX >= 0 ? 0 : bgX + (deltaX / 1.8);
                    // 左移
                } else {
                    let maxScrollX = windowWidth < 550 ? -233 : -160;
                    scrollX = scrollX <= maxScrollX ? maxScrollX : scrollX + (deltaX / 1.8);
                    bgX = bgX <= -170 ? -170 : bgX + (deltaX / 1.8);
                }

                gsap.to('.scroll-card-box', { x: `${scrollX}vw`, duration: 1, ease: 'power2.out' });
                gsap.to('.contanier', { backgroundPosition: `${bgX}vw 0`, duration: 1.3, ease: 'power2.out' });
                gsap.to('.bg-shadow img', { x: `${bgX}vw`, duration: 2, ease: 'power2.out' });
                gsap.to('.tree-shadow img', { x: `${bgX}vw`, duration: 2.2, ease: 'power2.out' });
            } else {
                // 垂直移动
                // if (deltaY > 0) {
                // console.log('向下移动');
                // } else {
                // console.log('向上移动');
                // }
            }

            // 更新起始点坐标
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
            // console.log('觸控移動中');
        });
    }
    phoneCardMove();

}