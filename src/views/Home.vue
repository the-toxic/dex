<template>
  <div id="landingPage">
    <main>
      <header>
        <div class="wrapper">
          <div class="header_inner">
            <a href="/" class="header_logo_link">
              <img src="/assets/landing/svg/logo.svg" alt="Logotype hazb" class="header_logo">
            </a>
            <ul class="header_nav">
              <template v-if="!userStore.logged">
                <li class="header_nav_li"><router-link :to="{name: 'AuthSignIn'}" class="header_link"><p>Sign In</p></router-link></li>
                <li class="header_nav_li"><router-link :to="{name: 'AuthSignUp'}" class="link header_link">Sign Up</router-link></li>
              </template>
              <template v-else>
                <li class="header_nav_li"><router-link :to="{name: 'Console'}" class="link header_link">Console</router-link></li>
              </template>
            </ul>
          </div>
        </div>
      </header>
      <section>
        <div class="wrapper">
          <div class="intro_bcg">
            <div id="intro_video" class="intro_video">
              <video v-if="breakpoints.mdAndUp" class="services_video_desktop" width="100%" height="100%" autoplay muted loop type="video/mp4">
                <source src="/assets/landing/video/video_header.mp4" type="video/mp4" />
              </video>
              <video v-if="breakpoints.smAndDown" src="/assets/landing/video/video_header_mobile.mp4" loop="" muted="" playsinline="" autoplay="" type="video/mp4" class="services_video_mobile" width="100%" height="100%"></video>
            </div>
            <div class="intro">
              <div class="intro_text">
                <h1 class="intro_text_title">Elevate Your Investment Game with Advanced AI Analytics</h1>
                <router-link :to="{name: userStore.logged ? 'Console' : 'AuthSignIn'}" class="link intro_text_link">Get Started</router-link>
              </div>
              <div class="intro_solutions">
                <p class="intro_solutions_p">A complete solution for:</p>
                <ul class="intro_solutions_list">
                  <li class="intro_solutions_li intro_solutions_li1">Crypto Investors</li>
                  <li class="intro_solutions_li intro_solutions_li2">Venture Capital</li>
                  <li class="intro_solutions_li intro_solutions_li3">Exchanges & Marketplaces</li>
                  <li class="intro_solutions_li intro_solutions_li4">Crypto & DeFi Protocols</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="wrapper">
          <div class="cases">
            <h2 class="cases_title">Unlock Blockchain's Potential with HAZB</h2>
            <div class="cases_grid">
              <div class="cases_items">
                <div class="cases_item cases_item1">
                  <h3 class="cases_item_title">Entity Tracking</h3>
                  <p class="cases_item_p">Look beyond pseudonyms to identify key players behind wallets and transactions.</p>
                </div>
                <div class="cases_item cases_item2">
                  <h3 class="cases_item_title cases_item_title2">Portfolio Oversight</h3>
                  <p class="cases_item_p cases_item_p2">Monitor your assets in&nbsp;real-time. Track historical performance to inform future strategies.</p>
                </div>
                <div class="cases_item cases_item3">
                  <h3 class="cases_item_title">Competitive Intelligence</h3>
                  <p class="cases_item_p cases_item_p3">See what top traders are doing in real-time and historically. Adopt winning strategies early.</p>
                </div>
                <div class="cases_item cases_item4">
                  <h3 class="cases_item_title">Predictive Analysis</h3>
                  <p class="cases_item_p">Forecast market movements by analysing on-chain data and transaction flows. Predict trends before they emerge.</p>
                </div>
                <div class="cases_item cases_item5">
                  <h3 class="cases_item_title cases_item_title5">Enhanced Research</h3>
                  <p class="cases_item_p cases_item_p5">Dive deep with robust on-chain data analytics. Illuminate blockchain complexities.</p>
                </div>
                <div class="cases_item cases_item6">
                  <h3 class="cases_item_title cases_item_title6">Illicit Activity Detection</h3>
                  <p class="cases_item_p">Detect suspicious transactions quickly. Safeguard your investments against threats.</p>
                </div>
              </div>
              <div class="cases_right_text">
                <p class="cases_right_text_p">With HAZB, gain an information advantage to capitalize on opportunities. Our powerful blockchain intelligence platform provides transparency, amplifies insight, and enables better decisions.</p>
                <p class="cases_right_text_p">Unlock crypto's full potential with the power of data. HAZB - intelligence for the informed investor.</p>
              </div>
              <div class="cases_chains">
                <p class="cases_chains_p">Support chains:</p>
                <ul class="cases_chains_list">
                  <li class="cases_chains_li cases_chains_li1"></li>
                  <li class="cases_chains_li cases_chains_li2"></li>
                  <li class="cases_chains_li cases_chains_li3"></li>
                  <li class="cases_chains_li cases_chains_li4"></li>
                  <li class="cases_chains_li cases_chains_li5"></li>
                </ul>
              </div>
              <div class="trigger_anim"></div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="about_bcg">
          <div class="wrapper about_wrap">

            <canvas ref="canvasImageRef"></canvas>

            <div class="about">
              <h2 class="about_title">Elevate Your Crypto Strategy with HAZB's Blockchain Analytics</h2>
              <div class="about_text">
                <p class="about_text_p">Our cutting-edge platform empowers informed decision making, early detection of emerging trends, and success in the fast-paced crypto landscape.</p>
                <p class="about_text_p">Fortify your team's strategies and amplify your investments with our unrivaled intelligence capabilities and deep data-driven insights. HAZB enables you to dive deeper, move faster, and gain an unbeatable edge.</p>
              </div>
            </div>
            <div class="benefits">
              <div class="benefits_item">
                <h3 class="benefits_item_title">Gain Invaluable Intelligence on What Matters Most</h3>
                <p class="benefits_item_p">Target the blockchain activity, addresses, entities, and assets that matter most to you. Our comprehensive platform empowers your crypto investigations and strategy with user-friendly, data-driven insights.</p>
              </div>
              <div class="benefits_item">
                <h3 class="benefits_item_title">Discover Key Players Shaping the Blockchain</h3>
                <p class="benefits_item_p">Gain unrivalled insights on blockchain's key players and whales. Our platform analyses and reveals activity across networks, fuelling your crypto journey with data-driven intelligence on impactful entities.</p>
              </div>
              <div class="benefits_item">
                <h3 class="benefits_item_title">Custom Alerts for Essential On-Chain Activity</h3>
                <p class="benefits_item_p">Stay on top of need-to-know blockchain events and transactions with customized notifications. Personalize your alerts, get timely updates, and make informed decisions. Harness the power of customization for optimal awareness and success.</p>
              </div>
              <div class="benefits_item">
                <h3 class="benefits_item_title">Comprehensive Research at Your Fingertips</h3>
                <p class="benefits_item_p">Embrace the future of blockchain intelligence with our extensively researched, data-driven analysis. Unlock reliable insights for better-informed crypto decisions. Stay ahead with our professional-grade research capabilities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="wrapper">
          <div class="trial">
            <div class="trial_text">
              <h4 class="trial_title">Unlock crypto insights with powerful analytics</h4>
              <p class="trial_text_p">Gain clarity. Identify opportunities. Improve decisions. Our analytics platform provides robust blockchain intelligence for your crypto journey. Embrace data-driven insights today.</p>
            </div>
            <router-link :to="{name: userStore.logged ? 'Console' : 'AuthSignIn'}" class="link trial_link">Start your Trial</router-link>
          </div>
        </div>
      </section>
    </main>
    <footer>
      <div class="wrapper">
        <div class="footer_top">
          <div class="footer_grid">
            <div class="footer_item">
              <p class="footer_item_title">Company</p>
              <div class="footer_item_list">
                <a href="#!" class="footer_item_link">About Us</a>
                <router-link :to="{name: 'Career'}" class="footer_item_link">Careers</router-link>
                <a href="#!" class="footer_item_link">Legal</a>
              </div>
            </div>
            <div class="footer_item">
              <p class="footer_item_title">Resources</p>
              <div class="footer_item_list">
                <a href="#!" class="footer_item_link">White Paper</a>
                <a :href="NEWS_HOST" target="_blank" class="footer_item_link">News</a>
                <a :href="DOCS_HOST" target="_blank" class="footer_item_link">Docs</a>
              </div>
            </div>
            <div class="footer_item">
              <p class="footer_item_title">Contact Us</p>
              <div class="footer_item_list">
                <router-link :to="{name: 'ContactUs'}" class="footer_item_link">Give Feedback</router-link>
                <router-link :to="{name: 'ContactUs'}" class="footer_item_link">Support</router-link>
              </div>
            </div>
          </div>
          <div class="footer_social">
            <a :href="SOCIAL_TWITTER" target="_blank" class="footer_social_link footer_social_link_x"><span>(X)</span> Twitter</a>
            <a :href="SOCIAL_DISCORD" target="_blank" class="footer_social_link footer_social_link_dis">Discord</a>
            <div class="footer_social_telegram" @click="TgMenuToggler = !TgMenuToggler">
              <div class="footer_social_telegram_p">Telegram</div>
              <div class="footer_social_hidden" :class="{'open': TgMenuToggler}">
                <a :href="SOCIAL_TELEGRAM_CHANNEL" target="_blank" class="footer_social_hidden_link">Telegram Channel</a>
                <a :href="SOCIAL_TELEGRAM" target="_blank" class="footer_social_hidden_link">Telegram Group</a>
              </div>
            </div>
            <a :href="SOCIAL_LINKTREE" target="_blank" class="footer_social_link footer_social_link_lin">Linktree</a>
          </div>
        </div>
        <div class="footer_bottom">
          <p class="footer_copyright">&copy;&nbsp;{{ currentYear }}&nbsp;HAZB. All Rights Reserved.</p>
          <div class="footer_bottom_links">
            <a href="#!" class="footer_bottom_link">Terms of Service</a>
            <a href="#!" class="footer_bottom_link">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useDisplay } from "vuetify";
import gsap from 'gsap'
import ScrollTrigger from "gsap/ScrollTrigger";
import { useUserStore } from "@/store/userStore";
import { DOCS_HOST, NEWS_HOST, SOCIAL_DISCORD, SOCIAL_LINKTREE, SOCIAL_TELEGRAM, SOCIAL_TELEGRAM_CHANNEL, SOCIAL_TWITTER } from "@/helpers/mixins";

import '@/assets/styles/landing.scss'

const userStore = useUserStore()
useHead({
  title: 'HAZB - Embrace the future of crypto intelligence today!',
  titleTemplate: '%s', // remove trailing | HAZB
  // script: [
    // { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', tagPosition: 'bodyClose' },
    // { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', tagPosition: 'bodyClose' },
    // { src: '/assets/landing/js/script.js', tagPosition: 'bodyClose' },
  // ],
  // bodyAttrs: [{id: 'landingPage'}]
})

const breakpoints = ref(useDisplay())

const TgMenuToggler = ref(false)
const currentYear = computed(() => new Date().getFullYear())

const canvasImageRef = ref(null)
let context = null
const images = [];
const imageSeq = {
  frame: 0,
};

onMounted(() => {
  context = canvasImageRef.value.getContext('2d');
  initAnimationSequence()
  window.addEventListener('resize', onResize);
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
})

function initAnimationSequence() {
  canvasImageRef.value.width = window.innerWidth;
  canvasImageRef.value.height = window.innerHeight;

  function files(index) {
    const data = `assets/landing/images/device/1.webp;assets/landing/images/device/2.webp;assets/landing/images/device/3.webp;assets/landing/images/device/4.webp;assets/landing/images/device/5.webp;assets/landing/images/device/6.webp;assets/landing/images/device/7.webp;assets/landing/images/device/8.webp;assets/landing/images/device/9.webp;assets/landing/images/device/10.webp;assets/landing/images/device/11.webp;assets/landing/images/device/12.webp;assets/landing/images/device/13.webp;assets/landing/images/device/14.webp;assets/landing/images/device/15.webp;assets/landing/images/device/16.webp;assets/landing/images/device/17.webp;assets/landing/images/device/18.webp;assets/landing/images/device/19.webp;assets/landing/images/device/20.webp;assets/landing/images/device/21.webp;assets/landing/images/device/23.webp;assets/landing/images/device/24.webp;assets/landing/images/device/25.webp;assets/landing/images/device/26.webp;assets/landing/images/device/27.webp;assets/landing/images/device/28.webp;assets/landing/images/device/29.webp;assets/landing/images/device/30.webp;assets/landing/images/device/31.webp;assets/landing/images/device/32.webp;assets/landing/images/device/33.webp;assets/landing/images/device/34.webp;assets/landing/images/device/35.webp;assets/landing/images/device/36.webp;assets/landing/images/device/37.webp;assets/landing/images/device/38.webp;assets/landing/images/device/39.webp;assets/landing/images/device/40.webp`;
    return data.split(';')[index];
  }

  const frameCount = 38;

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = files(i);
    images.push(img);
  }
  gsap.registerPlugin(ScrollTrigger)
  gsap.to(imageSeq, {
    frame: frameCount - 1,
    snap: 'frame',
    ease: 'none',
    scrollTrigger: {
      trigger: ".trigger_anim",
      scrub: 1.8,
      pin: true,
      end: "top bottom",
      start: "top 10%",
    },
    onUpdate: render,
  });

  images[1].onload = render;
}

function render() {
  if(!canvasImageRef.value) return
  context.canvas.width = images[0].width;
  context.canvas.height = images[0].height;

  context.clearRect(0, 0, canvasImageRef.value.width, canvasImageRef.value.height);
  context.drawImage(images[imageSeq.frame], 0, 0);
}

function onResize() {
  canvasImageRef.value.width = window.innerWidth;
  canvasImageRef.value.height = window.innerHeight;
  render();
}

</script>
