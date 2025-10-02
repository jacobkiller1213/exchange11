<script setup>
import MainLayout from "@/components/Layout/MainLayout.vue";
</script>

<template>
  <MainLayout>
    <div class="clear-lg"></div>
    <div class="head-block">
      <div class="container">
        <h1 class="head-title">Блог</h1>
        <div class="head-menu">
          <a href="/blog" class="active">Последние</a>
          <a href="/blog?section=manual" class="">Руководства</a>
          <a href="/blog?section=news" class="">Новости</a>
          <a href="/blog?section=currency" class="">О криптовалютах</a>
          <a href="/popular-exchanges" class="">Валютные пары</a>
        </div>
      </div>
    </div>

    <div class="container">
      <h1 class="blog-label">Руководства</h1>
      <div class="blog-main">
        <a href="/blog/bitcoins_comeback">
          <div class="popular-exchange">
            <div class="pair-image" style="background-image: url('/uploads/images/post/1707129826213110704.jpg')">
              <div class="currency-icons"></div>
            </div>
            <div class="pair-desc">
              <h4>Что стоит за впечатляющим возвращением Биткоина?</h4>
              <p></p>
              <time class="blog__time" datetime="2024-01-12">12 Янв, 2024</time>
            </div>
          </div>
        </a>
        <a href="/blog/short_summary_shib_avax_plx">
          <div class="popular-exchange">
            <div class="pair-image" style="background-image: url('/uploads/images/post/1707130135758991092.jpg')">
              <div class="currency-icons"></div>
            </div>
            <div class="pair-desc">
              <h4>Небольшая сводка по SHIB, AVAX, PLX</h4>
              <p></p>
              <time class="blog__time" datetime="2023-12-19">19 Дек, 2023</time>
            </div>
          </div>
        </a>
        <a href="/blog/tethers_bold_move">
          <div class="popular-exchange">
            <div class="pair-image" style="background-image: url('/uploads/images/post/1717188282202642147.jpg')">
              <div class="currency-icons"></div>
            </div>
            <div class="pair-desc">
              <h4>Смелый шаг Tether: инвестиции в размере 500 миллионов долларов для доминирования на рынке майнинга биткоинов</h4>
              <p></p>
              <time class="blog__time" datetime="2023-11-16">16 Ноя, 2023</time>
            </div>
          </div>
        </a>
      </div>
      <a href="/blog?section=manual" class="blog-button">Посмотреть все<span></span></a>

      <div class="clear-blog"></div>
      <h1 class="blog-label">Новости</h1>
      <div class="blog-main">
        <a href="/blog/partnership_cryptocloud">
          <div class="popular-exchange">
            <div class="pair-image" style="background-image: url('/uploads/images/post/1709646626309569085.jpg')">
              <div class="currency-icons"></div>
            </div>
            <div class="pair-desc">
              <h4>Партнерство с Cryptocloud</h4>
              <p></p>
              <time class="blog__time" datetime="2024-03-05">05 Март, 2024</time>
            </div>
          </div>
        </a>
        <a href="/blog/btc_turns_bearish">
          <div class="popular-exchange">
            <div class="pair-image" style="background-image: url('/uploads/images/post/1708007021971849304.jpg')">
              <div class="currency-icons"></div>
            </div>
            <div class="pair-desc">
              <h4>Биткоин становится медвежьим после отчета по индексу потребительских цен в США</h4>
              <p></p>
              <time class="blog__time" datetime="2024-02-15">15 Фев, 2024</time>
            </div>
          </div>
        </a>
      </div>
      <a href="/blog?section=news" class="blog-button">Посмотреть все<span></span></a>

      <div class="clear-blog"></div>
      <h1 class="blog-label">О криптовалютах</h1>
      <div class="blog-main"></div>
      <a href="/blog?section=currency" class="blog-button">Посмотреть все<span></span></a>

      <div class="clear-blog"></div>
      <h1 class="blog-label">Валютные пары</h1>
      <div class="blog-main">
        <a href="/exchange-btc-usdt">
          <div class="popular-exchange">
            <div class="pair-image" style="background-image: url('/testcom/images/pair_bg.png')">
              <div class="currency-icons">
                <span class="currency-icon icon_full_BTC"></span>
                <div class="arrow"></div>
                <span class="currency-icon icon_full_USDT"></span>
                <div class="currency-name">BTC</div>
                <div></div>
                <div class="currency-name">USDT</div>
              </div>
            </div>
            <div class="pair-desc">
              <h4>Обмен BTC на USDT</h4>
              <p>Обменяйте BTC на USDT мгновенно, без регистрации и скрытых комиссий. Полная автоматизация, максимальная скорость и лучшие обменные курсы.</p>
            </div>
          </div>
        </a>
        <a href="/exchange-eth-usdt">
          <div class="popular-exchange">
            <div class="pair-image" style="background-image: url('/testcom/images/pair_bg.png')">
              <div class="currency-icons">
                <span class="currency-icon icon_full_ETH"></span>
                <div class="arrow"></div>
                <span class="currency-icon icon_full_USDT"></span>
                <div class="currency-name">ETH</div>
                <div></div>
                <div class="currency-name">USDT</div>
              </div>
            </div>
            <div class="pair-desc">
              <h4>Обмен ETH на USDT</h4>
              <p>Обменяйте ETH на USDT мгновенно, без регистрации и скрытых комиссий. Полная автоматизация, максимальная скорость и лучшие обменные курсы.</p>
            </div>
          </div>
        </a>
      </div>
      <a href="/popular-exchanges" class="blog-button">Посмотреть все<span></span></a>
    </div>

    <div class="clear-lg"></div>
  </MainLayout>
</template>

<style scoped>
#main {
  background: linear-gradient(90deg, #17171E 50%, #2CB48E 110%);
}

a:focus, a:hover {
  color: #2CB48E !important;
}

.head-block {
  padding-top: 20px;
  padding-bottom: 130px;
}

.head-title {
  font-family: 'Manrope-Bold';
  font-style: normal;
  font-weight: 800;
  font-size: 55px;
  line-height: 110%;
  letter-spacing: -0.01em;
  color: #FFFFFF;
  padding-bottom: 80px;
}

.head-menu {
  display: flex;
  column-gap: 50px;
  font-family: 'Manrope-Regular';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  align-items: center;
  color: #FFFFFF;
}

.head-menu .active {
  color: #2CB48E;
  pointer-events: none;
}

.blog-label {
  font-size: 32px;
  color: #fff;
  margin-bottom: 30px;
}

.blog-main {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.popular-exchange {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.popular-exchange:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.pair-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.currency-icons {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
}

.currency-icon {
  width: 30px;
  height: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.arrow {
  width: 20px;
  height: 20px;
  background-image: url('/testcom/images/arrow-white.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 10px;
}

.currency-name {
  font-size: 12px;
  color: white;
  margin-top: 5px;
}

.pair-desc {
  padding: 20px;
}

.pair-desc h4 {
  font-size: 18px;
  color: white;
  margin-bottom: 10px;
}

.pair-desc p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.blog__time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  display: block;
  margin-top: 10px;
}

.blog-button {
  display: inline-block;
  padding: 12px 30px;
  background: #2CB48E;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 40px;
  transition: all 0.3s ease;
}

.blog-button:hover {
  background: #25a080;
}

.blog-button span {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-image: url('/testcom/images/arrow-white.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-left: 10px;
}

.clear-blog {
  height: 40px;
}

.clear-lg {
  height: 60px;
}

@media screen and (max-width: 1200px) {
  .head-block {
    padding-top: 0;
    padding-bottom: 60px;
  }

  .head-title {
    padding-bottom: 50px;
  }
}

@media screen and (max-width: 991px) {
  .head-menu {
    flex-wrap: wrap;
    row-gap: 10px;
  }
}

@media screen and (max-width: 576px) {
  #main {
    background: linear-gradient(180deg, #17171E 50%, #2CB48E 110%);
  }

  .clear-lg {
    height: 90px !important;
  }

  .head-title {
    font-size: 36px;
    padding-bottom: 30px;
  }

  .blog-main {
    grid-template-columns: 1fr;
  }
}
</style>