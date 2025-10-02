<script setup>
import MainLayout from "@/components/Layout/MainLayout.vue";
</script>

<template>
  <main id="main">
    <div style="position: absolute; width: 100%; margin-top: 15px">
      <div class="container"></div>
    </div>
    <div class="banner banner_blog">
      <div class="container">
        <div class="banner__header">
          <h1 class="banner__title">Как это работает?</h1>
        </div>
      </div>
    </div>
    <section class="container docs-text">
      <p class="docs-p">
        1. Первым шагом, перейдите на Bitratex и выберите монету, которую
        Вы хотите обменять (поле «Вы отправляете») слева, и монету, которую
        хотите приобрести (поле «Вы получаете»), справа и нажмите кнопку «Начать
        обмен».
      </p>
      <p class="docs-p">
        2. В следующем шаге введите адрес назначения. На этой же странице,
        слева, Вы увидите присвоенный уникальный идентификатор (ID) для данной
        транзакции. Идентификатор необходим при обращении в службу технической
        поддержки при возникновении проблем с транзакцией. Внимательно
        прочитайте документы “Условия использования” и “Политика
        конфиденциальности”. Если Вы согласны с положениями данных документов,
        поставьте соответствующую галочку, перепроверьте все введенные данные.
        Если все выглядит корректно, перейдите к следующему шагу, нажав «Начать
        транзакцию».
      </p>
      <p class="docs-p">
        3. Теперь Ваша транзакция была инициирована. На данной странице Вы
        увидите адрес кошелька. Это адрес, на который нужно отправить монету,
        которую Вы хотите обменять. Предоставленный адрес будет зарезервирован
        за данной транзакцией и сервис Bitratex будет ждать отправки средств
        на данный адрес в течение 12 часов. Вам необходимо отправить средства до
        истечения данного времени. По истечении 12 часов адрес снимается с
        резерва и полученные средства обмениваться не будут, а будут
        возвращаться на адрес, с которого были получены средства. Также по
        истечении 12 часов с момента резервирования, данный адрес может быть
        предоставлен другим пользователям для совершения обмена. Ни в коем
        случае не отправляйте повторно свои средства на адрес, полученный в
        рамках одной заявки.
      </p>
      <p class="docs-p">
        4. Как только мы получим монеты, наш сервис автоматически обменяет Ваши
        средства на криптовалютной бирже и мгновенно отправит их по адресу
        назначения, указанному на шаге 2. В связи с тем, что все обмены
        совершаются на криптовалютной бирже по книге ордеров, наш сервис не
        фиксирует курс обмена. В калькуляторе сервиса показан ожидаемый курс.
      </p>
      <p class="docs-p">
        Обратите внимание, что заявки обрабатываются автоматически и только на
        сайте нашего сервиса.
      </p>
      <p class="docs-p">
        5. Если в обменном направлении присутствует плавающий курс, он
        пересчитывается лишь в случае понижения цены криптовалюты.
      </p>
      <p class="docs-p">
        5.1. Перерасчет наступает при изменении котировок биржи в сторону
        снижения на 0,2% до момента окончательного завершения ордера на бирже.
      </p>
      <p class="docs-p">
        6. Среднее время обмена может составлять от 20 до 120 минут в
        зависимости от выбранной пары и нагрузки сети.
      </p>
      <p class="docs-p">
        7. Если Вы хотите совершить повторный обмен тех же монет, либо других,
        необходимо создать новый обмен.
      </p>
    </section>
    <div class="clear-md"></div>
  </main>
</template>

<style scoped>


.banner__title {
  font-family: "Manrope-Bold";
  font-style: normal;
  font-weight: 800;
  font-size: 55px;
  line-height: 110%;
  letter-spacing: -0.01em;
  color: #ffffff;
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
  background: #2cb48e;
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
