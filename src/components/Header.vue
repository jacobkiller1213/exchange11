<script setup>
import { ref, onMounted } from 'vue';

onMounted(() => {
  const hamburger = document.getElementById('js-hamburger');
  const menu = document.getElementById('js-menu');

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  }
});
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header__blocks">
        <div class="header__block">
          <div class="logo">
            <a class="logo__link" href="/" title=" NeonChain">
              <img
                class="logo__pic "
                src="/testcom/images/logo.svg"
                alt=" NeonChain"

              />


              NeonChain
            </a>
          </div>
        </div>
        <div class="header__block header__block_wide">
          <button class="hamburger" id="js-hamburger">
            <span class="hamburger__screen-reader-text">menu</span>
          </button>
          <div
            class="menu"
            id="js-menu"
            aria-expanded="false"
            role="navigation"
          >
            <nav>

              <div class="menu__logo">
                <a class="logo__link" href="/" title=" NeonChain">
                  <img
                    class="logo__pic"
                    src="/testcom/images/logo-mobile.svg"
                    alt=" NeonChain"
                  />
                  NeonChain
                </a>
              </div>
              <div class="menu__main__select">
                <ul class="menu__list">
                  <li class="menu__item">
                    <a href="/" class="menu__link">Обмен</a>
                  </li>
                  <li class="menu__item">
                    <a href="/docs/how-it-works" class="menu__link"
                      >Как это работает</a
                    >
                  </li>
                  <li class="menu__item">
                    <a href="/for-partners" class="menu__link">Партнерам</a>
                  </li>
                  <li class="menu__item">
                    <a href="/vip-clients" class="menu__link" id="vip-client"
                      >VIP клиентам</a
                    >
                  </li>



                </ul>
              </div>
            </nav>
          </div>

          <a href="/vip-clients" class="menu__link" id="vip-client-mobile"
            >VIP клиентам</a
          >
        </div>
      </div>
    </div>
  </header>
</template>

<style></style>
