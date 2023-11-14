<template>
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
          <div id="intro_video" class="intro_video"></div>
          <div class="intro">
            <div class="intro_text">
              <h1 class="intro_text_title">Elevate Your Investment Game with Advanced AI Analytics</h1>
              <a href="/" class="link intro_text_link">Get Started</a>
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
          <!-- <canvas class="about_bcg_image"></canvas> -->
          <canvas class="about_bcg_image"></canvas>
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
          <a href="/" class="link trial_link">Start your Trial</a>
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
              <a href="/" class="footer_item_link">About Us</a>
              <a href="/" class="footer_item_link">Careers</a>
              <a href="/" class="footer_item_link">Legal</a>
            </div>
          </div>
          <div class="footer_item">
            <p class="footer_item_title">Resources</p>
            <div class="footer_item_list">
              <a href="/" class="footer_item_link">White Paper</a>
              <a href="/" class="footer_item_link">News</a>
              <a href="/" class="footer_item_link">Docs</a>
            </div>
          </div>
          <div class="footer_item">
            <p class="footer_item_title">Contact Us</p>
            <div class="footer_item_list">
              <a href="/" class="footer_item_link">Give Feedback</a>
              <a href="/" class="footer_item_link">Support</a>
            </div>
          </div>
        </div>
        <div class="footer_social">
          <a href="/" class="footer_social_link footer_social_link_x"><span>(X)</span> Twitter</a>
          <a href="/" class="footer_social_link footer_social_link_dis">Discord</a>
          <div class="footer_social_telegram">
            <div class="footer_social_telegram_p">Telegram</div>
            <div class="footer_social_hidden">
              <a href="/" class="footer_social_hidden_link">Telegram Channel</a>
              <a href="/" class="footer_social_hidden_link">Telegram Group</a>
            </div>
          </div>
          <a href="/" class="footer_social_link footer_social_link_lin">Linktree</a>
        </div>
      </div>
      <div class="footer_bottom">
        <p class="footer_copyright">&copy;&nbsp;{{ currentYear }}&nbsp;HAZB. All Rights Reserved.</p>
        <div class="footer_bottom_links">
          <a href="/" class="footer_bottom_link">Terms of Service</a>
          <a href="/" class="footer_bottom_link">Privacy Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>
<!-- :to="{name: userStore.logged ? 'Console' : 'AuthSignIn'}" -->

<script setup>
import { useHead } from '@unhead/vue'
import { useUserStore } from "@/store/userStore";
import { computed } from "vue";
import '@/assets/styles/landing.scss'

const userStore = useUserStore()
useHead({
  title: 'HAZB - Embrace the future of crypto intelligence today!',
  titleTemplate: '%s', // remove trailing | HAZB
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', tagPosition: 'bodyClose' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', tagPosition: 'bodyClose' },
    { src: '/assets/landing/js/script.js', tagPosition: 'bodyClose' },
  ],
  bodyAttrs: [{id: 'landingPage'}]
})
const currentYear = computed(() => new Date().getFullYear())

</script>
