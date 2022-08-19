/* ===================================================================
 * Ceevee 2.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function(html) {

    "use strict";

    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';

    // https://stackoverflow.com/a/63966351
    var DOMAnimations = {

        /**
        * SlideUp
        *
        * @param {HTMLElement} element
        * @param {Number} duration
        * @returns {Promise<boolean>}
        */
        slideUp: function (element, duration = 500) {

            return new Promise(function (resolve, reject) {

                element.style.height = element.offsetHeight + 'px';
                element.style.transitionProperty = `height, margin, padding`;
                element.style.transitionDuration = duration + 'ms';
                element.offsetHeight;
                element.style.overflow = 'hidden';
                element.style.height = 0;
                element.style.paddingTop = 0;
                element.style.paddingBottom = 0;
                element.style.marginTop = 0;
                element.style.marginBottom = 0;
                window.setTimeout(function () {
                    element.style.display = 'none';
                    element.style.removeProperty('height');
                    element.style.removeProperty('padding-top');
                    element.style.removeProperty('padding-bottom');
                    element.style.removeProperty('margin-top');
                    element.style.removeProperty('margin-bottom');
                    element.style.removeProperty('overflow');
                    element.style.removeProperty('transition-duration');
                    element.style.removeProperty('transition-property');
                    resolve(false);
                }, duration)
            })
        },

        /**
        * SlideDown
        *
        * @param {HTMLElement} element
        * @param {Number} duration
        * @returns {Promise<boolean>}
        */
        slideDown: function (element, duration = 500) {

            return new Promise(function (resolve, reject) {

                element.style.removeProperty('display');
                let display = window.getComputedStyle(element).display;

                if (display === 'none')
                    display = 'block';

                element.style.display = display;
                let height = element.offsetHeight;
                element.style.overflow = 'hidden';
                element.style.height = 0;
                element.style.paddingTop = 0;
                element.style.paddingBottom = 0;
                element.style.marginTop = 0;
                element.style.marginBottom = 0;
                element.offsetHeight;
                element.style.transitionProperty = `height, margin, padding`;
                element.style.transitionDuration = duration + 'ms';
                element.style.height = height + 'px';
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');
                window.setTimeout(function () {
                    element.style.removeProperty('height');
                    element.style.removeProperty('overflow');
                    element.style.removeProperty('transition-duration');
                    element.style.removeProperty('transition-property');
                }, duration)
            })
        },

        /**
        * SlideToggle
        *
        * @param {HTMLElement} element
        * @param {Number} duration
        * @returns {Promise<boolean>}
        */
        slideToggle: function (element, duration = 500) {

            if (window.getComputedStyle(element).display === 'none') {

                return this.slideDown(element, duration);

            } else {

                return this.slideUp(element, duration);
            }
        }
    }


   /* Move header menu
    * -------------------------------------------------- */
    const ssMoveHeader = function () {

        const hdr = document.querySelector('.s-header');
        const hero = document.querySelector('#hero');
        let triggerHeight;

        if (!(hdr && hero)) return;

        setTimeout(function(){
            triggerHeight = hero.offsetHeight - 170;
        }, 300);

        window.addEventListener('scroll', function () {

            let loc = window.scrollY;


            if (loc > triggerHeight) {
                hdr.classList.add('sticky');
            } else {
                hdr.classList.remove('sticky');
            }

            if (loc > triggerHeight + 20) {
                hdr.classList.add('offset');
            } else {
                hdr.classList.remove('offset');
            }

            if (loc > triggerHeight + 150) {
                hdr.classList.add('scrolling');
            } else {
                hdr.classList.remove('scrolling');
            }

        });

    }; // end ssMoveHeader


   /* Mobile Menu
    * ---------------------------------------------------- */
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.s-header__menu-toggle');
        const headerNavWrap = document.querySelector('.s-header__nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && headerNavWrap)) return;

        toggleButton.addEventListener('click', function(event){
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        headerNavWrap.querySelectorAll('.s-header__nav a').forEach(function(link) {
            link.addEventListener("click", function(evt) {

                // at 800px and below
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {

            // above 800px
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });

    }; // end ssMobileMenu


   /* Highlight active menu link on pagescroll
    * ------------------------------------------------------ */
    const ssScrollSpy = function() {

        const sections = document.querySelectorAll(".target-section");

        // Add an event listener listening for scroll
        window.addEventListener("scroll", navHighlight);

        function navHighlight() {

            // Get current scroll position
            let scrollY = window.pageYOffset;

            // Loop through sections to get height(including padding and border),
            // top and ID values for each
            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");

               /* If our current scroll position enters the space where current section
                * on screen is, add .current class to parent element(li) of the thecorresponding
                * navigation link, else remove it. To know which link is active, we use
                * sectionId variable we are getting while looping through sections as
                * an selector
                */
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".s-header__nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".s-header__nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }

    }; // end ssScrollSpy


   /* Lightbox
    * ------------------------------------------------------ */
    const ssLightbox = function() {

        const folioLinks = document.querySelectorAll('.folio-item a');
        const modals = [];

        folioLinks.forEach(function(link) {
            let modalbox = link.getAttribute('href');
            let instance = basicLightbox.create(
                document.querySelector(modalbox),
                {
                    onShow: function(instance) {
                        //detect Escape key press
                        document.addEventListener("keydown", function(evt) {
                            evt = evt || window.event;
                            if(evt.keyCode === 27){
                            instance.close();
                            }
                        });
                    }
                }
            )
            modals.push(instance);
        });

        folioLinks.forEach(function(link, index) {
            link.addEventListener("click", function(e) {
                e.preventDefault();
                modals[index].show();
            });
        });

    };  // end ssLightbox


   /* Alert boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');

        boxes.forEach(function(box) {

            box.addEventListener('click', function(e){
                if (e.target.matches(".alert-box__close")) {
                    e.stopPropagation();
                    e.target.parentElement.classList.add("hideit");

                    setTimeout(function() {
                        box.style.display = "none";
                    }, 500)
                }
            });

        })

    }; // end ssAlertBoxes


   /* Smoothscroll
    * ------------------------------------------------------ */
    const ssSmoothScroll = function () {

        const triggers = document.querySelectorAll(".smoothscroll");

        triggers.forEach(function(trigger) {
            trigger.addEventListener("click", function() {
                const target = trigger.getAttribute("href");

                Jump(target, {
                    duration: 1200,
                });
            });
        });

    }; // end ssSmoothScroll


   /* back to top
    * ------------------------------------------------------ */
    const ssBackToTop = function() {

        const pxShow = 900;
        const goTopButton = document.querySelector(".ss-go-top");

        if (!goTopButton) return;

        // Show or hide the button
        if (window.scrollY >= pxShow) goTopButton.classList.add("link-is-visible");

        window.addEventListener('scroll', function() {
            if (window.scrollY >= pxShow) {
                if(!goTopButton.classList.contains('link-is-visible')) goTopButton.classList.add("link-is-visible")
            } else {
                goTopButton.classList.remove("link-is-visible")
            }
        });

    }; // end ssBackToTop

    /*	Fade In/Out Panel Details
     * -----------------------------------------------------*/
    const ssPanelFade = function() {
        const panels = document.querySelectorAll('.panel-heading');
        panels.forEach(function(panel) {
            const id = "expandable-" + panel.getAttribute('id').split('-')[1];

            panel.addEventListener('click', function() {
                panel.classList.toggle('expanded');
                DOMAnimations.slideToggle(document.getElementById(id));
            });
        });
    }; // end ssPanelFade

   /* initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssMoveHeader();
        ssMobileMenu();
        ssScrollSpy();
        ssLightbox();
        ssAlertBoxes();
        ssSmoothScroll();
        ssBackToTop();
        ssPanelFade();

    })();

})(document.documentElement);
