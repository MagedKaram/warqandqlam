"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { PiShoppingCartSimple } from "react-icons/pi";
import { useCart } from "@/components/cart/CartProvider";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { DeliveryForm } from "@/components/checkout/DeliveryForm";
import { OrderReview } from "@/components/checkout/OrderReview";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { BankCardFlow } from "@/components/checkout/payment-flows/BankCardFlow";
import { CashOnDeliveryFlow } from "@/components/checkout/payment-flows/CashOnDeliveryFlow";
import { InstapayFlow } from "@/components/checkout/payment-flows/InstapayFlow";
import { PaymentFlowPlaceholder } from "@/components/checkout/payment-flows/PaymentFlowPlaceholder";
import { PaymentProcessingStatus } from "@/components/checkout/payment-flows/PaymentProcessingStatus";
import { VodafoneCashFlow } from "@/components/checkout/payment-flows/VodafoneCashFlow";
import {
  checkoutReducer,
  createInitialCheckoutState,
  validateDeliveryInformation,
} from "@/lib/checkout/checkout-reducer";
import {
  clearCheckoutRetryContext,
  clearBankCardCheckoutDraft,
  clearInstapayCheckoutDraft,
  loadBankCardCheckoutDraft,
  loadCheckoutRetryContext,
  loadInstapayCheckoutDraft,
  saveCheckoutRetryContext,
  saveBankCardCheckoutDraft,
  saveInstapayCheckoutDraft,
} from "@/lib/checkout/checkout-draft-storage";
import {
  loadSavedDeliveryInformation,
  saveLatestPrototypeOrder,
  syncSavedDeliveryPreference,
} from "@/lib/checkout/checkout-storage";
import { getPaymentMethod } from "@/lib/checkout/payment-methods";
import { createPrototypeOrder } from "@/lib/checkout/prototype-order";
import {
  BANK_CARD_CONFIG,
  validateBankCardDetails,
} from "@/lib/checkout/bank-card";
import {
  INSTAPAY_CONFIG,
  validateInstapayDetails,
} from "@/lib/checkout/instapay";
import { validateVodafoneCashDetails } from "@/lib/checkout/vodafone-cash";
import type {
  CheckoutAction,
  CheckoutState,
} from "@/lib/checkout/checkout-reducer";
import type {
  BankCardField,
  CheckoutRetryContext,
  DeliveryInformation,
  InstapayReceiptMetadata,
  InstapayTextField,
  PrototypePaymentDetails,
  VodafoneCashTextField,
  VodafoneReceiptMetadata,
} from "@/types/checkout";

function createCheckoutRetryContext(
  state: CheckoutState,
): CheckoutRetryContext {
  const delivery = { ...state.delivery };

  if (state.paymentMethod === "vodafone_cash") {
    return {
      paymentMethod: "vodafone_cash",
      resumeStep: "order_review",
      delivery,
      details: {
        ...state.vodafoneCashDetails,
        receipt: state.vodafoneCashDetails.receipt
          ? { ...state.vodafoneCashDetails.receipt }
          : null,
      },
    };
  }

  if (state.paymentMethod === "instapay") {
    return {
      paymentMethod: "instapay",
      resumeStep: "order_review",
      delivery,
      details: {
        ...state.instapayDetails,
        receipt: state.instapayDetails.receipt
          ? { ...state.instapayDetails.receipt }
          : null,
      },
    };
  }

  if (state.paymentMethod === "bank_card") {
    return {
      paymentMethod: "bank_card",
      resumeStep: "payment_details",
      delivery,
    };
  }

  return {
    paymentMethod: "cash_on_delivery",
    resumeStep: "payment_selection",
    delivery,
  };
}

function CheckoutLoadingState() {
  return (
    <section
      aria-label="جارٍ تحميل إتمام الطلب"
      className="mx-auto min-h-[640px] w-full max-w-[1240px] animate-pulse px-4 py-16 md:px-6"
    >
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,470px)]">
        <div className="h-[720px] rounded-lg bg-cool-200" />
        <div className="h-[540px] rounded-lg bg-cool-200" />
      </div>
    </section>
  );
}

function EmptyCheckout() {
  return (
    <main className="flex min-h-[600px] items-center justify-center px-4 py-20 text-center">
      <div className="min-w-0 max-w-xl">
        <PiShoppingCartSimple
          aria-hidden
          className="mx-auto text-[6rem] text-auth-muted"
        />
        <h1 className="mt-6 font-heading text-4xl font-bold text-auth-ink">
          لا يمكن إتمام طلب فارغ
        </h1>
        <p className="mt-4 text-base font-semibold leading-8 text-auth-muted">
          ارجع إلى سلة التسوق وأضف منتجًا أو طلب طباعة قبل المتابعة.
        </p>
        <Link
          className="mt-7 inline-flex h-12 min-w-56 items-center justify-center rounded-md bg-auth-accent px-6 text-base font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
          href="/cart"
          prefetch={false}
        >
          العودة إلى السلة
        </Link>
      </div>
    </main>
  );
}

export function CheckoutPageClient() {
  const router = useRouter();
  const cart = useCart();
  const [state, dispatch] = useReducer(
    checkoutReducer,
    undefined,
    createInitialCheckoutState,
  );
  const submittingRef = useRef(false);
  const focusPaymentSelectionRef = useRef(false);
  const selectedPaymentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedDelivery = loadSavedDeliveryInformation();
    if (savedDelivery) {
      dispatch({ type: "saved_delivery_loaded", delivery: savedDelivery });
    }

    const retryContext = loadCheckoutRetryContext();
    if (retryContext) {
      dispatch({ type: "checkout_retry_context_loaded", context: retryContext });
      clearCheckoutRetryContext();
    } else {
      const bankCardDraft = loadBankCardCheckoutDraft();
      const instapayDraft = loadInstapayCheckoutDraft();
      if (bankCardDraft) {
        dispatch({ type: "bank_card_draft_loaded", draft: bankCardDraft });
      } else if (instapayDraft) {
        dispatch({ type: "instapay_draft_loaded", draft: instapayDraft });
      }
    }

    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.get("changePayment") === "1") {
      focusPaymentSelectionRef.current = true;
      dispatch({ type: "payment_method_change_requested" });
      currentUrl.searchParams.delete("changePayment");
      window.history.replaceState(
        window.history.state,
        "",
        `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
      );
    }

    dispatch({ type: "checkout_storage_hydrated" });
  }, []);

  useEffect(() => {
    if (
      !cart.hydrated ||
      !state.storageHydrated ||
      state.step !== "payment_selection" ||
      !focusPaymentSelectionRef.current
    ) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const selectedPaymentInput = selectedPaymentInputRef.current;
      if (!selectedPaymentInput) {
        return;
      }

      selectedPaymentInput.focus();
      focusPaymentSelectionRef.current = false;
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [
    cart.hydrated,
    state.paymentMethod,
    state.step,
    state.storageHydrated,
  ]);

  useEffect(() => {
    if (!state.storageHydrated) {
      return;
    }

    if (cart.hydrated && cart.state.items.length === 0) {
      clearBankCardCheckoutDraft();
      clearInstapayCheckoutDraft();
      clearCheckoutRetryContext();
      return;
    }

    if (state.step === "success") {
      clearCheckoutRetryContext();
    }

    if (state.paymentMethod === "bank_card") {
      clearInstapayCheckoutDraft();

      if (state.step === "success") {
        clearBankCardCheckoutDraft();
        return;
      }

      saveBankCardCheckoutDraft({
        paymentMethod: "bank_card",
        resumeStep:
          state.step === "payment_selection"
            ? "payment_selection"
            : "payment_details",
        delivery: { ...state.delivery },
      });
      return;
    }

    clearBankCardCheckoutDraft();

    if (state.paymentMethod !== "instapay") {
      clearInstapayCheckoutDraft();
      return;
    }

    if (state.step === "success") {
      clearInstapayCheckoutDraft();
      return;
    }

    saveInstapayCheckoutDraft({
      paymentMethod: "instapay",
      resumeStep:
        state.step === "payment_selection"
          ? "payment_selection"
          : state.step === "order_review" ||
        state.step === "processing" ||
        state.step === "failure"
          ? "order_review"
          : "payment_details",
      delivery: { ...state.delivery },
      details: {
        ...state.instapayDetails,
        receipt: state.instapayDetails.receipt
          ? { ...state.instapayDetails.receipt }
          : null,
      },
    });
  }, [
    cart.hydrated,
    cart.state.items.length,
    state.delivery,
    state.instapayDetails,
    state.paymentMethod,
    state.storageHydrated,
    state.step,
  ]);

  useEffect(() => {
    if (state.step !== "processing" || submittingRef.current) {
      return;
    }

    saveCheckoutRetryContext(createCheckoutRetryContext(state));

    function completePrototypeOrder() {
      if (submittingRef.current) {
        return;
      }

      submittingRef.current = true;

      if (cart.state.items.length === 0) {
        dispatch({
          type: "order_failed",
          message: "تعذر إتمام الطلب لأن سلة التسوق فارغة.",
        });
        router.push("/order/failed");
        return;
      }

      let paymentDetails: PrototypePaymentDetails | undefined;

      if (state.paymentMethod === "vodafone_cash") {
        const validation = validateVodafoneCashDetails(
          state.vodafoneCashDetails,
        );
        const receipt = state.vodafoneCashDetails.receipt;

        if (!validation.valid || !receipt) {
          dispatch({
            type: "order_failed",
            message:
              "تعذر تأكيد بيانات فودافون كاش. لم يتم مسح سلة التسوق.",
          });
          router.push("/order/failed");
          return;
        }

        paymentDetails = {
          kind: "vodafone_cash",
          senderName: state.vodafoneCashDetails.senderName.trim(),
          senderPhoneLastFour:
            state.vodafoneCashDetails.senderPhoneLastFour,
          receipt: { ...receipt },
        };
      } else if (state.paymentMethod === "instapay") {
        const validation = validateInstapayDetails(state.instapayDetails);
        const receipt = state.instapayDetails.receipt;

        if (!validation.valid || !receipt) {
          dispatch({
            type: "order_failed",
            message:
              "تعذر تأكيد بيانات Instapay. لم يتم مسح سلة التسوق.",
          });
          router.push("/order/failed");
          return;
        }

        paymentDetails = {
          kind: "instapay",
          senderName: state.instapayDetails.senderName.trim(),
          senderPhoneLastFour: state.instapayDetails.senderPhoneLastFour,
          receipt: { ...receipt },
        };
      } else if (state.paymentMethod === "bank_card") {
        if (!state.bankCardMetadata) {
          dispatch({
            type: "order_failed",
            message:
              "تعذر تأكيد بيانات البطاقة. لم يتم مسح سلة التسوق.",
          });
          router.push("/order/failed");
          return;
        }

        paymentDetails = { ...state.bankCardMetadata };
      }

      const order = createPrototypeOrder({
        delivery: state.delivery,
        items: cart.state.items,
        paymentMethod: state.paymentMethod,
        paymentDetails,
        totals: cart.totals,
      });

      if (!saveLatestPrototypeOrder(order)) {
        dispatch({
          type: "order_failed",
          message: "تعذر حفظ الطلب على هذا الجهاز. لم يتم مسح السلة.",
        });
        router.push("/order/failed");
        return;
      }

      syncSavedDeliveryPreference(state.delivery);
      clearBankCardCheckoutDraft();
      clearInstapayCheckoutDraft();
      clearCheckoutRetryContext();
      dispatch({ type: "order_succeeded", order });
      cart.clearCart();
      router.push("/order/success");
    }

    if (
      state.paymentMethod === "instapay" ||
      state.paymentMethod === "bank_card"
    ) {
      const delay =
        state.paymentMethod === "instapay"
          ? INSTAPAY_CONFIG.prototypeProcessingDelayMs
          : BANK_CARD_CONFIG.prototypeProcessingDelayMs;
      const timeoutId = window.setTimeout(
        completePrototypeOrder,
        delay,
      );
      return () => window.clearTimeout(timeoutId);
    }

    completePrototypeOrder();
  }, [
    cart,
    router,
    state,
  ]);

  const selectedPaymentMethod = useMemo(
    () => getPaymentMethod(state.paymentMethod),
    [state.paymentMethod],
  );

  function updateDelivery<Field extends keyof DeliveryInformation>(
    field: Field,
    value: DeliveryInformation[Field],
  ) {
    dispatch({ type: "delivery_field_updated", field, value } as CheckoutAction);
  }

  function updateVodafoneCashText(
    field: VodafoneCashTextField,
    value: string,
  ) {
    dispatch({
      type: "vodafone_cash_text_updated",
      field,
      value,
    } as CheckoutAction);
  }

  function updateVodafoneCashReceipt(
    receipt: VodafoneReceiptMetadata | null,
    error?: string,
  ) {
    dispatch({ type: "vodafone_cash_receipt_updated", receipt, error });
  }

  function updateInstapayText(field: InstapayTextField, value: string) {
    dispatch({
      type: "instapay_text_updated",
      field,
      value,
    } as CheckoutAction);
  }

  function updateInstapayReceipt(
    receipt: InstapayReceiptMetadata | null,
    error?: string,
  ) {
    dispatch({ type: "instapay_receipt_updated", receipt, error });
  }

  function updateBankCardField(field: BankCardField, value: string) {
    dispatch({
      type: "bank_card_field_updated",
      field,
      value,
    } as CheckoutAction);
  }

  function handleChangePaymentMethod() {
    if (state.step === "processing" || submittingRef.current) {
      return;
    }

    focusPaymentSelectionRef.current = true;
    dispatch({ type: "payment_method_change_requested" });
  }

  function handleCheckoutSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.step === "processing" || submittingRef.current) {
      return;
    }

    const validation = validateDeliveryInformation(state.delivery);
    dispatch({ type: "delivery_submitted" });

    if (!validation.valid) {
      requestAnimationFrame(() => {
        const invalidField = document.querySelector<HTMLElement>(
          "#checkout-form [aria-invalid='true']",
        );
        invalidField?.focus();
      });
      return;
    }

    syncSavedDeliveryPreference(state.delivery);
    dispatch({ type: "payment_submitted" });
  }

  function handleVodafoneCashSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.step !== "payment_details" || submittingRef.current) {
      return;
    }

    const validation = validateVodafoneCashDetails(
      state.vodafoneCashDetails,
    );
    dispatch({ type: "vodafone_cash_details_submitted" });

    if (!validation.valid) {
      requestAnimationFrame(() => {
        const invalidField = document.querySelector<HTMLElement>(
          "#vodafone-cash-form [aria-invalid='true']",
        );
        invalidField?.focus();
      });
    }
  }

  function handleInstapaySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.step !== "payment_details" || submittingRef.current) {
      return;
    }

    const validation = validateInstapayDetails(state.instapayDetails);
    dispatch({ type: "instapay_details_submitted" });

    if (!validation.valid) {
      requestAnimationFrame(() => {
        const invalidField = document.querySelector<HTMLElement>(
          "#instapay-form [aria-invalid='true']",
        );
        invalidField?.focus();
      });
    }
  }

  function handleBankCardSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.step !== "payment_details" || submittingRef.current) {
      return;
    }

    const validation = validateBankCardDetails(state.bankCardDetails);
    dispatch({ type: "bank_card_details_submitted" });

    if (!validation.valid) {
      requestAnimationFrame(() => {
        const invalidField = document.querySelector<HTMLElement>(
          "#bank-card-form [aria-invalid='true']",
        );
        invalidField?.focus();
      });
    }
  }

  function handleOrderReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.step !== "order_review" || submittingRef.current) {
      return;
    }

    dispatch({ type: "order_review_submitted" });
  }

  if (!cart.hydrated) {
    return <CheckoutLoadingState />;
  }

  if (cart.state.items.length === 0) {
    return <EmptyCheckout />;
  }

  const paymentPending =
    selectedPaymentMethod.availability === "pending_approved_flow";
  const processing = state.step === "processing";
  const showVodafoneDetails =
    state.paymentMethod === "vodafone_cash" &&
    state.step === "payment_details";
  const showInstapayDetails =
    state.paymentMethod === "instapay" && state.step === "payment_details";
  const showBankCardDetails =
    state.paymentMethod === "bank_card" && state.step === "payment_details";
  const isTransferPayment =
    state.paymentMethod === "vodafone_cash" ||
    state.paymentMethod === "instapay";
  const usesOrderReview =
    isTransferPayment || state.paymentMethod === "bank_card";
  const showOrderReview = usesOrderReview && state.step === "order_review";
  const showVodafoneProcessingReview =
    state.paymentMethod === "vodafone_cash" && processing;
  const showInstapayProcessing =
    state.paymentMethod === "instapay" && processing;
  const showBankCardProcessing =
    state.paymentMethod === "bank_card" && processing;
  const reviewSummary =
    showOrderReview ||
    showVodafoneProcessingReview ||
    showInstapayProcessing ||
    showBankCardProcessing;

  const summaryFormId = showVodafoneDetails
    ? "vodafone-cash-form"
    : showInstapayDetails
      ? "instapay-form"
      : showBankCardDetails
        ? "bank-card-form"
        : showOrderReview || showVodafoneProcessingReview
          ? "order-review-form"
          : "checkout-form";

  const primaryActionLabel = processing
    ? "جارٍ تأكيد الطلب..."
    : paymentPending
      ? "طريقة الدفع قيد الإعداد"
      : showVodafoneDetails
        ? "ادفع"
        : showInstapayDetails
          ? INSTAPAY_CONFIG.detailsActionLabel
          : showBankCardDetails
            ? BANK_CARD_CONFIG.detailsActionLabel
            : usesOrderReview && !showOrderReview
              ? "المتابعة للدفع"
              : "تأكيد الطلب";

  const secondaryAction = showOrderReview ? (
    <button
      className="h-12 w-full rounded-md border border-auth-ink bg-white px-6 text-base font-bold text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
      disabled={processing}
      onClick={() => dispatch({ type: "delivery_edit_requested" })}
      type="button"
    >
      تعديل معلومات التوصيل
    </button>
  ) : showVodafoneDetails ||
    showInstapayDetails ||
    showBankCardDetails ||
    usesOrderReview ||
    processing ? null : (
    <Link
      className="inline-flex h-12 w-full items-center justify-center rounded-md border border-auth-ink bg-white px-6 text-base font-bold text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
      href="/cart"
      prefetch={false}
    >
      العودة إلى السلة
    </Link>
  );

  return (
    <main className="min-w-0 flex-1 bg-white text-foreground" data-checkout-page>
      <section className="px-4 pb-20 pt-12 md:px-6 md:pt-8">
        <div className="mx-auto grid w-full min-w-0 max-w-[1240px] items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,460px)] lg:gap-8 xl:grid-cols-[minmax(0,700px)_minmax(0,460px)] xl:gap-[80px]">
          <div
            className={`min-w-0 lg:col-start-1 lg:row-start-1 ${
              showBankCardDetails ? "lg:pt-10" : ""
            }`}
          >
            {showVodafoneDetails ? (
              <form
                className="min-w-0"
                id="vodafone-cash-form"
                noValidate
                onSubmit={handleVodafoneCashSubmit}
              >
                <VodafoneCashFlow
                  details={state.vodafoneCashDetails}
                  errors={state.vodafoneCashErrors}
                  onChangePaymentMethod={handleChangePaymentMethod}
                  onReceiptChange={updateVodafoneCashReceipt}
                  onTextChange={updateVodafoneCashText}
                />
              </form>
            ) : showInstapayDetails ? (
              <form
                className="min-w-0"
                id="instapay-form"
                noValidate
                onSubmit={handleInstapaySubmit}
              >
                <InstapayFlow
                  details={state.instapayDetails}
                  errors={state.instapayErrors}
                  onChangePaymentMethod={handleChangePaymentMethod}
                  onReceiptChange={updateInstapayReceipt}
                  onTextChange={updateInstapayText}
                />
              </form>
            ) : showBankCardDetails ? (
              <form
                className="min-w-0"
                id="bank-card-form"
                noValidate
                onSubmit={handleBankCardSubmit}
              >
                <BankCardFlow
                  details={state.bankCardDetails}
                  errors={state.bankCardErrors}
                  onChangePaymentMethod={handleChangePaymentMethod}
                  onFieldChange={updateBankCardField}
                  onSaveForLaterChange={(checked) =>
                    dispatch({
                      type: "bank_card_save_for_later_updated",
                      checked,
                    })
                  }
                  saveForLater={state.bankCardSaveForLater}
                />
              </form>
            ) : showInstapayProcessing ? (
              <PaymentProcessingStatus paymentMethod="instapay" />
            ) : showBankCardProcessing ? (
              <PaymentProcessingStatus paymentMethod="bank_card" />
            ) : showOrderReview || showVodafoneProcessingReview ? (
              <form
                className="min-w-0"
                id="order-review-form"
                onSubmit={handleOrderReviewSubmit}
              >
                <OrderReview
                  canChangePaymentMethod={!processing}
                  delivery={state.delivery}
                  onChangePaymentMethod={handleChangePaymentMethod}
                  paymentMethodId={state.paymentMethod}
                  paymentMethodLabel={selectedPaymentMethod.label}
                  safeCardMetadata={state.bankCardMetadata}
                />
              </form>
            ) : (
              <form
                className="min-w-0"
                id="checkout-form"
                noValidate
                onSubmit={handleCheckoutSubmit}
              >
                <DeliveryForm
                  delivery={state.delivery}
                  errors={state.deliveryErrors}
                  onChange={updateDelivery}
                />

                <PaymentMethodSelector
                  onSelect={(paymentMethod) =>
                    dispatch({ type: "payment_method_selected", paymentMethod })
                  }
                  selectedMethod={state.paymentMethod}
                  selectedInputRef={selectedPaymentInputRef}
                />

                {state.paymentMethod === "cash_on_delivery" ? (
                  <CashOnDeliveryFlow />
                ) : paymentPending ? (
                  <PaymentFlowPlaceholder method={selectedPaymentMethod} />
                ) : null}
              </form>
            )}
          </div>

          <div
            className={`min-w-0 lg:col-start-2 lg:row-start-1 ${
              showBankCardDetails ? "lg:pt-[115px]" : "lg:pt-[75px]"
            }`}
          >
            <OrderSummary
              appliedCoupon={cart.appliedCoupon}
              items={cart.state.items}
              onApplyCoupon={cart.setCoupon}
              onRemoveCoupon={() => cart.setCoupon(null)}
              printingAggregate={cart.printingAggregate}
              primaryAction={
                <button
                  className="h-12 w-full rounded-md bg-auth-accent px-6 text-base font-bold text-white transition hover:bg-auth-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
                  disabled={processing || paymentPending}
                  form={summaryFormId}
                  type="submit"
                >
                  {primaryActionLabel}
                </button>
              }
              secondaryAction={secondaryAction}
              showCoupon={!reviewSummary}
              showFreeShippingMessage={!reviewSummary}
              showItems
              totals={cart.totals}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
