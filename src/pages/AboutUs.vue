<script setup>
import MainLayout from "@/components/Layout/MainLayout.vue";
</script>

<template>
    <div class="banner banner_blog">
      <div class="container">
        <div class="banner__header">
          <h1 class="banner__title">Что такое Bitratex?</h1>
        </div>
      </div>
    </div>

    <section class="container docs-text">
      <p class="docs-p"><strong>Bitratex</strong> — это постоянно развивающаяся платформа для обмена криптовалюты.</p>

      <h4 class="docs-p docs-h"><strong>Наша миссия</strong></h4>
      <p class="docs-p">Наша миссия — дать возможность миллионам пользователей по всему миру свободно, анонимно и, самое главное, безопасно обменивать свои криптоактивы в любом объеме. Платформа полностью автоматическая, где в пару кликов можно обменять 400 направлений по максимально выгодному курсу.</p>

      <h4 class="docs-p docs-h"><strong>Наши преимущества</strong></h4>
      <p class="docs-p">За несколько лет работы мы определили для себя основные моменты, которые определяют качественный сервис криптовалютного обменника.</p>

      <ul>
        <li class="docs-p"><strong>Безопасность.</strong> Мы уделяем большое внимание безопасности нашей платформы и оперативно реагируем на все возможные проблемы. Также мы проводим AML проверки всех поступающих средств, что гарантирует, что ваши средства не будут заблокированы биржей. Средства от нас поступают от проверенных провайдеров ликвидности, поэтому мы можем гарантировать их чистоту на все 100%.</li>
        <li class="docs-p"><strong>Техническая поддержка.</strong> Наша техническая поддержка готова помочь вам. При этом время ответа оператора технической поддержки при штатной нагрузи на сервис составляет всего 5 минут.</li>
        <li class="docs-p"><strong>Количество криптовалютных пар.</strong> Сегодня существует огромное количество всевозможных направлений, которые популярны у пользователей. На нашей платформе добавлено 400 криптовалютных пар, чтобы вы могли найти то, что вам нужно и обменять по лучшему курсу.</li>
        <li class="docs-p"><strong>Курс.</strong> Самым важным элементом является курс, который предоставляет обменный сервис. У нас вы можете найти лучшие курсы по всем криптовалютным.</li>
        <li class="docs-p"><strong>Продуманный сайт.</strong> Наша команда провела огромную работу над нашем сайтом, чтобы вы получили еще больше удовольствия от процесса обмена на нашей платформе. Каждый шаг обмена был доработан таким образом, чтобы клиенты тратили меньше времени на заполнение заявки.</li>
        <li class="docs-p"><strong>Анонимность.</strong> У нас регистрация необязательна и вы можете производить обмены абсолютно анонимно.</li>
        <li class="docs-p"><strong>Комиссия.</strong> Наша комиссия составляет всего 0.3% за обмен вне зависимости от объема, который вы решите поменять.</li>
      </ul>


      <a href="/" class="docs-button">Сделать обмен</a>
    </section>

    <div class="clear-md"></div>
</template>

<style scoped>
.banner_blog {
  background: linear-gradient(90deg, #17171E 50%, #2CB48E 110%);
  padding: 80px 0;
}

.banner__title {
  font-family: 'Manrope-Bold';
  font-style: normal;
  font-weight: 800;
  font-size: 55px;
  line-height: 110%;
  letter-spacing: -0.01em;
  color: #FFFFFF;
}

.docs-text {
  padding: 40px 0;
}

.docs-p {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.6;
}

.docs-h {
  font-size: 24px;
  margin-top: 30px;
}

.docs-button {
  display: inline-block;
  background: #2CB48E;
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 30px;
  font-weight: bold;
}

.docs-button:hover {
  background: #25a080;
}

.currency__icons {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.currency__icons > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
}

.currency__icon {
  width: 50px;
  height: 50px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.currency__title {
  margin-top: 10px;
  font-size: 12px;
  text-align: center;
}

.clear-sm {
  height: 20px;
}

.clear-md {
  height: 40px;
}

@media screen and (max-width: 576px) {
  .banner__title {
    font-size: 36px;
  }

  .currency__icons > div {
    width: 80px;
  }
}
</style>