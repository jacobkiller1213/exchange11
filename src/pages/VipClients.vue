<script setup>
import MainLayout from "@/components/Layout/MainLayout.vue";
import { onMounted } from "vue";

onMounted(() => {
  // Инициализация слайдера для калькулятора VIP клиентов
  const slider = document.getElementById("exValue");
  const output = document.getElementById("volume");
  if (slider && output) {
    output.innerHTML = slider.value;

    const output3 = document.getElementById("myGet");
    if (output3) {
      let num = updateValue(slider.value);
      num = "~ " + num.toFixed(4);
      output3.innerHTML = num;

      slider.oninput = function () {
        output.innerHTML = this.value;
        let num = updateValue(slider.value);
        num = "~ " + num.toFixed(4);
        output3.innerHTML = num;
      };
    }
  }
});

function updateValue(value) {
  let p = 0;
  switch (true) {
    case value >= 300:
      p = 0.2;
      break;
    case value >= 200:
      p = 0.175;
      break;
    case value >= 100:
      p = 0.15;
      break;
    case value >= 60:
      p = 0.125;
      break;
    case value >= 30:
      p = 0.1;
      break;
    case value >= 5:
      p = 0.075;
      break;
    case value >= 2:
      p = 0.05;
      break;
  }
  return value * (p / 100);
}
</script>

<template>
  <main id="main">
    <div style="position: absolute; width: 100%; margin-top: 15px">
      <div class="container"></div>
    </div>
    <div class="banner partners_blog">
      <div class="container">
        <div class="banner__header">
          <h1 class="partner__title">VIP клиентам <span>Bitratex</span></h1>
          <h3>
            Если вы меняете крупные суммы, мы готовы предложить вам особые
            условия.
          </h3>
        </div>
      </div>
    </div>
    <div class="head-block">
      <div class="container">
        <div class="head-menu">
          <a
            href="/coincraddle-api"
            class="menu-link"
          >
            API Bitratex
          </a>
          <a href="/for-partners" class="menu-link">
            Партнерская программа
          </a>
          <a
            href="/vip-clients"
            class="menu-link active"
          >
            VIP клиентам
          </a>
        </div>
      </div>
    </div>

    <section class="container docs-text page-block">
      <div class="partner-block display-flex">
        <div class="vip-clients-image"></div>
        <div class="vip-clients-promo">
          Меняйте крупные суммы быстро, безопасно и выгодно.
          <p class="docs-p">
            Для получения особых условий зарегистрируйтесь и свяжитесь с нами.
          </p>
          <div class="display-flex">
            <a href="#partner-link" class="partner-button">
              Стать VIP клиентом
            </a>
          </div>
        </div>
      </div>
    </section>
    <section class="container docs-text page-block">
      <h3 class="promo__title underline">Что мы предлагаем?</h3>
      <div class="what_offer">
        <div class="items">
          <div class="item">
            <img
              class="lazy entered exited"
              src="/testcom/images/vip_1.png"
            />
            <div>Персональная поддержка</div>
          </div>
          <div class="item">
            <img
              class="lazy entered exited"
              src="/testcom/images/vip_2.png"
            />
            <div>Кешбэк от объема</div>
          </div>
          <div class="item item3">
            <img
              class="lazy entered exited"
              src="/testcom/images/vip_3.png"
            />
            <div>Удобный дашборд</div>
          </div>
          <div class="item item4">
            <img
              class="lazy entered exited"
              src="/testcom/images/vip_4.png"
            />
            <div>Приоритет крупных заявок</div>
          </div>
        </div>
      </div>
    </section>
    <section class="docs-text page-block calculator-block vip-block">
      <div class="container">
        <h3 class="promo__title underline">
          Чем больше объем сделок -<br />тем выше ваша прибыль!
        </h3>
        <div class="vip-calculator-main">
          <div class="calculator">
            <p>Объем сделок</p>
            <span id="volume">616</span> BTC
            <input
              type="range"
              min="0"
              max="1000"
              value="10"
              step="1"
              id="exValue"
            />
          </div>
          <div class="calculator-promo">
            <p>Ваш кешбэк</p>
            <span id="myGet">~ 1.2320</span> BTC
            <a href="#partner-link">Попробовать сейчас</a>
          </div>
        </div>
      </div>
    </section>
    <section id="partner-link" class="container docs-text page-block">
      <h3 class="api-title">Свяжитесь с нами, чтобы стать VIP клиентом</h3>
      <div class="api-link display-flex">

        <a
          href="https://t.me/bitratex_support"
        >
          <img
            class="lazy entered loaded"
            data-src="/testcom/images/tg.png"
            data-ll-status="loaded"
            src="/testcom/images/tg.png"
          />
        </a>
      </div>
    </section>
  </main>
</template>

<style scoped>
.menu-link:focus,
.menu-link:hover {
  color: #2cb48e !important;
}
.head-block {
  padding-top: 20px;
}
.head-menu {
  display: flex;
  column-gap: 100px;
  font-family: "Manrope-Regular";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  align-items: center;
  color: #ffffff;
}
.head-menu .active {
  color: #2cb48e;
  pointer-events: none;
}
@media screen and (max-width: 1200px) {
  .head-block {
    padding-top: 0;
  }
}
@media screen and (max-width: 991px) {
  .head-menu {
    flex-wrap: wrap;
    column-gap: 50px;
    row-gap: 10px;
  }
}
@media screen and (max-width: 576px) {
  .head-menu {
    padding-top: 30px;
    column-gap: 30px;
  }
}
</style>
