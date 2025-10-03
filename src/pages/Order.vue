<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useExchangeStore } from "@/store/ExchangeStore";
import MainLayout from "@/components/Layout/MainLayout.vue";
import { ApiService } from "@/api/api";
const route = useRoute();
const { getOrder, getRateById } = useExchangeStore();

const orderData = ref(null);
const loading = ref(true);
const error = ref("");
const updateInterval = ref(null);
const isInitialLoad = ref(true);
const calculatedRate = ref(0);
// Маппинг статусов API к UI
const statusMapping = {
  'created': { step: 1, title: 'Ожидание перевода', class: 'step-awaiting' },
  'processing': { step: 2, title: 'Подтверждение', class: 'step-confirming' },
  'paid': { step: 3, title: 'Обмен', class: 'step-exchanging' },
  'suspended': { step: 2, title: 'Приостановлено', class: 'step-suspended' },
  'completed': { step: 4, title: 'Завершено', class: 'step-completed' },
  'deleted': { step: 0, title: 'Отменено', class: 'step-cancelled' }
};

// Computed для получения текущего статуса
const currentStatus = computed(() => {
  if (!orderData.value) return null;
  return statusMapping[orderData.value.status] || statusMapping['created'];
});

// Computed для парсинга описания (email)
const parsedDescription = computed(() => {
  if (!orderData.value?.description) return {};
  try {
    return JSON.parse(orderData.value.description);
  } catch (error) {
    console.error('Ошибка парсинга description:', error);
    return {};
  }
});

// Computed для парсинга платежной информации (адрес, MEMO)
const parsedPaymentInfo = computed(() => {
  if (!orderData.value?.payment_info) return {};
  try {
    return JSON.parse(orderData.value.payment_info);
  } catch (error) {
    console.error('Ошибка парсинга payment_info:', error);
    return {};
  }
});

// Computed для получения email
const userEmail = computed(() => {
  return parsedDescription.value.email || parsedDescription.value['📧 E-mail'] || '';
});

// Computed для получения адреса кошелька
const walletAddress = computed(() => {
  return parsedPaymentInfo.value.address || parsedPaymentInfo.value['💼 Адрес кошелька'] || '';
});

// Computed для получения MEMO
const memoValue = computed(() => {
  return parsedPaymentInfo.value.memo || parsedPaymentInfo.value['💬 MEMO'] || orderData.value?.memo || '';
});

// Computed для форматирования времени создания
const createdDate = computed(() => {
  if (!orderData.value?.created_at) return '';
  return new Date(orderData.value.created_at).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC'
  }) + ' (UTC)';
});

// Computed для курса обмена
const exchangeRate = computed(() => {
  if (!orderData.value) return '';

  // Используем новые поля rate_from и rate_to если они доступны
  if (orderData.value.rate_from && orderData.value.rate_to) {
    const rateFromValue = parseFloat(orderData.value.rate_from);
    const rateToValue = parseFloat(orderData.value.rate_to);
    if (rateFromValue && rateToValue) {
      return `1 ${orderData.value.currency_from} ~ ${(rateFromValue / rateToValue).toFixed(2)} ${orderData.value.currency_to}`;
    }
  }

  // Fallback к старому методу расчета
  const fromAmount = parseFloat(orderData.value.amount_from);
  const toAmount = parseFloat(orderData.value.amount_to);
  if (fromAmount && toAmount) {
    return `1 ${orderData.value.currency_from} ~ ${(toAmount / fromAmount).toFixed(2)} ${orderData.value.currency_to}`;
  }
  return '';
});

// Computed для заголовка статуса
const statusTitle = computed(() => {
  if (!orderData.value) return '';

  switch (orderData.value.status) {
    case 'created':
      return 'Ожидаем ваш платеж';
    case 'processing':
      return 'Обрабатываем транзакцию';
    case 'paid':
      return 'Выполняем обмен';
    case 'suspended':
      return 'Обмен приостановлен';
    case 'completed':
      return 'Обмен завершен успешно';
    case 'deleted':
      return 'Обмен отменен';
    default:
      return 'Статус обмена';
  }
});

// Computed для описания статуса
const statusDescription = computed(() => {
  if (!orderData.value) return '';

  switch (orderData.value.status) {
    case 'created':
      return `Мы ожидаем поступления ${orderData.value.amount_from} ${orderData.value.currency_from} на депозитный адрес. После получения средств мы начнем процесс обмена.`;
    case 'processing':
      return `Ваша транзакция получена и ожидает подтверждений в блокчейне. Это может занять от нескольких минут до часа в зависимости от загруженности сети.`;
    case 'paid':
      return `Транзакция подтверждена! Мы выполняем обмен ваших ${orderData.value.currency_from} на ${orderData.value.currency_to} по зафиксированному курсу.`;
    case 'suspended':
      return 'Обмен временно приостановлен. Пожалуйста, свяжитесь с технической поддержкой для получения дополнительной информации.';
    case 'completed':
      return `Обмен завершен! Мы отправили ${orderData.value.amount_to} ${orderData.value.currency_to} на указанный вами адрес.`;
    case 'deleted':
      return 'Обмен был отменен. Если вы уже отправили средства, то обратитесь в нашу техническую поддержку мы постараемся помочь разрешить данную ситуацию.';
    default:
      return 'Проверяем статус вашего обмена...';
  }
});

// Computed для дополнительной информации
const statusExtra = computed(() => {
  if (!orderData.value) return '';

  switch (orderData.value.status) {
    case 'created':
      return '';
    case 'processing':
      return 'Обычно требуется 1-3 подтверждения в сети блокчейн. Мы уведомим вас о каждом этапе обработки.';
    case 'paid':
      return 'Процесс обмена занимает от 5 до 30 минут в зависимости от загруженности наших партнерских бирж.';
    case 'suspended':
      return 'Возможные причины: проблемы с ликвидностью, технические работы или требуется дополнительная верификация.';
    case 'completed':
      return 'Вы можете проверить поступление средств в блокчейн-обозревателе по хешу транзакции.';
    case 'deleted':
      return '';
    default:
      return '';
  }
});

// Функция загрузки данных заказа
async function loadOrderData() {
  try {
    // Показываем спиннер только при первоначальной загрузке
    if (isInitialLoad.value) {
      loading.value = true;
    }

    const result = await getOrder(route.params.id);

    if (result.success) {
      orderData.value = result.data;
    } else {
      orderData.value = result; // Если API возвращает данные напрямую
    }
    error.value = "";

    // После первой успешной загрузки больше не показываем спиннер
    if (isInitialLoad.value) {
      isInitialLoad.value = false;
    }
  } catch (err) {
    console.error("Ошибка загрузки заказа:", err);
    error.value = "Ошибка загрузки данных заказа";
  } finally {
    // Убираем спиннер только если это была первоначальная загрузка
    if (loading.value) {
      loading.value = false;
    }
  }
}

// Функция копирования в буфер обмена
function copyToClipboard(text, element) {
  // Приводим к строке для корректного копирования
  const textToCopy = String(text || '');

  navigator.clipboard.writeText(textToCopy).then(() => {
    // Находим кнопку (либо сам элемент, либо родительскую кнопку)
    const button = element.closest('.copy-btn') || element;

    if (button && button.classList.contains('copy-btn')) {
      // Добавляем класс "copied" для изменения внешнего вида
      button.classList.add('copied');

      // Убираем класс через 2 секунды
      setTimeout(() => {
        button.classList.remove('copied');
      }, 2000);
    } else {
      // Старый способ для совместимости с другими элементами
      const copySpan = element.querySelector('span');
      if (copySpan) {
        copySpan.style.opacity = '1';
        setTimeout(() => {
          copySpan.style.opacity = '0';
        }, 2000);
      }
    }
  }).catch((err) => {
    console.error('Ошибка копирования:', err);
  });
}

// Функция для получения сокращенного значения
function getShortValue(value, showChars = 4) {
  if (!value) return '';

  // Приводим к строке на случай если значение число или другой тип
  const stringValue = String(value);

  if (stringValue.length <= showChars * 2) return stringValue;
  return `${stringValue.substring(0, showChars)}...${stringValue.substring(stringValue.length - showChars)}`;
}
const formatCurrency = (currency) => {
    if(currency.currency_from === "BNBBEP20") {
        return "BNBBEP20";
    }
  return currency + (currency.network ? ` (${currency.network})` : "");
};
const apiService = new ApiService(import.meta.env.VITE_EXCHANGER_API);
onMounted(async () => {
  await loadOrderData();

  // Обновляем данные каждые 30 секунд
  updateInterval.value = setInterval(loadOrderData, 5000);
  const result = await apiService.calculateExchange({
    exchangerId: import.meta.env.VITE_EXCHANGER_ID,
    currencyFrom: formatCurrency(orderData.value.currency_from) || orderData.value?.label || "",
    currencyTo: formatCurrency(orderData.value.currency_to) || orderData.value?.label || "",
    amountFrom: 1,
    amountTo: "",
  });
  console.log("result", result);
  calculatedRate.value = result.data.amount_to;
});

onUnmounted(() => {
  if (updateInterval.value) {
    clearInterval(updateInterval.value);
  }
});
</script>

<template>
    <main id="main">
      <div style="position: absolute; width: 100%; margin-top: 15px">
        <div class="container"></div>
      </div>

      <div v-if="loading" class="promo promo_inner">
        <div class="container">
          <div class="loading-spinner">Загрузка данных заказа...</div>
        </div>
      </div>

      <div v-else-if="error" class="promo promo_inner">
        <div class="container">
          <div class="error-message">{{ error }}</div>
        </div>
      </div>

      <div v-else-if="orderData" class="promo promo_inner">
        <div class="container">
          <div class="promo__wrapper">
            <div class="order">
              <div class="order__wrapper">
                <div class="q-widget">
                  <div class="q-body">
                    <!-- Заголовок с суммами -->
                    <div class="q-body__header display-flex">
                      <div class="header-fields">
                        <label class="select-none">Меняете</label>
                        <div class="header-field display-flex">
                          <div>{{ orderData.amount_from }}</div>
                          <div class="flex-grow-1"></div>
                          <div :class="`header-field__currency icon_${orderData.currency_from.replace(/\s+/g, '')}`">
                            {{ orderData.currency_from }}
                          </div>
                        </div>
                      </div>
                      <div class="header-arrow flex-grow-1"></div>
                      <div class="header-fields">
                        <label class="select-none">Получаете</label>
                        <div class="header-field display-flex">
                          <div class="display-flex" style="column-gap: 4px">
                            ~
                            <div id="expected_amount_to">{{ orderData.amount_to }}</div>
                          </div>
                          <div class="flex-grow-1"></div>
                          <div :class="`header-field__currency icon_${orderData.currency_to.replace(/\s+/g, '')}`">
                            {{ orderData.currency_to }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Статус и описание -->
                    <div class="status-info " :class="{'orange': orderData.status === 'suspended' || orderData.status === 'deleted'}">
                      <h2 class="status-title">{{ statusTitle }}</h2>
                      <p class="status-description">{{ statusDescription }}</p>
                      <div v-if="statusExtra" class="status-extra">
                        <div class="status-extra-icon">ℹ️</div>
                        <p>{{ statusExtra }}</p>
                      </div>
                    </div>

                    <!-- Адрес для отправки (только если статус created) -->
                    <div v-if="orderData.status === 'created'" class="send-address">
                      <label>
                        Отправьте {{ orderData.amount_from }} {{ orderData.currency_from }}
                        по указанному ниже адресу одной транзакцией:
                      </label>
                      <div class="address-block">
                        <div class="address-padding">
                          <span class="address-value">
                            {{ orderData.wallet_address || 'Адрес генерируется...' }}
                          </span>
                          <div v-if="orderData.wallet_address" class="copy-address-button">
                            <button
                              class="copy-btn"
                              @click="copyToClipboard(orderData.wallet_address, $event.target)"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5H6C5.73478 5 5.48043 5.10536 5.29289 5.29289C5.10536 5.48043 5 5.73478 5 6V18C5 18.2652 5.10536 18.5196 5.29289 18.7071C5.48043 18.8946 5.73478 19 6 19H18C18.2652 19 18.5196 18.8946 18.7071 18.7071C18.8946 18.5196 19 18.2652 19 18V6C19 5.73478 18.8946 5.48043 18.7071 5.29289C18.5196 5.10536 18.2652 5 18 5H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10 5C10 4.73478 10.1054 4.48043 10.2929 4.29289C10.4804 4.10536 10.7348 4 11 4H13C13.2652 4 13.5196 4.10536 13.7071 4.29289C13.8946 4.48043 14 4.73478 14 5V7C14 7.26522 13.8946 7.51957 13.7071 7.70711C13.5196 7.89464 13.2652 8 13 8H11C10.7348 8 10.4804 7.89464 10.2929 7.70711C10.1054 7.51957 10 7.26522 10 7V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <span class="copy-text">Копировать адрес</span>
                              <span class="copied-text">Скопировано!</span>
                            </button>
                          </div>
                        </div>

                        <!-- MEMO/Tag если есть -->
                        <!-- <div v-if="memoValue" class="address-padding" style="margin-top: 15px;">
                          <label style="font-weight: 600; margin-bottom: 8px; display: block;">
                            MEMO/Tag (обязательно укажите при переводе):
                          </label>
                          <span class="address-value">
                            {{ memoValue }}
                          </span>
                          <div class="copy-address-button">
                            <button
                              class="copy-btn"
                              @click="copyToClipboard(memoValue, $event.target)"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5H6C5.73478 5 5.48043 5.10536 5.29289 5.29289C5.10536 5.48043 5 5.73478 5 6V18C5 18.2652 5.10536 18.5196 5.29289 18.7071C5.48043 18.8946 5.73478 19 6 19H18C18.2652 19 18.5196 18.8946 18.7071 18.7071C18.8946 18.5196 19 18.2652 19 18V6C19 5.73478 18.8946 5.48043 18.7071 5.29289C18.5196 5.10536 18.2652 5 18 5H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10 5C10 4.73478 10.1054 4.48043 10.2929 4.29289C10.4804 4.10536 10.7348 4 11 4H13C13.2652 4 13.5196 4.10536 13.7071 4.29289C13.8946 4.48043 14 4.73478 14 5V7C14 7.26522 13.8946 7.51957 13.7071 7.70711C13.5196 7.89464 13.2652 8 13 8H11C10.7348 8 10.4804 7.89464 10.2929 7.70711C10.1054 7.51957 10 7.26522 10 7V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <span class="copy-text">Копировать MEMO</span>
                              <span class="copied-text">Скопировано!</span>
                            </button>
                          </div>
                        </div> -->
                      </div>

                    </div>

                    <!-- Предупреждение о времени -->
                    <div v-if="orderData.status === 'created'" class="time-text">
                      У вас есть 1 час, чтобы отправить средства, иначе
                      транзакция будет автоматически отменена
                    </div>

                    <!-- Прогресс-бар -->
                    <div class="progress__bar">
                      <div
                        class="progress__item step-awaiting"
                        :class="{ active: currentStatus?.step >= 1 }"
                      >
                        <div class="progress__line"></div>
                        <div class="progress__title">Ожидание перевода</div>
                      </div>
                      <div
                        class="progress__item step-confirming"
                        :class="{ active: currentStatus?.step >= 2 }"
                      >
                        <div class="progress__line"></div>
                        <div class="progress__title">Подтверждение</div>
                      </div>
                      <div
                        class="progress__item step-exchanging"
                        :class="{ active: currentStatus?.step >= 3 }"
                      >
                        <div class="progress__line"></div>
                        <div class="progress__title">Обмен</div>
                      </div>
                      <div
                        class="progress__item step-sending"
                        :class="{ active: currentStatus?.step >= 4 }"
                      >
                        <div class="progress__line"></div>
                        <div class="progress__title">Завершено</div>
                      </div>
                    </div>

                    <!-- Дополнительная информация -->
                    <div class="additional-info">
                      <div class="info-section">
                        <h3>🔒 Безопасность</h3>
                        <p>
                          Все транзакции защищены многоуровневой системой безопасности.
                          Мы используем холодные кошельки и двухфакторную аутентификацию для защиты ваших средств.
                        </p>
                      </div>

                      <div v-if="orderData.status === 'created'" class="info-section">
                        <h3>⚡ Что дальше?</h3>
                        <ul>
                          <li>Отправьте точную сумму {{ orderData.amount_from }} {{ orderData.currency_from }} на указанный адрес</li>
                          <li>Дождитесь подтверждения транзакции в блокчейне</li>
                          <li>Мы автоматически начнем процесс обмена</li>
                          <li>Получите {{ orderData.amount_to }} {{ orderData.currency_to }} на ваш адрес</li>
                        </ul>
                      </div>

                      <div v-if="orderData.status === 'processing'" class="info-section">
                        <h3>⏳ Обработка</h3>
                        <p>
                          Ваша транзакция обрабатывается. Обычно требуется 1-6 подтверждений в сети блокчейн.
                          Время может варьироваться в зависимости от загруженности сети.
                        </p>
                      </div>

                      <div v-if="orderData.status === 'paid'" class="info-section">
                        <h3>🔄 Обмен в процессе</h3>
                        <p>
                          Ваши средства получены и подтверждены. Мы выполняем обмен на лучших условиях через наших партнеров.
                          Среднее время обмена: 5-30 минут.
                        </p>
                      </div>

                      <div v-if="orderData.status === 'completed'" class="info-section">
                        <h3>✅ Готово!</h3>
                        <p>
                          Поздравляем! Обмен успешно завершен. Средства отправлены на ваш адрес.
                          Сохраните эту страницу для истории транзакций.
                        </p>
                      </div>

                      <div class="info-section">
                        <h3>💬 Поддержка</h3>
                        <p>
                          Остались вопросы? Наша служба поддержки работает с 10:00 до 22:00 по московскому времени.
                          Свяжитесь с нами в <a href="https://t.me/statpay_io" style="color: #10b981 !important;" target="_blank">Telegram</a>.
                        </p>
                      </div>
                    </div>

                    <!-- Детали обмена -->
                    <div class="info">
                      <label>Детали обмена</label>
                      <div class="transaction-info">
                        <div class="block">
                          <label>ID обмена:</label>
                          <label class="value display-flex">
                            <span class="show-hide">
                              {{ getShortValue(orderData.id, 8) }}
                            </span>
                            <label
                              class="copy-link-mini"
                              @click="copyToClipboard(orderData.id, $event.target)"
                            >
                              <span style="opacity: 0; transition: opacity 0.3s;">Copied</span>
                            </label>
                          </label>
                        </div>

                        <div v-if="orderData.wallet_address" class="block">
                          <label>Депозит адрес:</label>
                          <label class="value display-flex">
                            <span class="show-hide">
                              {{ getShortValue(orderData.wallet_address) }}
                            </span>
                            <label
                              class="copy-link-mini"
                              @click="copyToClipboard(orderData.wallet_address, $event.target)"
                            >
                              <span style="opacity: 0; transition: opacity 0.3s;">Copied</span>
                            </label>
                          </label>
                        </div>

                        <div v-if="walletAddress" class="block">
                          <label>Адрес для перевода:</label>
                          <label class="value display-flex">
                            <span class="show-hide">
                              {{ getShortValue(walletAddress) }}
                            </span>
                            <label
                              class="copy-link-mini"
                              @click="copyToClipboard(walletAddress, $event.target)"
                            >
                              <span style="opacity: 0; transition: opacity 0.3s;">Copied</span>
                            </label>
                          </label>
                        </div>

                        <div v-if="memoValue" class="block">
                          <label>MEMO/Tag:</label>
                          <label class="value display-flex">
                            <span class="show-hide">
                              {{ memoValue }}
                            </span>
                            <label
                              class="copy-link-mini"
                              @click="copyToClipboard(memoValue, $event.target)"
                            >
                              <span style="opacity: 0; transition: opacity 0.3s;">Copied</span>
                            </label>
                          </label>
                        </div>

                        <div v-if="userEmail" class="block">
                          <label>Email:</label>
                          <label class="value">{{ userEmail }}</label>
                        </div>

                        <div class="block">
                          <label>Дата создания:</label>
                          <label class="value">{{ createdDate }}</label>
                        </div>

                        <div class="block">
                          <label>Статус:</label>
                          <label class="value">{{ currentStatus?.title || 'Неизвестно' }}</label>
                        </div>

                        <div v-if="orderData.confirmations_required" class="block">
                          <label>Необходимо подтверждений:</label>
                          <label class="value">{{ orderData.confirmations_required }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Боковая панель с деталями -->
            <div class="order__detail">
              <div class="order__detail-step display-flex">
                <div>
                  <span :class="{ active: currentStatus?.step >= 1 }">1</span>
                  Создание обмена
                </div>
                <div>
                  <span :class="{ active: currentStatus?.step >= 2 }">2</span>
                  Ожидание оплаты
                </div>
                <div>
                  <span :class="{ active: currentStatus?.step >= 3 }">3</span>
                  Обмен
                </div>
                <div>
                  <span :class="{ active: currentStatus?.step >= 4 }">4</span>
                  Завершено
                </div>
              </div>

              <div class="order__detail-text display-flex">

                <div>
                  <span>Ожидаемая длительность обмена: </span>~ 5-30 минут
                </div>
                <div>
                  <span>
                    Обратите внимание, что время обмена зависит от скорости
                    работы наших партнеров и общей загруженности
                    блокчейн-сетей.
                  </span>
                </div>
                <div>
                  Если у вас есть какие-либо вопросы, пожалуйста, свяжитесь с
                  нашей службой поддержки:
                  <a class="support-link" href="https://t.me/statpay_io">
                    @statpay_io
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
              </div>
      </main>
</template>

<style scoped>
.loading-spinner {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #6b7280;
}

.error-message {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #ef4444;
}

.copy-link, .copy-link-mini {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.copy-link:hover, .copy-link-mini:hover {
  opacity: 0.7;
}

.show-hide {
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.progress__item.active {
  color: #10b981;
}



.order__detail-step span.active {
  background-color: #10b981;
  color: white;
}

/* Стили для кнопки копирования адреса */
.copy-address-button {
  margin-top: 10px;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
}

.copy-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.copy-btn:active {
  transform: translateY(0);
}

.copy-btn svg {
  flex-shrink: 0;
}

.copied-text {
  display: none;
  color: #10b981;
  font-weight: 600;
}

.copy-btn.copied .copy-text {
  display: none;
}

.copy-btn.copied .copied-text {
  display: inline;
}

.copy-btn.copied {
  background-color: #10b981;
}

.copy-btn.copied:hover {
  background-color: #059669;
}

/* Стили для блока статуса */
.status-info.orange{
  background: linear-gradient(135deg, #ed8936 0%, #c05621 100%);
}
.status-info {
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, #2CB48E 0%, #1A8870 100%);
  border-radius: 12px;
  color: white;
  text-align: center;
}

.status-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.status-description {
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 15px 0;
  opacity: 0.95;
}

.status-extra {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  text-align: left;
}

.status-extra-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.status-extra p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

/* Стили для дополнительной информации */
.additional-info {
  margin: 25px 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.info-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.info-section:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.info-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #f1f5f9;
}

.info-section p {
  margin: 0;
  line-height: 1.6;
  color: #cbd5e1;
  font-size: 14px;
}

.info-section ul {
  margin: 0;
  padding-left: 20px;
  color: #cbd5e1;
}

.info-section li {
  margin-bottom: 8px;
  line-height: 1.5;
  font-size: 14px;
}

.info-section a {
  color: #60a5fa;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.info-section a:hover {
  color: #93c5fd;
  text-decoration: underline;
}

/* Адаптивность */
@media (min-width: 768px) {
  .additional-info {
    grid-template-columns: 1fr 1fr;
  }

  .info-section:last-child {
    grid-column: 1 / -1;
  }
}
</style>
