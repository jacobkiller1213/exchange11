<script setup>
import { ref, watch, onMounted, computed } from "vue";
import CurrencySelect from "@/components/CurrencySelect.vue";
import CustomSelect from "@/components/CustomSelect.vue";
import { useExchangeStore } from "@/store/ExchangeStore";
import MainLayout from "@/components/Layout/MainLayout.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const isCalculating = ref(false);
const validationError = ref("");
const debounceTimeout = ref(null);

// Computed для получения минимальной суммы текущей валюты
const currentMinAmount = computed(() => {
  if (!currencyFrom.value) return 0;
  return getMinAmountForCurrency(currencyFrom.value);
});

const {
  currencyFrom = 1,
  currencyTo = 2,
  amountFrom,
  amountTo,
  exchangeRate,
  minAmounts,
  loading,
  currencyOptions,
  cryptoCurrencies,
  fiatCurrencies,
  getRates,
  calculateExchange,
  calculateExchangeReverse,
  swapCurrencies,
  getMinAmounts,
} = useExchangeStore();

// Функция для получения минимальной суммы для валюты
function getMinAmountForCurrency(currencyKey) {
  const currency = cryptoCurrencies.value.find(c => c.key === currencyKey);
  console.log(minAmounts.value);
  console.log("currency", currency);
  if (!currency || !minAmounts.value) return 0;
  if (currency.currency_from === "BNBBEP20") {
    return minAmounts.value["BNB BEP20"] || 0;
  }
  if(currency.currency_from === "USDTERC20") {
    console.log("USDT ERC20", minAmounts.value["USDT ERC20"]);
    return minAmounts.value["USDT TRC20"] || 0;
  }
  if(currency.currency_from === "USDTBEP20") {
    return minAmounts.value["USDT BEP20"] || 0;
  }
  if(currency.currency_from === "USDTTRC20") {
    return minAmounts.value["USDT TRC20"] || 0;
  }
  if(currency.currency_from === "USDTBEP20") {
    return minAmounts.value["USDT BEP20"] || 0;
  }
    console.log(currency.currency_from + (" " + (currency.network || '')));
  return minAmounts.value[currency.currency_from] || 0;
}

// Функция валидации минимальной суммы
function validateMinAmount(amount, currencyKey) {
  const minAmount = getMinAmountForCurrency(currencyKey);
  console.log(minAmount);
  if (amount < minAmount) {
    const currency = cryptoCurrencies.value.find(c => c.key === currencyKey);
    const currencyName = currency ? currency.currency_from : '';
    validationError.value = `Минимальная сумма для ${currencyName}: ${minAmount}`;
    return false;
  }
  validationError.value = "";
  return true;
}

// Функция для проверки валидации без вычислений
function checkValidation() {
  if (amountFrom.value && currencyFrom.value) {
    validateMinAmount(parseFloat(amountFrom.value), currencyFrom.value);
  } else {
    validationError.value = "";
  }
}

// Debounced функции для вычислений
function debouncedCalculateExchange() {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  debounceTimeout.value = setTimeout(() => {
    handleCalculateExchange();
  }, 300);
}

function debouncedCalculateExchangeReverse() {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  debounceTimeout.value = setTimeout(() => {
    handleCalculateExchangeReverse();
  }, 300);
}

// Обертки для функций вычисления с флагом
async function handleCalculateExchange() {
  if (isCalculating.value) return;

  // Сначала проверяем валидацию
  checkValidation();

  // Если есть ошибка валидации, не продолжаем
  if (validationError.value) {
    return;
  }

  isCalculating.value = true;
  await calculateExchange();
  isCalculating.value = false;
}

async function handleCalculateExchangeReverse() {
  if (isCalculating.value) return;
  isCalculating.value = true;
  await calculateExchangeReverse();
  isCalculating.value = false;
}

function exchange() {
  if (
    amountFrom.value &&
    amountTo.value &&
    currencyFrom.value &&
    currencyTo.value
  ) {
    router.push(
      `/exchange?amountFrom=${amountFrom.value}&amountTo=${amountTo.value}&currencyFrom=${currencyFrom.value}&currencyTo=${currencyTo.value}`
    );
  }
}

function toggleFaqItem(event) {
  const faqItem = event.currentTarget.closest('.faq-item');
  const description = faqItem.querySelector('.faq-item-desc');
  const iconClosed = faqItem.querySelector('.icon-closed');
  const iconOpened = faqItem.querySelector('.icon-opened');

  if (description.classList.contains('active')) {
    // Закрываем элемент
    description.style.maxHeight = '0';
    description.classList.remove('active');
    iconClosed.style.display = 'inline-block';
    iconOpened.style.display = 'none';

    // Добавляем небольшую задержку перед скрытием, чтобы анимация успела завершиться
    setTimeout(() => {
      if (!description.classList.contains('active')) {
        description.style.display = 'none';
      }
    }, 300);
  } else {
    // Открываем элемент
    description.style.display = 'block';

    // Небольшая задержка, чтобы display: block успел применится перед анимацией
    setTimeout(() => {
      // Устанавливаем временно большое значение, чтобы получить реальную высоту
      description.style.maxHeight = '1000px';

      // Получаем реальную высоту и добавляем небольшой запас
      const scrollHeight = description.scrollHeight + 20;

      // Устанавливаем точную высоту с запасом
      description.style.maxHeight = scrollHeight + 'px';
      description.classList.add('active');
      iconClosed.style.display = 'none';
      iconOpened.style.display = 'inline-block';
    }, 10);
  }
}

// Watch для валидации при изменении суммы или валюты
watch([amountFrom, currencyFrom], () => {
  checkValidation();
});

// Watch для прямого вычисления (от amountFrom к amountTo)
watch([currencyFrom, currencyTo, amountFrom], () => {
  if (currencyFrom.value && currencyTo.value && amountFrom.value && !isCalculating.value) {
    debouncedCalculateExchange();
  }
});

// Watch для обратного вычисления (от amountTo к amountFrom)
watch(amountTo, () => {
  if (currencyFrom.value && currencyTo.value && amountTo.value && !isCalculating.value) {
    debouncedCalculateExchangeReverse();
  }
});

onMounted(async () => {
  await getRates();
  await getMinAmounts();

  // Устанавливаем валюты по умолчанию (BTC -> ETH)
  const btcCurrency = cryptoCurrencies.value.find(c => c.code === 'BTC');
  const ethCurrency = cryptoCurrencies.value.find(c => c.code === 'ETH');

  if (btcCurrency) currencyFrom.value = btcCurrency.key;
  if (ethCurrency) currencyTo.value = ethCurrency.key;

  // Если BTC или ETH не найдены, используем первые доступные валюты
  if (!currencyFrom.value && cryptoCurrencies.value.length > 0) {
    currencyFrom.value = cryptoCurrencies.value[0].key;
  }
  if (!currencyTo.value && cryptoCurrencies.value.length > 1) {
    currencyTo.value = cryptoCurrencies.value[1].key;
  }

  // Добавляем обработчики событий для FAQ элементов
  const faqTitles = document.querySelectorAll('.faq-item-title');
  faqTitles.forEach(title => {
    title.addEventListener('click', toggleFaqItem);
  });

  // Инициализируем стили для FAQ элементов
  const faqDescs = document.querySelectorAll('.faq-item-desc');
  faqDescs.forEach(desc => {
    desc.style.maxHeight = '0';
    desc.style.overflow = 'hidden';
    desc.style.transition = 'max-height 0.3s ease';
  });
});
</script>

<template>
    <main id="main">
      <div style="position: absolute; width: 100%; margin-top: 15px">
        <div class="container"></div>
      </div>
      <div class="promo">
        <div class="container">
          <div class="promo-container">
            <div class="promo-main">
              <div class="promo-header">
                <h1 class="promo__title">Безлимитные Крипто Обмены</h1>
                <h3 class="promo__text">Лучший криптообменник 2025 года</h3>

              </div>
              <div class="flex-grow-1"></div>
              <div>
                <div class="hidden-md hidden-lg" style="margin-top: 30px"></div>
                <div class="exchange-fix exchange__form" autocomplete="off">
                  <div class="exchange-head">
                    <ul class="nav" role="tablist"></ul>
                  </div>
                  <div class="exchange-body crypto">
                    <h1 style="text-align: left">Обмен криптовалют</h1>
                    <div v-if="loading" class="loading-indicator">
                      Загрузка курсов...
                    </div>

                    <!-- Меняете -->
                    <div class="exchange-widget-block">
                      <span class="exchange__label-text select-none"
                        >Меняете</span
                      >
                      <div :class="['exchange__block', 'exchange__from', { 'error': validationError }]">
                        <label class="exchange__label">
                          <span class="exchange__field">
                            <input
                              v-model="amountFrom"
                              type="number"
                              inputmode="decimal"
                              :placeholder="'Мин: ' + currentMinAmount.toFixed(6)"
                              class="exchange__input"
                              :disabled="loading"
                            />
                          </span>
                        </label>
                        <div class="flex-grow-1"></div>
                        <div class="custom-select-wrapper">
                          <CustomSelect
                            v-model="currencyFrom"
                            :options="cryptoCurrencies"
                            :searchable="true"
                            :disabled="loading"
                          />
                        </div>
                      </div>
                      <div class="exchange__error">
                        <div v-if="validationError" class="validation-error">
                          {{ validationError }}
                        </div>
                      </div>
                    </div>

                    <!-- Кнопка обмена и курс -->
                    <div class="exchange-reverse-block">
                      <div class="exchangeRate-main">

                        <div class="withdraw-fee-mobile">
                          <span class="withdraw-fee-info"
                            >Все комиссии включены</span
                          >

                        </div>
                        <div
                          v-if="amountFrom && parseFloat(amountFrom) < currentMinAmount"
                          class="min-amount-info min-amount-error"
                        >
                          Мин. сумма: {{ currentMinAmount.toFixed(6) }}
                        </div>
                      </div>
                      <div class="flex-grow-1"></div>
                      <div
                        class="exchange-reverse-button"
                        @click="swapCurrencies"
                      >
                        <div class="exchange-reverse-icon"></div>
                      </div>
                    </div>

                    <div class="exchange-widget-block">
                      <span class="exchange__label-text select-none"
                        >Получаете</span
                      >
                      <div class="exchange__block">
                        <label class="exchange__label ">
                          <span class="exchange__field">
                            <input
                              v-model="amountTo"
                              type="number"
                              inputmode="decimal"
                              placeholder="..."
                              class="exchange__input"
                              :disabled="loading"
                            />
                          </span>
                        </label>
                        <div class="flex-grow-1"></div>
                        <div class="custom-select-wrapper">
                          <CustomSelect
                            v-model="currencyTo"
                            :options="cryptoCurrencies"
                            placeholder="ETH"
                            :searchable="true"
                            :disabled="loading"
                          />
                        </div>
                      </div>
                      <div class="exchange__error"></div>
                    </div>

                    <div class="exchange__button-wrapper">
                      <button
                        @click="exchange"
                        class="exchange-button"
                        :disabled="loading || !currencyFrom || !currencyTo || !amountFrom || !!validationError"
                      >
                        {{ loading ? "Загрузка..." : "Начать обмен" }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <section class="page-block background-gray mobile-background-black">
        <div class="container">
          <h3 class="promo__title underline">Почему выбирают нас?</h3>
          <div class="row why-chose-us-list">
            <div class="col-sm-4 why-chose-us-elem">
              <img class="lazy" src="/testcom/images/check-icon.svg" /> Лучшие
              курсы
            </div>
            <div class="col-sm-4 why-chose-us-elem">
              <img class="lazy" src="/testcom/images/check-icon.svg" />
              Отзывчивая тех.поддержка
            </div>
            <div class="col-sm-4 why-chose-us-elem">
              <img class="lazy" src="/testcom/images/check-icon.svg" />
              Сверхбыстрые транзакции
            </div>
            <div class="col-sm-4 why-chose-us-elem">
              <img class="lazy" src="/testcom/images/check-icon.svg" /> Без
              регистрации
            </div>
            <div class="col-sm-4 why-chose-us-elem">
              <img class="lazy" src="/testcom/images/check-icon.svg" /> Низкие
              лимиты на обмен
            </div>
            <div class="col-sm-4 why-chose-us-elem">
              <img class="lazy" src="/testcom/images/check-icon.svg" /> Широкий
              выбор монет
            </div>
          </div>
        </div>
      </section>

      <section class="page-block background-gray mobile-background-black">
        <div class="container">
          <h3 class="promo__title underline">Как это работает</h3>
          <div class="row how-it-works-list">
            <div class="how-it-works-elem">
              <div class="how-it-works-title">
                <div>Выбрать и предоставить</div>
                <img class="lazy" src="/testcom/images/main-page/01.svg" />
              </div>
              <div class="how-it-works-text">
                Просто выберите криптовалюты, которые вы хотите обменять, и
                предоставьте детали. Мы рассчитаем курс за доли секунды.
              </div>
            </div>
            <div class="how-it-works-elem">
              <div class="how-it-works-title">
                <div>Подтвердить и отправить</div>
                <img class="lazy" src="/testcom/images/main-page/02.svg" />
              </div>
              <div class="how-it-works-text">
                Еще раз проверьте данные и подтвердите транзакцию. Отправьте
                средства на адрес депозита.
              </div>
            </div>
            <div class="how-it-works-elem">
              <div class="how-it-works-title">
                <div>Расслабьтесь и получите</div>
                <img class="lazy" src="/testcom/images/main-page/03.svg" />
              </div>
              <div class="how-it-works-text">
                Немного расслабьтесь, пока мы обрабатываем транзакцию.
                StatPay находит лучший курс для обмена, быстро конвертирует
                вашу криптовалюту и безопасно отправляет ее на адрес вашего
                кошелька за несколько минут.
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        class="cashback-img page-block lazy"
        style="background-image: url('/testcom/images/main-page/cashback.png')"
      >
        <div class="container">
          <div class="cashback">
            <h3 class="promo__title">Зарабатывайте с StatPay</h3>
            <div class="cashback-text">
              <h4><strong>Партнерская программа</strong></h4>
              <p>
                Присоединяйтесь к нашей партнерской программе и начните
                зарабатывать с каждого привлеченного пользователя до 50% от
                комиссии StatPay.
              </p>
              <h4><strong>API</strong></h4>
              <p>
                Интегрируйте наш API, и получите возможность использовать нашу
                систему обмена, в которой вы сможете сами устанавливать
                комиссию.
              </p>
              <h4><strong>Кешбэк</strong></h4>
              <p>
                Благодаря нашей системе кэшбека ваши обмены станут еще выгодней!
              </p>
            </div>
            <div
              class="cashback-hidden-bg hidden-md hidden-lg lazy"
            ></div>
            <a href="/for-partners" class="cashback-btn" rel="nofollow">
              Узнать больше
            </a>
          </div>
        </div>
      </section>
      <section class="our-partners page-block">
        <div class="container">
          <h3 class="promo__title underline">Наши партнеры</h3>
        </div>
        <div class="ticker-container">
          <div class="ticker-scroll infinite-animation display-flex">
            <div class="ticker-item">
              <div class="trocadore-hover-preload hover-preload"></div>
              <a> <img class="trocadore" /> </a>
            </div>
            <div class="ticker-item">
              <div class="swapspace-hover-preload hover-preload"></div>
              <a>
                <img class="swapspace" />
              </a>
            </div>

            <div class="ticker-item">
              <div class="exnode-hover-preload hover-preload"></div>
              <a>
                <img class="exnode" />
              </a>
            </div>
            <div class="ticker-item">
              <div class="cake-wallet-hover-preload hover-preload"></div>
              <a> <img class="cake-wallet" /> </a>
            </div>
            <div class="ticker-item">
              <div class="onez-hover-preload hover-preload"></div>
              <a> <img class="onez" /> </a>
            </div>
            <div class="ticker-item">
              <div class="stackwallet-hover-preload hover-preload"></div>
              <a> <img class="stackwallet" /> </a>
            </div>
            <div class="ticker-item">
              <div class="quppy-hover-preload hover-preload"></div>
              <a> <img class="quppy" /> </a>
            </div>

            <div class="ticker-item">
              <div class="coinsdo-hover-preload hover-preload"></div>
              <a> <img class="coinsdo" /> </a>
            </div>
          </div>
          <div class="ticker-scroll infinite-animation display-flex">
            <div class="ticker-item">
              <div class="trocadore-hover-preload hover-preload"></div>
              <a> <img class="trocadore" /> </a>
            </div>
            <div class="ticker-item">
              <div class="swapspace-hover-preload hover-preload"></div>
              <a>
                <img class="swapspace" />
              </a>
            </div>

            <div class="ticker-item">
              <div class="exnode-hover-preload hover-preload"></div>
              <a>
                <img class="exnode" />
              </a>
            </div>
            <div class="ticker-item">
              <div class="cake-wallet-hover-preload hover-preload"></div>
              <a> <img class="cake-wallet" /> </a>
            </div>
            <div class="ticker-item">
              <div class="onez-hover-preload hover-preload"></div>
              <a> <img class="onez" /> </a>
            </div>
            <div class="ticker-item">
              <div class="stackwallet-hover-preload hover-preload"></div>
              <a> <img class="stackwallet" /> </a>
            </div>
            <div class="ticker-item">
              <div class="quppy-hover-preload hover-preload"></div>
              <a> <img class="quppy" /> </a>
            </div>
            <div class="ticker-item">
              <div class="swapzone-hover-preload hover-preload"></div>
              <a> <img class="swapzone" /> </a>
            </div>
            <div class="ticker-item">
              <div class="coinsdo-hover-preload hover-preload"></div>
              <a> <img class="coinsdo" /> </a>
            </div>
          </div>
          <div class="ticker-scroll infinite-animation display-flex">
            <div class="ticker-item">
              <div class="trocadore-hover-preload hover-preload"></div>
              <a> <img class="trocadore" /> </a>
            </div>
            <div class="ticker-item">
              <div class="swapspace-hover-preload hover-preload"></div>
              <a>
                <img class="swapspace" />
              </a>
            </div>
            <div class="ticker-item">
              <div class="bestchange-hover-preload hover-preload"></div>
              <a>
                <img class="bestchange" />
              </a>
            </div>
            <div class="ticker-item">
              <div class="exnode-hover-preload hover-preload"></div>
              <a>
                <img class="exnode" />
              </a>
            </div>
            <div class="ticker-item">
              <div class="cake-wallet-hover-preload hover-preload"></div>
              <a> <img class="cake-wallet" /> </a>
            </div>
            <div class="ticker-item">
              <div class="onez-hover-preload hover-preload"></div>
              <a> <img class="onez" /> </a>
            </div>
            <div class="ticker-item">
              <div class="stackwallet-hover-preload hover-preload"></div>
              <a> <img class="stackwallet" /> </a>
            </div>
            <div class="ticker-item">
              <div class="quppy-hover-preload hover-preload"></div>
              <a> <img class="quppy" /> </a>
            </div>
            <div class="ticker-item">
              <div class="swapzone-hover-preload hover-preload"></div>
              <a> <img class="swapzone" /> </a>
            </div>
            <div class="ticker-item">
              <div class="coinsdo-hover-preload hover-preload"></div>
              <a> <img class="coinsdo" /> </a>
            </div>
          </div>
        </div>
      </section>
      <section class="faq page-block background-gray mobile-background-black">
        <div class="container">
          <h3 class="promo__title">Часто Задаваемые Вопросы о StatPay</h3>
          <div class="underline"></div>
          <div class="row faq-items">

            <div class="col-sm-12 faq-item">
              <div class="faq-item-title">
                <div class="text">Сколько времени займет обмен?</div>
                <span aria-hidden="true" style="min-width: max-content">
                  <span class="icon-closed">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-plus.svg"
                    />
                  </span>
                  <span class="icon-opened" style="display: none">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-minus.svg"
                    />
                  </span>
                </span>
              </div>
              <div class="faq-item-desc" style="display: none">
                После того, как транзакция инициирована, требуется около 10
                минут, чтобы мы обменяли средства и перевели их на ваш кошелек.
              </div>
            </div>
            <div class="col-sm-12 faq-item">
              <div class="faq-item-title">
                <div class="text">
                  Я перевел свои средства на платформу, но ничего не получил
                  взамен?
                </div>
                <span aria-hidden="true" style="min-width: max-content">
                  <span class="icon-closed">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-plus.svg"
                    />
                  </span>
                  <span class="icon-opened" style="display: none">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-minus.svg"
                    />
                  </span>
                </span>
              </div>
              <div class="faq-item-desc" style="display: none">
                Операции обмена криптовалютой выполняются только после получения
                всех сетевых подтверждений. Вам следует дождаться подтверждения
                вашей транзакции. Пожалуйста, проверьте все введенные данные на
                всякий случай.
              </div>
            </div>

            <div class="col-sm-12 faq-item">
              <div class="faq-item-title">
                <div class="text">Есть ли у вас реферальная система?</div>
                <span aria-hidden="true" style="min-width: max-content">
                  <span class="icon-closed">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-plus.svg"
                    />
                  </span>
                  <span class="icon-opened" style="display: none">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-minus.svg"
                    />
                  </span>
                </span>
              </div>
              <div class="faq-item-desc" style="display: none">
                Да, у нас есть партнерская программа, благодаря которой вы
                можете зарабатывать за привлеченных рефералов
              </div>
            </div>
            <div class="col-sm-12 faq-item">
              <div class="faq-item-title">
                <div class="text">Что делать, если обмен завис?</div>
                <span aria-hidden="true" style="min-width: max-content">
                  <span class="icon-closed">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-plus.svg"
                    />
                  </span>
                  <span class="icon-opened" style="display: none">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-minus.svg"
                    />
                  </span>
                </span>
              </div>
              <div class="faq-item-desc" style="display: none">
                Свяжитесь с нашей поддержкой, мы обязательно все решим.
              </div>
            </div>
            <div class="col-sm-12 faq-item">
              <div class="faq-item-title">
                <div class="text">Где можно отследить статус заявки?</div>
                <span aria-hidden="true" style="min-width: max-content">
                  <span class="icon-closed">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-plus.svg"
                    />
                  </span>
                  <span class="icon-opened" style="display: none">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-minus.svg"
                    />
                  </span>
                </span>
              </div>
              <div class="faq-item-desc" style="display: none">
                Если вы вышли из окна заявки и вам нужно узнать статус, то для
                этого необходим ID заявки. Вы можете написать нашей поддержке и
                уточнить статус указав ID вашей заявки.
              </div>
            </div>
            <div class="col-sm-12 faq-item">
              <div class="faq-item-title">
                <div class="text">Можно ли отказаться от обмена?</div>
                <span aria-hidden="true" style="min-width: max-content">
                  <span class="icon-closed">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-plus.svg"
                    />
                  </span>
                  <span class="icon-opened" style="display: none">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-minus.svg"
                    />
                  </span>
                </span>
              </div>
              <div class="faq-item-desc" style="display: none">
                Если вы не отправили средства, то можете просто выйти из окна
                заявки и создать новую. Отменять ничего не нужно. Если вы уже
                отправили средства и вам нужно срочно отменить заявку -
                свяжитесь с нашей поддержкой. Мы постараемся помочь.
              </div>
            </div>
            <div class="col-sm-12 faq-item">
              <div class="faq-item-title">
                <div class="text">
                  Можно ли изменить реквизиты, если ошибся?
                </div>
                <span aria-hidden="true" style="min-width: max-content">
                  <span class="icon-closed">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-plus.svg"
                    />
                  </span>
                  <span class="icon-opened" style="display: none">
                    <img
                      class="lazy"
                      src="/testcom/images/main-page/faq-minus.svg"
                    />
                  </span>
                </span>
              </div>
              <div class="faq-item-desc" style="display: none">
                Для этого пересоздайте заявку заново.
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
</template>

<style scoped>
.main-page {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.example-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
}

.example-section h3 {
  margin-bottom: 16px;
  color: #374151;
  font-size: 18px;
  font-weight: 600;
}

.example-section p {
  margin-top: 16px;
  color: #6b7280;
  font-size: 14px;
}

.size-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.size-example {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.size-example label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.custom-select-wrapper {
  min-width: 150px;
}

.loading-indicator {
  text-align: center;
  padding: 10px;
  color: #6b7280;
  font-size: 14px;
}

.exchange-reverse-button {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.exchange-reverse-button:hover {
  transform: scale(1.1);
}

.exchange-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* FAQ стили */
.faq-item {
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.faq-item-title .text {
  flex: 1;
  padding-right: 15px;
}

.faq-item-title:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.faq-item-desc {
  padding: 0 15px;
  background-color: rgba(0, 0, 0, 0.2);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  line-height: 1.6;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  word-wrap: break-word;
  white-space: normal;
}

.faq-item-desc.active {
  padding-top: 15px;
  padding-bottom: 15px;
}

.icon-closed, .icon-opened {
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.icon-closed img, .icon-opened img {
  transition: transform 0.3s ease;
  width: 20px;
  height: 20px;
}

.faq-item-title:hover .icon-closed img {
  transform: rotate(90deg);
}

/* Стили для ошибки валидации */
.validation-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 5px;
  padding: 5px 0;
  font-weight: 500;
}

/* Стили для блока с ошибкой */
.exchange__block.error {
  border: 2px solid #ef4444 !important;
  border-radius: 8px;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
}

/* Стили для отображения минимальной суммы */
.min-amount-info {
  color: #6b7280;
  font-size: 11px;
  margin-top: 3px;
  font-weight: 400;
}

.min-amount-error {
  color: #ef4444;
  font-size: 12px;
  font-weight: 600;
}
</style>
