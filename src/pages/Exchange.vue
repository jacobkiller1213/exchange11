<script setup>
import "@/assets/steps.css";
import "@/assets/styles.css";
import MainLayout from "@/components/Layout/MainLayout.vue";
import { ref, computed, watch } from "vue";
import { onMounted } from "vue";
import { useExchangeStore } from "@/store/ExchangeStore";
import { useRouter } from "vue-router";
import regexData from "@/api/regex_data.json";
import { ApiService } from "@/api/api";
const { getRateById, getRates, createOrder } = useExchangeStore();
const router = useRouter();

const amountFrom = ref(0);
const amountTo = ref(0);
const currencyFrom = ref(1);
const currencyTo = ref(2);
const rateFrom = ref(0);
const rateTo = ref(0);
const rates = ref([]);
const address = ref("");
const email = ref("");
const memo = ref("");
const addressError = ref("");
const emailError = ref("");
const number = ref("");
const numberError = ref("");
const memoError = ref("");

// Переменные для чекбоксов
const termsAccepted = ref(false);
const amlKycAccepted = ref(false);

const calculatedRate = ref(0);

// Монеты, которым нужно MEMO поле
const MEMO_REQUIRED_CURRENCIES = [
  "XRP",
  "XLM",
  "EOS",
  "BNB",
  "ATOM",
  "CRO",
  "KAVA",
  "BAND",
  "IRIS",
  "RUNE",
];

// Функция для получения regex по коду валюты
function getRegexForCurrency(currencyCode) {
  // Сначала точное совпадение
  let regexEntry = regexData.find((item) => item.best_code === currencyCode);

  if (!regexEntry && currencyCode) {
    // Убираем пробелы и пытаемся найти
    const cleanCode = currencyCode.replace(/\s+/g, "");
    regexEntry = regexData.find((item) => item.best_code === cleanCode);

    // Если все еще не найдено, пытаемся найти по основной части
    if (!regexEntry) {
      const baseCurrency = currencyCode.split(" ")[0];
      regexEntry = regexData.find((item) => item.best_code === baseCurrency);
    }
  }

  return regexEntry ? regexEntry.regex : null;
}
function validateNumber(number) {
  const numberValue = number ? number.toString() : "";
  if (!numberValue) {
    numberError.value = "Номер телефона не может быть пустым";
    return false;
  }

  const digits = numberValue.replace(/\D/g, '');

  if (digits.length < 10) {
    numberError.value = "Некорректный номер телефона";
    return false;
  }

  const forbiddenPrefixes = ['1', '39', '38', '49', '44', '65', '81', '82', '972', '971'];

  for (const prefix of forbiddenPrefixes) {
    if (digits.indexOf(prefix) === 0) {
      numberError.value = "Некорректный номер телефона";
      return false;
    }
  }

  numberError.value = "";
  return true;
}
// Функция валидации адреса
function validateAddress(address, currencyCode) {
  if (!address.trim()) {
    addressError.value = "Адрес не может быть пустым";
    return false;
  }

  const regex = getRegexForCurrency(currencyCode);
  if (!regex) {
    addressError.value = ""; // Нет regex для этой валюты
    return true;
  }

  const regexPattern = new RegExp(regex);
  if (!regexPattern.test(address.trim())) {
    addressError.value = "Некорректный адрес";
    return false;
  }

  addressError.value = "";
  return true;
}

// Функция валидации email
function validateEmail(email) {
  if (!email.trim()) {
    emailError.value = "Email не может быть пустым";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    emailError.value = "Некорректный email";
    return false;
  }

  emailError.value = "";
  return true;
}

// Функция валидации MEMO (проверяет корректность формата, но не обязательность)
function validateMemo(memo, currencyCode) {
  if (!isMemoRequired(currencyCode)) {
    memoError.value = "";
    return true;
  }

  // MEMO не обязательно, но если введено - должно быть корректным
  if (memo.trim() && memo.trim().length < 1) {
    memoError.value = "MEMO слишком короткий";
    return false;
  }

  memoError.value = "";
  return true;
}

// Функция проверки необходимости MEMO
function isMemoRequired(currencyCode) {
  return MEMO_REQUIRED_CURRENCIES.includes(currencyCode);
}

// Computed для получения кода валюты
const toCurrencyCode = computed(() => {
  return rateTo.value?.label || rateTo.value?.code || "";
});

// Computed для проверки необходимости показа MEMO поля
const showMemoField = computed(() => {
  return isMemoRequired(toCurrencyCode.value);
});

// Computed для проверки валидности формы
const isFormValid = computed(() => {
  const basicValidation =
    !addressError.value &&
    !emailError.value &&
    address.value.trim() &&
    email.value.trim();

  // телефон обязателен и валиден
  const phoneValidation = validateNumber(number.value);

  // чекбоксы - оба должны быть отмечены
  const checkboxValidation = termsAccepted.value && amlKycAccepted.value;

  // MEMO проверяем на корректность
  if (showMemoField.value) {
    return basicValidation && phoneValidation && !memoError.value && checkboxValidation;
  }

  return basicValidation && phoneValidation && checkboxValidation;
});

const handleCreateOrder = async () => {
  // Валидация перед отправкой
  const isAddressValid = validateAddress(address.value, toCurrencyCode.value);
  const isEmailValid = validateEmail(email.value);
  const isNumberValid = validateNumber(number.value);
  const isMemoValid = validateMemo(memo.value, toCurrencyCode.value); // Проверяем корректность, но не на обязательность

  // Проверяем чекбоксы
  if (!termsAccepted.value || !amlKycAccepted.value) {
    alert("Необходимо согласиться с условиями пользования и AML/KYC политикой");
    return;
  }

  if (!isAddressValid || !isEmailValid || !isMemoValid || !isNumberValid) {
    return; // Не отправляем если есть ошибки валидации
  }
  const paymentInfo = JSON.stringify(
    memo.value
      ? {
          "💼 Адрес кошелька": address.value,
          "💬 MEMO": memo.value,
        }
      : {
          "💼 Адрес кошелька": address.value,
        }
  );
  const description = JSON.stringify({
    "📧 E-mail": email.value,
    "📱 Номер телефона": number.value,
  });
  const orderData = {
    exchangerId: import.meta.env.VITE_EXCHANGER_ID,
    amountFrom: amountFrom.value,
    amountTo: amountTo.value,
    currencyFrom: rateFrom.value?.currency_from || rateFrom.value?.label || "",
    currencyTo: rateTo.value?.currency_from || rateTo.value?.label || "",
    paymentInfo: paymentInfo,
    description: description,
    otherInfo: JSON.stringify({}),
  };

  console.log("Отправляемые данные:", orderData);

  try {
    const result = await createOrder(orderData);
    console.log("Заказ успешно создан:", result);

    // Редирект на страницу заказа
    if (result.data && result.data.id) {
      await router.push(`/order/${result.data.id}`);
    } else if (result.id) {
      await router.push(`/order/${result.id}`);
    }
  } catch (error) {
    console.error("Ошибка создания заказа:", error);
    alert("Ошибка создания заказа: " + error.message);
  }
};

// Watchers для автоматической валидации
watch([address, toCurrencyCode], () => {
  if (address.value && toCurrencyCode.value) {
    validateAddress(address.value, toCurrencyCode.value);
  } else if (!address.value) {
    addressError.value = ""; // Очищаем ошибку если поле пустое
  }
});

watch(email, () => {
  if (email.value) {
    validateEmail(email.value);
  } else {
    emailError.value = ""; // Очищаем ошибку если поле пустое
  }
});

watch([memo, toCurrencyCode], () => {
  if (showMemoField.value) {
    validateMemo(memo.value, toCurrencyCode.value);
  } else {
    memoError.value = ""; // Очищаем ошибку если поле не нужно
  }
});

// Очищаем MEMO при смене валюты
watch(toCurrencyCode, () => {
  if (!isMemoRequired(toCurrencyCode.value)) {
    memo.value = "";
    memoError.value = "";
  }
});
const formatCurrency = (currency) => {
    if(currency.currency_from === "BNBBEP20") {
        return "BNBBEP20";
    }
  return currency + (currency.network ? ` (${currency.network})` : "");
};
onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  amountFrom.value = parseFloat(urlParams.get("amountFrom")) || 0;
  amountTo.value = parseFloat(urlParams.get("amountTo")) || 0;
  currencyFrom.value = parseInt(urlParams.get("currencyFrom")) || 1;
  currencyTo.value = parseInt(urlParams.get("currencyTo")) || 2;

  rates.value = await getRates();
  rateFrom.value = await getRateById(currencyFrom.value);
  rateTo.value = await getRateById(currencyTo.value);
  console.log(rateFrom.value);
  console.log(rateTo.value);

  const apiService = new ApiService(import.meta.env.VITE_EXCHANGER_API);

  console.log("rateFrom", rateFrom.value);
  console.log("rateTo", rateTo.value);
  const result = await apiService.calculateExchange({
    exchangerId: import.meta.env.VITE_EXCHANGER_ID,
    currencyFrom: formatCurrency(rateFrom.value.currency_from) || rateFrom.value?.label || "",
    currencyTo: formatCurrency(rateTo.value.currency_from) || rateTo.value?.label || "",
    amountFrom: 1,
    amountTo: "",
  });
  calculatedRate.value = result.data.amount_to;
});
</script>

<template>
  <main id="main">
    <div style="position: absolute; width: 100%; margin-top: 15px">
      <div class="container"></div>
    </div>
    <!--start promo-->
    <div class="promo promo_inner">
      <div class="container">
        <div class="promo__wrapper">
          <div>
            <div class="order">
              <div class="order__wrapper">
                <form
                  class="q-widget"
                  action="/exchange/create-transaction"
                  method="get"
                >
                  <input
                    type="hidden"
                    name="id"
                    id="exchange_id"
                    value="2ac985a9-3010-4140-8f00-7788d158fd7d"
                  />
                  <div class="q-body">
                    <!--start header-->
                    <div class="q-body__header display-flex">
                      <div class="header-fields">
                        <label class="select-none">Меняете</label>
                        <div class="header-field display-flex">
                          <div>{{ amountFrom }}</div>
                          <div class="flex-grow-1"></div>
                          <div
                            :class="`header-field__currency icon_${rateFrom.label}`"
                          >
                            {{ rateFrom.label }}
                          </div>
                        </div>
                      </div>
                      <div class="header-arrow flex-grow-1"></div>
                      <div class="header-fields">
                        <label class="select-none">Получаете</label>
                        <div class="header-field display-flex">
                          <div class="display-flex" style="column-gap: 4px">
                            ~
                            <div id="expected_amount_to">{{ amountTo }}</div>
                          </div>
                          <div class="flex-grow-1"></div>
                          <div
                            :class="`header-field__currency icon_${rateTo.label}`"
                          >
                            {{ rateTo.label }}
                            <img
                              :src="`/coins/${rateTo.label}.svg`"
                              style="flex-shrink: 0"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--end header-->
                    <div class="fields">
                      <div class="field">
                        <div
                          v-if="addressError"
                          class="exchange__error js-exchange-error"
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M4.99984 9.58332C2.46853 9.58332 0.416504 7.53129 0.416504 4.99999C0.416504 2.46868 2.46853 0.416656 4.99984 0.416656C7.53114 0.416656 9.58317 2.46868 9.58317 4.99999C9.58317 7.53129 7.53114 9.58332 4.99984 9.58332ZM4.99984 8.74999C7.07091 8.74999 8.74984 7.07106 8.74984 4.99999C8.74984 2.92892 7.07091 1.24999 4.99984 1.24999C2.92877 1.24999 1.24984 2.92892 1.24984 4.99999C1.24984 7.07106 2.92877 8.74999 4.99984 8.74999ZM3.62775 6.96127L4.99979 5.58924L6.37183 6.96127L6.96109 6.37202L5.58905 4.99998L6.96109 3.62794L6.37183 3.03869L4.99979 4.41072L3.62775 3.03869L3.0385 3.62794L4.41054 4.99998L3.0385 6.37202L3.62775 6.96127Z"
                              fill="#F44242"
                            ></path>
                          </svg>
                          <span class="text">{{ addressError }}</span>
                        </div>
                        <label>Ваш {{ rateTo.label }} адрес</label>
                        <div class="q-field-success hidden">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22ZM11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20ZM14.2929 7.29289L9 12.5858L6.70711 10.2929L5.29289 11.7071L9 15.4142L15.7071 8.70711L14.2929 7.29289Z"
                              fill="#0BB526"
                            ></path>
                          </svg>
                        </div>
                        <input
                          name="destinationAddress"
                          id="destination_address"
                          class="js-order-field"
                          v-model="address"
                          :placeholder="`Ваш ${rateTo.label} адрес`"
                          :data-currency="rateTo.label"
                        />
                      </div>

                      <!-- Поле MEMO для валют, которым оно нужно -->
                      <div v-if="showMemoField" class="field">
                        <div
                          v-if="memoError"
                          class="exchange__error js-exchange-error"
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M4.99984 9.58332C2.46853 9.58332 0.416504 7.53129 0.416504 4.99999C0.416504 2.46868 2.46853 0.416656 4.99984 0.416656C7.53114 0.416656 9.58317 2.46868 9.58317 4.99999C9.58317 7.53129 7.53114 9.58332 4.99984 9.58332ZM4.99984 8.74999C7.07091 8.74999 8.74984 7.07106 8.74984 4.99999C8.74984 2.92892 7.07091 1.24999 4.99984 1.24999C2.92877 1.24999 1.24984 2.92892 1.24984 4.99999C1.24984 7.07106 2.92877 8.74999 4.99984 8.74999ZM3.62775 6.96127L4.99979 5.58924L6.37183 6.96127L6.96109 6.37202L5.58905 4.99998L6.96109 3.62794L6.37183 3.03869L4.99979 4.41072L3.62775 3.03869L3.0385 3.62794L4.41054 4.99998L3.0385 6.37202L3.62775 6.96127Z"
                              fill="#F44242"
                            ></path>
                          </svg>
                          <span class="text">{{ memoError }}</span>
                        </div>
                        <label>MEMO/Tag для {{ rateTo.label }}</label>
                        <div class="q-field-success hidden">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22ZM11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20ZM14.2929 7.29289L9 12.5858L6.70711 10.2929L5.29289 11.7071L9 15.4142L15.7071 8.70711L14.2929 7.29289Z"
                              fill="#0BB526"
                            ></path>
                          </svg>
                        </div>
                        <input
                          name="memo"
                          id="memo"
                          v-model="memo"
                          placeholder="Введите MEMO/Tag (если требуется)"
                          class="js-order-field"
                        />
                      </div>

                      <!-- Информация о подтверждениях для валют с MEMO -->
                      <div v-if="showMemoField" class="label-field">
                        <label>
                          <strong>Важно:</strong> Для
                          {{ rateTo.label }} рекомендуется указывать MEMO/Tag.
                          Если ваш кошелек/биржа требует MEMO - обязательно его
                          укажите.
                        </label>
                      </div>

                      <div class="field">
                        <div
                          v-if="emailError"
                          class="exchange__error js-exchange-error"
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M4.99984 9.58332C2.46853 9.58332 0.416504 7.53129 0.416504 4.99999C0.416504 2.46868 2.46853 0.416656 4.99984 0.416656C7.53114 0.416656 9.58317 2.46868 9.58317 4.99999C9.58317 7.53129 7.53114 9.58332 4.99984 9.58332ZM4.99984 8.74999C7.07091 8.74999 8.74984 7.07106 8.74984 4.99999C8.74984 2.92892 7.07091 1.24999 4.99984 1.24999C2.92877 1.24999 1.24984 2.92892 1.24984 4.99999C1.24984 7.07106 2.92877 8.74999 4.99984 8.74999ZM3.62775 6.96127L4.99979 5.58924L6.37183 6.96127L6.96109 6.37202L5.58905 4.99998L6.96109 3.62794L6.37183 3.03869L4.99979 4.41072L3.62775 3.03869L3.0385 3.62794L4.41054 4.99998L3.0385 6.37202L3.62775 6.96127Z"
                              fill="#F44242"
                            ></path>
                          </svg>
                          <span class="text">{{ emailError }}</span>
                        </div>
                        <label>Ваш E-mail</label>
                        <div class="q-field-success hidden">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22ZM11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20ZM14.2929 7.29289L9 12.5858L6.70711 10.2929L5.29289 11.7071L9 15.4142L15.7071 8.70711L14.2929 7.29289Z"
                              fill="#0BB526"
                            ></path>
                          </svg>
                        </div>
                        <input
                          name="email"
                          id="email"
                          type="email"
                          v-model="email"
                          placeholder="Ваш email адрес"
                        />
                      </div>
                      <div class="field">
                        <label>Ваш номер телефона</label>
                        <div class="q-field-success hidden">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22ZM11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20ZM14.2929 7.29289L9 12.5858L6.70711 10.2929L5.29289 11.7071L9 15.4142L15.7071 8.70711L14.2929 7.29289Z"
                              fill="#0BB526"
                            ></path>
                          </svg>
                        </div>
                        <input
                          name="phone"
                          id="number"
                          type="number"
                          v-model="number"
                          placeholder="Ваш номер телефона"
                        />
                        <div v-if="numberError" class="exchange__error js-exchange-error">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.99984 9.58332C2.46853 9.58332 0.416504 7.53129 0.416504 4.99999C0.416504 2.46868 2.46853 0.416656 4.99984 0.416656C7.53114 0.416656 9.58317 2.46868 9.58317 4.99999C9.58317 7.53129 7.53114 9.58332 4.99984 9.58332ZM4.99984 8.74999C7.07091 8.74999 8.74984 7.07106 8.74984 4.99999C8.74984 2.92892 7.07091 1.24999 4.99984 1.24999C2.92877 1.24999 1.24984 2.92892 1.24984 4.99999C1.24984 7.07106 2.92877 8.74999 4.99984 8.74999ZM3.62775 6.96127L4.99979 5.58924L6.37183 6.96127L6.96109 6.37202L5.58905 4.99998L6.96109 3.62794L6.37183 3.03869L4.99979 4.41072L3.62775 3.03869L3.0385 3.62794L4.41054 4.99998L3.0385 6.37202L3.62775 6.96127Z" fill="#F44242"></path>
                          </svg>
                          <span class="text">{{ numberError }}</span>
                        </div>
                      </div>

                      <div class="field footer-fields display-flex">
                        <label class="checkbox-inline">
                          <div class="custom-checkbox-block">
                            <div class="custom-checkbox">
                              <input
                                type="checkbox"
                                name=""
                                id="w0"
                                value="1"
                                class="js-checkbox-admire"
                                v-model="termsAccepted"
                              />
                              <label for="w0"></label>
                            </div>
                            <label class="label-text"
                              ><span
                                >Я согласен с
                                <a href="/terms" target="_blank">
                                  Условия пользования</a
                                >,
                                <a href="/docs/how-it-works" target="_blank"
                                  >Как это работает</a
                                >
                                и
                                <a href="/privacy-policy" target="_blank"
                                  >Политика конфиденциальности</a
                                >
                              </span></label
                            >
                          </div>
                          <div class="clear-xs"></div>

                          <div class="custom-checkbox-block">
                            <div class="custom-checkbox">
                              <input
                                type="checkbox"
                                name=""
                                id="w1"
                                value="1"
                                class="js-checkbox-admire"
                                v-model="amlKycAccepted"
                              />
                              <label for="w1"></label>
                            </div>
                            <label class="label-text"
                              ><span
                                >Я согласен с
                                <a href="/kyc" target="_blank">AML/KYC</a>
                              </span></label
                            >
                          </div>
                          <div class="clear-xs"></div>
                        </label>
                        <div class="flex-grow-1"></div>
                        <button
                          @click="handleCreateOrder"
                          type="button"
                          :class="['button','exchange-button','js-submit-order-send', { 'is-disabled': !isFormValid }]"
                          :disabled="!isFormValid"
                        >
                          <i class="fa fa-refresh fa-spin"></i>
                          <span>Далее</span>
                        </button>
                      </div>

                      <div class="label-field">
                        <label v-if="rateTo.label">
                          Необходимо подтверждений для {{ rateTo.label }}:
                          {{
                            rateTo.label === "BTC"
                              ? "1"
                              : rateTo.label === "ETH"
                              ? "12"
                              : rateTo.label === "XRP"
                              ? "1"
                              : "3"
                          }}
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="order-info">
              <p>
                Курс может измениться и сумма к получению является
                предварительной.
              </p>
              <p>
                Курс будет зафиксирован по рыночному курсу на бирже HTX, Kucoin,
                когда ваша транзакция наберет необходимое количество
                подтверждений в сети блокчейн.
              </p>
            </div>
          </div>
          <!--start details-->
          <div class="order__detail">
            <div class="order__detail-step display-flex">
              <div><span class="active">1</span>Создание обмена</div>
              <div><span class="">2</span>Ожидание оплаты</div>
              <div><span class="">3</span>Обмен</div>
            </div>
            <div class="order__detail-text display-flex">
              <div v-if="showMemoField">
                <span
                  >⚠️ Рекомендуется указать MEMO/Tag для
                  {{ rateTo.label }}</span
                >
              </div>
              <div>
                <span>Обменный курс: </span
                ><span class="details__rate" id="details__rate">
                  1 {{ rateFrom.label }} ~ {{ rateTo.label }}
                  {{ calculatedRate }}</span
                >
              </div>
              <div>
                <span>Ожидаемая длительность обмена: </span>~ 5-30 минут
              </div>
              <div>
                <span
                  >Обратите внимание, что время обмена зависит от скорости
                  работы наших партнеров и общей загруженности
                  блокчейн-сетей.</span
                >
              </div>
              <div>
                Если у вас есть какие-либо вопросы, пожалуйста, свяжитесь с
                нашей службой поддержки:
                <a class="support-link" href="https://t.me/bitratex_support"
                  >@bitratex_support</a
                >
              </div>
            </div>
          </div>
          <!--end details-->
        </div>
      </div>
    </div>
    <!--end promo-->
  </main>
</template>
<style>
.exchange-button.is-disabled,
.exchange-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(0.2);
}
</style>
