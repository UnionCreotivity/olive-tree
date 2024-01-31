import indexJS from './index.js'

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CSSPlugin);
gsap.registerPlugin(ScrollToPlugin)

var window_width = window.screen.width;
var window_height = window.innerHeight;
let innerScrollTL;

function indexAnimation () {
    //-- 進場動態 --
    const opentl = gsap.timeline({
        onComplete() {

            // 添加鼠标移动事件监听器
            if (window_width > 1024) {
                window.addEventListener('mousemove', getMousePos);
            }
        }
    });
    opentl.pause();

    //-- 開頭影片 --
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

    //-- J哥想要的 --
    let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let bgShadowX=windowWidth<550 ? 300 : 130;
    // let treeShadowX=windowWidth<550 ? -200 : -200;
    let treeShadowX=windowWidth<550 ? -200 : -120;
    let cardShadowX=windowWidth<550 ? 0 : 50;
    let cardNameTime=windowWidth<550 ? '<0.1' : '<0.8';

    opentl.fromTo('.scroll-card-box .card-box', { x: '-400vw' }, { x: `${cardShadowX}vw`, duration: 1.8, stagger: 0.03, ease: 'power4.out' })
          .addLabel('cardBack', '>')
          
    if (windowWidth < 550) {
        opentl.to('.scroll-card-box', { x: '4vw', duration: 1 }, '<');
    }
    else if (windowWidth < 1024) {
        opentl.to('.scroll-card-box', { x: '20vw', duration: 1 }, '<');
    }

    opentl.fromTo('.contanier .bg-shadow', {x:'-115vw'}, {x:`${bgShadowX+50}vw`, duration:2, ease:'power4.out'},'<')
    opentl.fromTo('.contanier .tree-shadow', {x:`${treeShadowX}vw`, rotate:'-3deg'}, {x:`50vw`, rotate:'-3deg', duration:2, ease:'power4.out'},'<')
    opentl.fromTo('.contanier', {backgroundPosition:'100% 0%'},{backgroundPosition:'0% 0%', duration:2.5, ease:'power4.out'},'<')
    opentl.to('.scroll-card-box .card-box', { x: '-5vw', duration: 1.2, stagger: 0.05, ease: 'power3.inOut' },'cardBack-=0.55')

    //-- 多一段回彈 --
    .addLabel('cardBack2', '<')
    opentl.to('.scroll-card-box .card-box', { x: '0vw', duration: 0.5, stagger: 0.1, ease: 'power1.inOut' },'>-0.2')
    
    opentl.to('.contanier .bg-shadow', {x:`${bgShadowX}vw`, duration:1.5, ease:'power3.inOut'},'cardBack2')
          .to('.contanier .tree-shadow', {x:`0vw`, rotate:'-3deg', duration:2, ease:'power3.inOut'},'<')
          .from('.scroll-card-box .card-box .card-page-name-box', 
            { 
                opacity:0, 
                y:30, 
                filter:'blur(10px)', 
                duration:0.8, 
                stagger:0.1, 
                ease:'power1.out',
                onComplete(){
                    treeShadow();
                    bgShadow(bgShadowX);
                    phoneCardMove();
                }}, cardNameTime);
    
    //-- J哥想要的 END --

    return opentl;
}

//-- 換頁前動態 --
function indexBeforeEnter (param) {

    window.removeEventListener('mousemove', getMousePos);

    const card_box=document.querySelector('.checkCard');
    const card = card_box.querySelector('.card');

    const scrollCardBoxRect = document.querySelector('.scroll-card-box').getBoundingClientRect();
    const cardBoxRect = card_box.getBoundingClientRect();

    var deltaX;
    if (window_width <= 550) {
        deltaX = (scrollCardBoxRect.width - cardBoxRect.width) / 15 - (cardBoxRect.left - scrollCardBoxRect.left);

    }
    else if (window_width <= 1024) {
        deltaX = (scrollCardBoxRect.width - cardBoxRect.width) / 7 - (cardBoxRect.left - scrollCardBoxRect.left);

    } else {

        deltaX = (scrollCardBoxRect.width - cardBoxRect.width) / 2 - (cardBoxRect.left - scrollCardBoxRect.left);
    }

    //-- 卡片位移到中間 --
    let cardTL=gsap.timeline();
        cardTL.to(document.querySelector('.scroll-card-box'), {
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
        // .to(card, {y:-50, ease:'power2.out', duration:1}, '>-0.4')

    return cardTL;
}

//-- 換頁開場動態 --
function enterShow (container=null) {

    $('body').css('height','100vh');
    $('body').css('overflow','hidden');

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

            switch (sessionStorage['card_box']) {
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
            console.log(cardInner,'抓cardInner');
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

            cardInner.querySelector('.back-item-img').classList.add(sessionStorage['card_box']);


    let enterShow=gsap.timeline();
    //-- 卡片展開至滿版 --
    
    enterShow.to('.cardInner', {
        opacity: 1,
        duration: 0.5,
        ease: "power1.out",
        // pointerEvents: 'initial'
    })
    .to('.cardInner .card .back .back-content .back-item-img', {
        opacity: 0,
        ease: "power1.inOut",
        duration: 0.1,
    }, '<')
    .to('.cardInner .card', {
        width: '120%',
        height: '230%',
        top: '-70%',
        left: '-8%',
        ease: "power1.inOut",
        duration: 0.1,
    }, '<')

    // .to('.cardInner .card .back', {
    //     border: '0px solid white',
    //     borderRadius: '100%',
    //     ease: "power1.out",
    //     duration: 0.8,
    // }, '<')

    .to('.cardInner .card .back .back-content .back-item-img', {
        width: cardMv.backImg.small.width,
        top: cardMv.backImg.small.top,
        left: cardMv.backImg.small.left,
        bottom: cardMv.backImg.small.bottom,
        position: 'fixed',
        // filter: 'blur(10px)',
        ease: "power1.inOut",
        // duration: 2,
        duration: 0.1,
    }, '<')
    .to('.cardInner .card .back', {
        background: '#fff',
        ease: "power1.inOut",
        duration: 0.5,
    }, '<')
    .fromTo('.cardInner .blur-1, .cardInner .blur-2, .cardInner .blur-3', {opacity: 0, scale: 1.8, y:50}, {opacity: 1, scale: 1, y:0, ease: "power4.out", stagger:0.15, duration: 1.5}, "<0.5")
    .fromTo('.cardInner .card .back .back-content .back-item-img', { opacity: 0, scale: 5, filter:'blur(10px)'}, { opacity: 1, scale: 1, filter:'blur(0px)', ease: "power4.out", duration: 2}, '<0.5')

    .to('.cardInner .leaf1,.cardInner .leaf2,.cardInner .leaf3,.cardInner .leaf4,.cardInner .leaf5', {
        display: 'flex',
        ease: "power1.in",
    })
    .to('.cardInner .card .back .back-content .lily-case-bg-box', {
        opacity: 1,
        ease: "power1.in",
        duration: 1,
        onComplete() {
            const lilyBox = document.querySelector('.cardInner .card .back .back-content .lily-case-bg-box .lily-case-bg');
            lilyBox.classList.add('marquee');
        }
    }, "<")

    


    gsap.to('.cardInner .leaf1,.cardInner .leaf2,.cardInner .leaf3,.cardInner .leaf4,.cardInner .leaf5', {
        duration: 65,
        backgroundPosition: 'right 102em bottom 100em', repeat: -1
    }, '<')

    return enterShow;
}

//-- 內頁下滑動套 --
function innerScroll () {
    let end_num=1500;
    $('.container_box').css('padding-top', `${end_num}px`);
    gsap.to('body', {height:'auto', overflow:'auto', duration: 0.1,})

    let f_move=gsap.timeline({
        scrollTrigger: {
            trigger: ".cardInner",
            pin: true, // pin the trigger element while active
            start: "top top", // when the top of the trigger hits the top of the viewport
            end: `+=${end_num}`,
            scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
            // markers:true
        },
    });
    f_move.to('.cardInner.mask_div', {maskSize:'0vw 0vw', duration:1 , ease:'power4.out'})
          .to('.cardInner .blur-1', {x:'50vw', duration:1 , ease:'power2.out'}, '<')
          .to('.cardInner .blur-2', {x:'20vw', duration:1 , ease:'power2.out'}, '<')
          .to('.cardInner .blur-3', {x:'-10vw', duration:1 , ease:'power2.out'}, '<')
          .to('.cardInner .back-content .back-item-img', {y:'50vw', scale:2, duration:1},'<')
    return f_move;
}

//-- 返回首頁動態 --
function backIndex (tl) {
    $('.container_box').css('padding-top', `0px`);
    tl.kill();
    gsap.to(window, { 
        duration: 1.5, 
        scrollTo: 0 ,
        onComplete(){
            let bTl=gsap.timeline();
            bTl.to('.cardInner.mask_div', {maskSize:'150vw 150vw', duration:1.5, ease:'power2.out'})
            .to('.cardInner.mask_div', {
                maskSize:'0vw 0vw', 
                duration:1.5, 
                ease:'power4.out',
                onComplete(){
                    $('.pin-spacer .cardInner').attr('style', '');
                    let cardInnerHTML=$('.pin-spacer').html();
                    $('.pin-spacer').remove();
                    $('body').append(cardInnerHTML);
                }
            });
        }
    });
    

   
}



//-- 滑鼠滑動 --
function getMousePos(event) {
    // 获取鼠标在页面上的位置
    const x = event.clientX;
    const y = event.clientY;
    const windowXCenter = window_width / 2;
    const windowYCenter = window_height / 2;
    const windowX = x - windowXCenter;
    const windowY = y - windowYCenter;

    // gsap.to('.contanier', { 
    //     backgroundPosition: `0 ${0-(windowY/300)}vw`, 
    //     duration: 2, ease: 'power2.out' });
    gsap.to('.contanier .scroll-card-box', {
        x: `${(windowX / 1000)}vw`,
        // y:`${(windowY/800)}vw`,
        duration: 1, ease: 'power3.out'
    });
    gsap.to('.bg-shadow img', {
        x: `${0 - (windowX / 70)}vw`,
        // y:`${0-(windowY/200)}vw`, 
        duration: 4, ease: 'power3.out'
    });
    gsap.to('.tree-shadow img', {
        x: `${0 - (windowX / 120)}vw`,
        // y:`${0-(windowY/300)}vw`, 
        duration: 4.4, ease: 'power3.out'
    });
    // gsap.to('.card-box .card-shadow img', {x:`${0-(windowX/100)}px`});

    // console.log(windowX/180);
}

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
                bgX = bgX >= 0 ? -20 : bgX + (deltaX / 1.8);
                // 左移
            } else {
                let maxScrollX = windowWidth < 550 ? -233 : -160;
                scrollX = scrollX <= maxScrollX ? maxScrollX : scrollX + (deltaX / 1.8);
                bgX = bgX <= -170 ? -170 : bgX + (deltaX / 1.8);
            }

            gsap.to('.scroll-card-box', { x: `${scrollX}vw`, duration: 1, ease: 'power2.out' });
            gsap.to('.contanier', { backgroundPosition: `${bgX}vw 0`, duration: 1.3, ease: 'power2.out' });
            // gsap.to('.bg-shadow img', { x: `${bgX}vw`, duration: 2, ease: 'power2.out' });
            // gsap.to('.tree-shadow img', { x: `${bgX}vw`, duration: 2.2, ease: 'power2.out' });
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

//-- 樹影 --
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

//-- 背景光影 --
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


barba.init({
    // We don't want "synced transition"
    // because both content are not visible at the same time
    // and we don't need next content is available to start the page transition
    // sync: true,
    transitions: [{
      // NB: `data` was not used.
      // But usually, it's safer (and more efficient)
      // to pass the right container as a paramater to the function
      // and get DOM elements directly from it
      async before(data){
        console.log('前');
        if(data.current.url.path.indexOf('index')!=-1){
           await indexBeforeEnter();
        }
  
      },
      async leave(data) {
        // Not needed with async/await or promises
        // const done = this.async();
        console.log('離開');

        if(data.next.url.path.indexOf('index')!=-1){
            
        }
        else{
            await enterShow()
        }
        // No more needed as we "await" for pageTransition
        // And i we change the transition duration, no need to update the delay…
        // await delay(1000)

        // Not needed with async/await or promises
        // done()

        // Loading screen is hiding everything, time to remove old content!
        data.current.container.remove()
      },

      async enter(data) {
        console.log('進入')

        if(data.next.url.path.indexOf('index')!=-1){
            //await indexAnimation();
        }
        else{
            innerScrollTL= await innerScroll();
        }
        
        // await pageTransitionOut(data.next.container)
      },
      // Variations for didactical purpose…
      // Better browser support than async/await
      // enter({ next }) {
      //   return pageTransitionOut(next.container);
      // },
      // More concise way
      // enter: ({ next }) => pageTransitionOut(next.container),

      async once(data) {
        console.log('一開始')
        if(data.next.url.path.indexOf('index')!=-1){
          //await indexAnimation();
        }
        else{
          await enterShow();
          innerScrollTL= await innerScroll();
        }
      }
    }],

    views:[
        {
            namespace: 'index',
            beforeEnter(data) {
                console.log('回首頁')
                indexJS();
                backIndex(innerScrollTL);
            },
            afterEnter(){
                indexAnimation();
            }
        }
    ]
  });