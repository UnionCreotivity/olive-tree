import indexJS from './index.js'
import caseJS from './case.js'
import historyJS from './history.js'
import sketchJS from './three/sketch.js'
import caseTedJS from './case_ted.js'
import newsJS from './news.js'
import aboutJS from './about.js'
import news_contentJS from './news_content.js'
import contactJS from './contact.js'

import {gsap} from './gsap/esm/index.js'
import {ScrollTrigger} from './gsap/esm/ScrollTrigger.js'
import {CSSPlugin} from './gsap/esm/CSSPlugin.js'
import {ScrollToPlugin} from './gsap/esm/ScrollToPlugin.js'




gsap.registerPlugin(ScrollTrigger, CSSPlugin, ScrollToPlugin);

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

//-- 首頁換頁前動態 --
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

//-- 換頁動畫前 --
function leaveShow (param) {

    console.log('leaveShow');
    let isPhone=window_width <= 900 ;
    
    if($('.cardInner').length<1){
        return false;
    }

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
                        marqueeImg:{
                            src: '../assets/images/flower_txt/oliveTree_txt.png',
                            width: '230vw'
                        },
                        threeImg:{
                            startSrc: `../assets/images/three_img${isPhone ? '/ph' : ''}/olive-tree_s.jpg`,
                            endSrc: `../assets/images/three_img${isPhone ? '/ph' : ''}/olive-tree_e.jpg`
                        },
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
                        marqueeImg: {
                            src: '../assets/images/flower_txt/case_txt.png',
                            width: isPhone ? '310vw' : '122vw' 
                        },
                        threeImg:{
                            startSrc: `../assets/images/three_img${isPhone ? '/ph' : ''}/lily_s.jpg`,
                            endSrc:`../assets/images/three_img${isPhone ? '/ph' : ''}/lily_e.jpg`
                        },
                        blurImg1: '../assets/images/blue_blur_1.png',
                        blurImg2: '../assets/images/blue_blur_2.png',
                        blurImg3: '../assets/images/lily_bg.jpg',
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
                        marqueeImg: {
                            src: '../assets/images/flower_txt/history_txt.png',
                            width: isPhone ? '350vw' : '180vw'
                        },
                        threeImg:{
                            startSrc: `../assets/images/three_img${isPhone ? '/ph' : ''}/cotton_s.jpg`,
                            endSrc:`../assets/images/three_img${isPhone ? '/ph' : ''}/cotton_e.jpg`
                        },
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
                        marqueeImg: {
                            src: '../assets/images/flower_txt/news_txt.png',
                            width: '122vw'
                        },
                        threeImg:{
                            startSrc: `../assets/images/three_img${isPhone ? '/ph' : ''}/campanula_s.jpg`,
                            endSrc:`../assets/images/three_img${isPhone ? '/ph' : ''}/campanula_e.jpg`
                        },
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
            // cardInner.querySelectorAll('.lily-case-bg img').src = cardObj.marqueeImg;
            cardInner.querySelectorAll('.lily-case-bg img').forEach((DOM)=>{
                DOM.src = cardObj.marqueeImg.src;
                DOM.style.width=cardObj.marqueeImg.width;
            })

            // cardInner.querySelector('.back').style.backgroundImage = `url(${cardObj.backBg})`;
            // cardInner.querySelector('.back').style.background = 'linear-gradient(to bottom, rgb(208, 211, 196) 2%, rgb(167, 173, 145) 27%, rgb(145, 152, 110) 60%, rgb(128, 141, 103) 81%, rgb(101, 122, 92) 100%)';
            // cardInner.querySelector('.back').style.background = cardObj.backChangeColor;
            cardInner.querySelector('.back-item-img').style.width = cardObj.backImg?.width;
            cardInner.querySelector('.back-item-img').style.top = cardObj.backImg?.top;
            cardInner.querySelector('.back-item-img').style.left = cardObj.backImg?.left;

            // cardInner.querySelector('.blur-img1').src = cardObj.blurImg1;
            // cardInner.querySelector('.blur-img2').src = cardObj.blurImg2;
            // cardInner.querySelector('.blur-img3').src = cardObj.blurImg3;

            cardInner.querySelector('.back-item-img').classList.add(sessionStorage['card_box']);

            cardInner.querySelector('.bulge #slider').setAttribute('data-images', `["${cardObj.threeImg.startSrc}", "${cardObj.threeImg.endSrc}"]`)

            //-- 水晶球特效 --
            let sketch = new sketchJS({
                duration: 1.5,
                debug: false,
                easing: 'power2.out',
                uniforms: {
                    radius: {value: 0.9, type:'f', min:0.1, max:2},
                    width: {value: 0.35, type:'f', min:0., max:1},
                },
                fragment: `
                    uniform float time;
                    uniform float progress;
                    uniform float width;
                    uniform float scaleX;
                    uniform float scaleY;
                    uniform float transition;
                    uniform float radius;
                    uniform float swipe;
                    uniform sampler2D texture1;
                    uniform sampler2D texture2;
                    uniform sampler2D displacement;
                    uniform vec4 resolution;
            
                    varying vec2 vUv;
                    varying vec4 vPosition;
            
                    float parabola( float x, float k ) {
                    return pow( 4. * x * ( 1. - x ), k );
                    }
            
                    void main()	{
                    vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
                    vec2 p = newUV;
                    vec2 start = vec2(0.5,0.5);
                    vec2 aspect = resolution.wz;
            
                    vec2 uv = newUV;
                    float dt = parabola(progress, 1.);
                    vec4 noise = texture2D(displacement, fract(vUv+time*0.04));
                    float prog = progress*0.66 + noise.g * 0.04;
                    float circ = 1. - smoothstep(-width, 0.0, radius * distance(start*aspect, uv*aspect) - prog*(1.+width));
                    float intpl = pow(abs(circ), 1.);
                    vec4 t1 = texture2D( texture1, (uv - 0.5) * (1.0 - intpl) + 0.5 ) ;
                    vec4 t2 = texture2D( texture2, (uv - 0.5) * intpl + 0.5 );
                    gl_FragColor = mix( t1, t2, intpl );
            
                    }
                `
            });


    let enterShow=gsap.timeline();
    //-- 卡片展開至滿版 --
    
    enterShow.to('.cardInner', {
        opacity: 1,
        duration: 0.5,
        ease: "power1.out",
        // pointerEvents: 'initial'
    })
    //-- 顯示跑馬燈文字 --
    .to('.cardInner .card .back .back-content .lily-case-bg-box', {
        opacity: 1,
        ease: "power1.in",
        duration: 1,
    }, "<")
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
        background: cardObj.backChangeColor,
        ease: "power1.inOut",
        duration: 0.5,
    }, '<')
    .to('.cardInner', {
        duration: 0.6,
        ease: "power1.out",
        maskSize: isPhone ? '260vw':'120vw',
        onComplete(){
            // video_DOM.play();
            sketch.next();
        }
        // pointerEvents: 'initial'
    }, '<0.3')

    
    
    gsap.to('.cardInner .leaf1,.cardInner .leaf2,.cardInner .leaf3,.cardInner .leaf4,.cardInner .leaf5', {
        duration: 65,
        backgroundPosition: 'right 102em bottom 100em', repeat: -1
    }, '<')
    

    return enterShow;
}

//-- 換頁開場動態 --
function enterShow (tl=null) {

    console.log('enterShow');

    let isPhone=window_width <= 900 ;
    
    if($('.cardInner').length<1){
        return false;
    }

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
                        marqueeImg:{
                            src: '../assets/images/flower_txt/oliveTree_txt.png',
                            width: '230vw'
                        },
                        threeImg:{
                            startSrc: `../assets/images/three_img${isPhone ? '/ph' : ''}/olive-tree_s.jpg`,
                            endSrc: `../assets/images/three_img${isPhone ? '/ph' : ''}/olive-tree_e.jpg`
                        },
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
                        marqueeImg: {
                            src: '../assets/images/flower_txt/case_txt.png',
                            width: isPhone ? '310vw' : '122vw' 
                        },
                        threeImg:{
                            startSrc: `../assets/images/three_img${isPhone ? '/ph' : ''}/lily_s.jpg`,
                            endSrc:`../assets/images/three_img${isPhone ? '/ph' : ''}/lily_e.jpg`
                        },
                        blurImg1: '../assets/images/blue_blur_1.png',
                        blurImg2: '../assets/images/blue_blur_2.png',
                        blurImg3: '../assets/images/lily_bg.jpg',
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
                        marqueeImg: {
                            src: '../assets/images/flower_txt/history_txt.png',
                            width: isPhone ? '350vw' : '180vw'
                        },
                        threeImg:{
                            startSrc: `../assets/images/three_img${isPhone ? '/ph' : ''}/cotton_s.jpg`,
                            endSrc:`../assets/images/three_img${isPhone ? '/ph' : ''}/cotton_e.jpg`
                        },
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
                        marqueeImg: {
                            src: '../assets/images/flower_txt/news_txt.png',
                            width: '122vw'
                        },
                        threeImg:{
                            startSrc: `../assets/images/three_img${isPhone ? '/ph' : ''}/campanula_s.jpg`,
                            endSrc:`../assets/images/three_img${isPhone ? '/ph' : ''}/campanula_e.jpg`
                        },
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
            // cardInner.querySelectorAll('.lily-case-bg img').src = cardObj.marqueeImg;
            cardInner.querySelectorAll('.lily-case-bg img').forEach((DOM)=>{
                DOM.src = cardObj.marqueeImg.src;
                DOM.style.width=cardObj.marqueeImg.width;
            })

            // cardInner.querySelector('.back').style.backgroundImage = `url(${cardObj.backBg})`;
            // cardInner.querySelector('.back').style.background = 'linear-gradient(to bottom, rgb(208, 211, 196) 2%, rgb(167, 173, 145) 27%, rgb(145, 152, 110) 60%, rgb(128, 141, 103) 81%, rgb(101, 122, 92) 100%)';
            // cardInner.querySelector('.back').style.background = cardObj.backChangeColor;
            cardInner.querySelector('.back-item-img').style.width = cardObj.backImg?.width;
            cardInner.querySelector('.back-item-img').style.top = cardObj.backImg?.top;
            cardInner.querySelector('.back-item-img').style.left = cardObj.backImg?.left;

            // cardInner.querySelector('.blur-img1').src = cardObj.blurImg1;
            // cardInner.querySelector('.blur-img2').src = cardObj.blurImg2;
            // cardInner.querySelector('.blur-img3').src = cardObj.blurImg3;

            cardInner.querySelector('.back-item-img').classList.add(sessionStorage['card_box']);

            cardInner.querySelector('.bulge #slider').setAttribute('data-images', `["${cardObj.threeImg.startSrc}", "${cardObj.threeImg.endSrc}"]`)

            //-- 水晶球特效 --
            let sketch = new sketchJS({
                duration: 2,
                debug: false,
                easing: 'power2.out',
                uniforms: {
                    radius: {value: 0.9, type:'f', min:0.1, max:2},
                    width: {value: 0.35, type:'f', min:0., max:1},
                },
                fragment: `
                    uniform float time;
                    uniform float progress;
                    uniform float width;
                    uniform float scaleX;
                    uniform float scaleY;
                    uniform float transition;
                    uniform float radius;
                    uniform float swipe;
                    uniform sampler2D texture1;
                    uniform sampler2D texture2;
                    uniform sampler2D displacement;
                    uniform vec4 resolution;
            
                    varying vec2 vUv;
                    varying vec4 vPosition;
            
                    float parabola( float x, float k ) {
                    return pow( 4. * x * ( 1. - x ), k );
                    }
            
                    void main()	{
                    vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
                    vec2 p = newUV;
                    vec2 start = vec2(0.5,0.5);
                    vec2 aspect = resolution.wz;
            
                    vec2 uv = newUV;
                    float dt = parabola(progress, 1.);
                    vec4 noise = texture2D(displacement, fract(vUv+time*0.04));
                    float prog = progress*0.66 + noise.g * 0.04;
                    float circ = 1. - smoothstep(-width, 0.0, radius * distance(start*aspect, uv*aspect) - prog*(1.+width));
                    float intpl = pow(abs(circ), 1.);
                    vec4 t1 = texture2D( texture1, (uv - 0.5) * (1.0 - intpl) + 0.5 ) ;
                    vec4 t2 = texture2D( texture2, (uv - 0.5) * intpl + 0.5 );
                    gl_FragColor = mix( t1, t2, intpl );
            
                    }
                `
            });


    let enterShow=gsap.timeline();
    //-- 卡片展開至滿版 --
    
    enterShow.to('.cardInner', {
        opacity: 1,
        duration: 0,
        ease: "power1.out",
        // pointerEvents: 'initial'
    })
    //-- 顯示跑馬燈文字 --
    .to('.cardInner .card .back .back-content .lily-case-bg-box', {
        opacity: 1,
        ease: "power1.in",
        duration: 1,
    }, "<")
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
        background: cardObj.backChangeColor,
        ease: "power1.inOut",
        duration: 0.5,
    }, '<')
    .to('.cardInner', {
        duration: 0,
        ease: "power1.out",
        maskSize: isPhone ? '260vw':'120vw',
        onComplete(){
            // video_DOM.play();
            sketch.next();
        }
        // pointerEvents: 'initial'
    }, '<0.3')

    .fromTo('.cardInner .card .back .back-content .back-item-img', { opacity: 0, scale: 8, filter:'blur(10px)'}, { opacity: 1, scale: 1, filter:'blur(0px)', ease: "power4.out", duration: 1.5}, '<')
    .to('.cardInner .leaf1,.cardInner .leaf2,.cardInner .leaf3,.cardInner .leaf4,.cardInner .leaf5', {
        display: 'flex',
        ease: "power1.in",
        duration:0.1,
        onComplete() {
            const lilyBox = document.querySelector('.cardInner .card .back .back-content .lily-case-bg-box .lily-case-bg');
            lilyBox.classList.add('marquee');
            // $('.cardInner').removeClass('mask_s');
        }
    },'<')
    
    gsap.to('.cardInner .leaf1,.cardInner .leaf2,.cardInner .leaf3,.cardInner .leaf4,.cardInner .leaf5', {
        duration: 65,
        backgroundPosition: 'right 102em bottom 100em', repeat: -1
    }, '<')

    return enterShow;
}

//-- 監控所有內部連結 --
function barbr_link () {
   $('[data-barba="wrapper"]').on('click', 'a[barba-href]', function (e) {
    e.preventDefault();
    let url= $(this).attr('barba-href');
    barba.go(url);
   });
   
}


function enterBannerSmall () {
    let isPhone=window_width <= 900 ;
    let enterShow=gsap.timeline();
    enterShow
             .to('.cardInner', {maskSize: isPhone ? '90vw':'62vw', duration: 0.6, ease: "power2.out",})
             .to('.cardInner .bulge', {opacity:0, filter:'blur(15px)', duration: 0.8,},'<')
             .to('body', {height:'auto', overflow:'auto', duration: 0.1,},'<0.5')
             

    return enterShow;
}


//-- 內頁下滑動態 --
function innerScroll () {
    let end_num=1000;
    // $('.container_box').css('padding-top', `${end_num}px`);
    
    let f_move=gsap.timeline({
        scrollTrigger: {
            trigger: ".cardInner",
            pin: true, // pin the trigger element while active
            start: "top top", // when the top of the trigger hits the top of the viewport
            end: `500`,
            scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
            // markers:true
        },
    });
    f_move.to('.cardInner.mask_div', {maskSize:'0vw', duration:1 , ease:'power4.out'})
        //   .to('.cardInner .blur-1', {x:'50vw', duration:1 , ease:'power2.out'}, '<')
        //   .to('.cardInner .blur-2', {x:'20vw', duration:1 , ease:'power2.out'}, '<')
          .to('.cardInner .blur-3', {x:'-10vw', duration:1 , ease:'power2.out'}, '<')
          .to('.cardInner .back-content .back-item-img', {y:'50vw', scale:2, duration:1},'<')

    //-- MENU下滑動態 --
    let menuTL=gsap.timeline({
        scrollTrigger: {
            toggleActions: "play none reverse none",
            trigger: "body",
            start: "top top", // when the top of the trigger hits the top of the viewport
            end: "10px top",
            // markers:true
        },
    })

    menuTL.to('.page-header', {y:0, duration:0.5, ease: 'power1.inOut'});

    return f_move;
}

//-- 返回首頁動態 --
function backIndex (tl) {
    $('.container_box').css('padding-top', `0px`);
    if(tl!==undefined){
        tl.kill();
    }
    

    let bTl=gsap.timeline();
        bTl.to('.cardInner', {maskSize:'120vw', duration:1.5, ease:'power2.out'})
        .to('.cardInner.mask_div', {
            maskSize:'0vw', 
            duration:1.5, 
            ease:'power4.out',
            onComplete(){
                $('.pin-spacer .cardInner, .pin-spacer .cardInner div, .pin-spacer .cardInner img').attr('style', '');
                let cardInnerHTML=$('.pin-spacer').html();
                $('.pin-spacer').remove();
                $('body').append(cardInnerHTML);
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

//-- 手機板footer --

function footerInsert() {
    var footer_div;
    if($(window).width()>900){
         footer_div =
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
    }
    else{
        footer_div =
        '<div class="page-footer-info-moblie">' +
        '<div class="copy-right">Copyright © 2023橄欖樹廣告行銷有限公司 版權所有</div>' +
        '<div class="address">地址 ｜ 244新北市林口區忠孝路7號</div>' +
        '<div class="phone">TEL | (02) 2606 8068</div>' +
        '</div>'
    }

    if($('.page-footer-info-moblie').length<1){
        $('body').append(footer_div);
    }
}
footerInsert();


let flower={
    'about':'olive-tree',
    'case': 'lily',
    'case_ted': 'lily',
    'history': 'cotton',
    'news': 'campanula',
    'news_content':'campanula',
    'contact':'campanula',
}


barba.init({
    debug: true,
   
    //-- 大家都會用到的過渡 --
    transitions: [{
      
      async before(data){
        console.log('前');

        //--花朵判斷 --
        console.log(data.next.url.path)
        if(data.next.url.path.indexOf('/')!=-1){
            let next_url=data.next.url.path.split('/');
            next_url=next_url[next_url.length-1].split('.')
            sessionStorage['card_box']=flower[next_url[0]];
        }
        else{
            let next_url= data.next.url.path.split('.');
            sessionStorage['card_box']=flower[next_url[0]];  
        }
        
        if(data.current.url.path.indexOf('index')!=-1){
           await indexBeforeEnter();
        }
        else{
            await gsap.to(window, { duration: 0, scrollTo: 0 ,});
        }
  
      },

      async leave(data) {
        console.log('離開');
        if(data.current.url.path.indexOf('index')!=-1){
            await leaveShow()
        }
        else{
            
        }
        data.current.container.remove()
      },


      async enter(data) {
        console.log('進入')
        console.log(data.current.url.path);

        if(data.next.url.path.indexOf('index')!=-1){
            //await indexAnimation();
        }
        else{
            barbr_link();
            await enterShow()
            await enterBannerSmall();
            innerScrollTL= await innerScroll();
            if($(window).width()<900){
                footerInsert();
            }
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
        //--花朵判斷 --
        console.log(data.next.url.path)
        let next_url=data.next.url.path.split('/');
        next_url=next_url[next_url.length-1].split('.')
        sessionStorage['card_box']=flower[next_url[0]];

        if(data.next.url.path.indexOf('index')!=-1){
          //await indexAnimation();
        }
        else{
          barbr_link();
          await enterShow();
          await enterBannerSmall();
          innerScrollTL= await innerScroll();
          if($(window).width()<900){
            footerInsert();
        }
        }
      }
    }],

    //-- 針對指定的namespace 跑的fun --
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
            },
        },
        {
            namespace: 'about',
            beforeEnter(data) {
                console.log('關於我們')
                aboutJS();
            },
        },
        {
            namespace: 'case',
            beforeEnter(data) {
                console.log('熱銷建案')
                caseJS();
            },
        },
        {
            namespace: 'case_ted',
            beforeEnter(data) {
                console.log('熱銷建案內頁')
                caseTedJS();
            },
        },
        {
            namespace: 'history',
            beforeEnter(data) {
                console.log('歷屆業績')
                historyJS();
            },
        },
        {
            namespace: 'news',
            beforeEnter(data) {
                console.log('最新消息')
                newsJS();
            },
        },
        {
            namespace: 'news_content',
            beforeEnter(data) {
                console.log('最新消息內容')
                news_contentJS();
            },
        },
        {
            namespace: 'contact',
            beforeEnter(data) {
                console.log('聯絡我們')
                contactJS();
            },
        }
    ]
  });