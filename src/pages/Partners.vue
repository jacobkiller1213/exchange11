<template>
  <main id="main">
    <div style="position: absolute; width: 100%; margin-top: 15px">
      <div class="container"></div>
    </div>
    <div class="banner partners_blog">
      <div class="container">
        <div class="banner__header">
          <h1 class="partner__title">
            Реферальная программа <span> NeonChain</span>
          </h1>
          <h3>
            Добро пожаловать в нашу партнерскую программу. Выберите подходящий
            вам вариант партнерства и начните зарабатывать вместе с нами!
          </h3>
        </div>
      </div>
    </div>


    <section class="container docs-text page-block">
      <div class="partner-block display-flex">
        <div class="partner-image"></div>
        <div class="partner-promo">
          Реферальные ссылки
          <p class="docs-p">
            Поделитесь ссылкой на нашу услугу со своей аудиторией и получайте
            прибыль в USDT с каждым обменом привлеченных пользователей
          </p>
          <div class="items">
            <div class="item display-flex">
              <img
                class="lazy entered loaded"
                data-ll-status="loaded"
                src="/testcom/images/check-icon.svg"
              />
              Простая и быстрая интеграция
            </div>
            <div class="item display-flex">
              <img
                class="lazy entered loaded"
                data-ll-status="loaded"
                src="/testcom/images/check-icon.svg"
              />
              Широкий выбор ссылок для привлечения вашей аудитории
            </div>
            <div class="item display-flex">
              <img
                class="lazy entered loaded"
                data-ll-status="loaded"
                src="/testcom/images/check-icon.svg"
              />
              Получайте существенную прибыль выполнив простые действия
            </div>
          </div>
          <div class="display-flex">
            <a href="#partner-link" class="partner-button"> Стать партнером </a>
            <a href="#how-it-work" class="partner-button black">
              Как это устроено?
            </a>
          </div>
        </div>
      </div>
    </section>
    <section id="how-it-work" class="container docs-text page-block">
      <h3 class="promo__title underline">Как это работает?</h3>
      <div class="how-it-works-list">
        <div class="how-it-works-elem">
          <div class="how-it-works-title">
            <div>Зарегистрируйтесь</div>
            <img class="lazy" src="/testcom/images/main-page/01.svg" />
          </div>
          <div class="how-it-works-text">
            Зарегистрируйтесь и получите доступ к дашборду
          </div>
        </div>
        <div class="how-it-works-elem">
          <div class="how-it-works-title">
            <div>Получите реферальную ссылку</div>
            <img class="lazy" src="/testcom/images/main-page/02.svg" />
          </div>
          <div class="how-it-works-text">
            В вашем личном кабинете вы найдете ссылку, которую сможете
            использовать на своем веб-сайте / блоге / в социальных сетях.
          </div>
        </div>
        <div class="how-it-works-elem">
          <div class="how-it-works-title">
            <div>Приводите пользователей и получайте выплаты</div>
            <img class="lazy" src="/testcom/images/main-page/03.svg" />
          </div>
          <div class="how-it-works-text">
            Пригласите новых пользователей к обмену с NeonChain и получайте от
            40% до 60% от нашей комиссии(в зависимости от объема обменов)
          </div>
        </div>
      </div>
    </section>
    <section class="container docs-text page-block">
      <h3 class="promo__title underline">Почему мы?</h3>
      <div class="why_we">
        <div class="item display-flex">
          <img class="lazy" src="/testcom/images/check-icon.svg" />
          Несколько видов интеграций
        </div>
        <div class="item display-flex">
          <img class="lazy" src="/testcom/images/check-icon.svg" />
          Заработок в USDT
        </div>
        <div class="item display-flex">
          <img class="lazy" src="/testcom/images/check-icon.svg" />
          Персональная поддержка
        </div>
        <div class="item display-flex">
          <img class="lazy" src="/testcom/images/check-icon.svg" /> Удобный
          дашборд
        </div>
        <div class="item display-flex">
          <img class="lazy" src="/testcom/images/check-icon.svg" /> Полная
          поддержка интеграции
        </div>
      </div>
    </section>
    <section id="partner-link" class="container docs-text page-block">
      <h3 class="api-title">Свяжитесь с нами, чтобы стать партнером</h3>
      <div class="api-link display-flex">

        <a href="https://t.me/ NeonChain_io">
          <img class="lazy" src="/testcom/images/api/tg.png" />
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
