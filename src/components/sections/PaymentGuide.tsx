import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/i18n";

type Section = {
  heading: string;
  body?: ReactNode;
  steps?: string[];
  note?: string;
};

type Content = {
  title: string;
  subtitle: string;
  intro: string;
  why: { title: string; items: string[] };
  prep: Section;
  wechat: { title: string; register: Section; bindCard: Section; verify: Section; pay: Section };
  alipay: { title: string; register: Section; bindCard: Section; tip: string };
  scenarios: { title: string; items: { name: string; text: string }[] };
  fees: { title: string; rows: { label: string; w: string; a: string }[] };
  safety: { title: string; items: string[] };
  faq: { title: string; items: { q: string; a: string }[] };
  summary: { title: string; items: string[] };
};

const en: Content = {
  title: "Mobile Payment Guide for Foreign Visitors",
  subtitle: "A complete walkthrough for WeChat Pay & Alipay (2026 Edition)",
  intro:
    "Welcome to China! China is a near-cashless society — from street food to luxury malls, subway rides to hotels, almost everything can be paid via phone. This guide walks you through setting up the two dominant platforms: WeChat Pay and Alipay.",
  why: {
    title: "Why you need WeChat Pay & Alipay",
    items: [
      "Many merchants no longer accept cash.",
      "QR-code payment covers 99%+ of transactions.",
      "No more change or counterfeit-bill risk.",
      "Transparent FX — charged directly to your foreign card at the live rate.",
      "Tickets, high-speed rail, food delivery often require in-app payment.",
    ],
  },
  prep: {
    heading: "Before you go",
    steps: [
      "Smartphone running iOS 13+ or Android 8.0+.",
      "International card (Visa / Mastercard / JCB / Amex).",
      "Valid passport (for identity verification).",
      "Phone number that can receive SMS — roaming or a local SIM.",
      "Pre-install WeChat and Alipay from the App Store / Google Play.",
    ],
    note:
      "Tip: buy a local SIM at the airport (China Mobile / Unicom / Telecom). Monthly plans are ¥30–100 and include data + SMS.",
  },
  wechat: {
    title: "WeChat Pay",
    register: {
      heading: "1. Download & register",
      steps: [
        "Search \"WeChat\" in the App Store / Google Play and install.",
        "Open the app and tap Sign Up.",
        "Choose phone-number registration and enter your number.",
        "Set a password (8–16 chars, letters + numbers).",
        "Accept the Terms and tap Register, then enter the SMS code.",
        "Complete the slider / captcha verification.",
      ],
      note:
        "WeChat may require a friend-assisted scan to finish signup. Ask an existing WeChat user to help verify if prompted.",
    },
    bindCard: {
      heading: "2. Bind an international card",
      steps: [
        "Tap Me → Services → Wallet.",
        "Tap Bank Cards → Add Bank Card.",
        "Set a 6-digit payment PIN (remember it!).",
        "Enter cardholder name (exactly as on passport), card number, expiry, CVV.",
        "Enter the SMS code from your bank to confirm.",
        "Done — your card appears in the list.",
      ],
    },
    verify: {
      heading: "3. Real-name verification",
      steps: [
        "Go to Me → Services → ··· → Real-Name Verification.",
        "Choose Passport and upload your passport photo page.",
        "Confirm name, nationality and passport number.",
        "Wait a few minutes for approval.",
      ],
    },
    pay: {
      heading: "4. Making a payment",
      steps: [
        "Show your code: Me → Services → Money → tap the barcode icon, then show to the merchant.",
        "Scan to pay: tap + (top right) → Scan, point at the merchant's QR, enter the amount and confirm.",
        "Transfer to a person: in chat tap + → Transfer, enter the amount, confirm with PIN / Face ID.",
      ],
    },
  },
  alipay: {
    title: "Alipay",
    register: {
      heading: "1. Download & register",
      steps: [
        "Search \"Alipay\" in the App Store / Google Play and install.",
        "Tap Sign Up → International phone number.",
        "Enter your number, receive the SMS code, set a login password.",
        "Switch the UI to English from Me → Settings → General → Language if needed.",
      ],
    },
    bindCard: {
      heading: "2. Bind an international card (TourPass)",
      steps: [
        "Tap Me → Bank Cards → Add.",
        "Choose International Card and enter card details.",
        "Verify with the SMS code from your bank.",
        "Done — Alipay supports Visa, Mastercard, JCB, Diners, Discover.",
      ],
    },
    tip: "Search \"TourPass\" inside Alipay for the dedicated tourist mini-program with English UI, transport cards and FX preview.",
  },
  scenarios: {
    title: "Common scenarios",
    items: [
      { name: "Restaurants", text: "Either scan the table QR to order & pay, or scan the cashier QR and enter the amount." },
      { name: "Convenience stores / supermarkets", text: "Show your payment code at checkout — the cashier scans it." },
      { name: "Taxi / DiDi", text: "Scan the driver's QR (taxi) or pay automatically in DiDi (ride-hail)." },
      { name: "Hotels", text: "Most accept WeChat / Alipay for room charges and deposit." },
      { name: "Attractions", text: "Book tickets via Alipay or WeChat mini-programs; enter with QR or passport." },
      { name: "Street food / night markets", text: "Scan the merchant's printed QR, enter the amount, show the success screen." },
    ],
  },
  fees: {
    title: "Fees & limits",
    rows: [
      { label: "Single tx under ¥200", w: "No fee", a: "No fee" },
      { label: "Single tx over ¥200", w: "≈ 3% FX/processing", a: "≈ 3% FX/processing" },
      { label: "Single-tx limit", w: "¥6,000", a: "¥5,000" },
      { label: "Daily limit", w: "¥6,000", a: "¥10,000" },
      { label: "Monthly cumulative", w: "≈ ¥50,000", a: "≈ ¥50,000" },
    ],
  },
  safety: {
    title: "Safety tips",
    items: [
      "Never share your payment PIN — official support will never ask for it.",
      "Enable fingerprint / Face ID in Payment Settings.",
      "Keep some cash (¥200–500) as a backup.",
      "Double-check the amount before confirming.",
      "Beware of fake QR stickers in tourist areas — confirm the merchant name on screen.",
    ],
  },
  faq: {
    title: "FAQ",
    items: [
      { q: "Can I bind the same card to both apps?", a: "Yes — same international card works on both with no conflict." },
      { q: "Which currency am I charged in?", a: "The amount is shown in CNY; your bank converts to your card's settlement currency at the live FX rate." },
      { q: "Can I get tax refunds?", a: "Yes — foreign visitors can claim VAT refunds at the airport for eligible purchases (¥500+ from authorised stores)." },
      { q: "Who do I contact for issues?", a: "WeChat Pay: +86-755-83765566. Alipay: +86-571-95188, or Me → My Customer Service in-app." },
    ],
  },
  summary: {
    title: "Quick-start checklist",
    items: [
      "Before arrival: install WeChat & Alipay.",
      "On arrival: buy a local SIM card.",
      "Immediately: bind international card + complete real-name verification.",
      "Practise: try a small ¥1–5 transaction at a convenience store.",
      "Keep ¥200–500 cash as backup for edge cases.",
    ],
  },
};

const zh: Content = {
  title: "外国游客中国移动支付指南",
  subtitle: "微信支付 & 支付宝 完整教程（2026 版）",
  intro:
    "欢迎来到中国！中国已进入近乎无现金的社会——从街头小吃到高端商场、从地铁到酒店，几乎所有消费都可以通过手机完成。本指南将手把手教你设置中国最主流的两大支付平台：微信支付与支付宝。",
  why: {
    title: "为什么需要微信支付和支付宝",
    items: [
      "许多商家不再接受现金。",
      "扫码支付覆盖 99% 以上消费场景。",
      "无需找零，避免假币风险。",
      "汇率透明，按实时汇率从国际卡直接扣款。",
      "门票、高铁、外卖等许多服务必须在线支付。",
    ],
  },
  prep: {
    heading: "出发前的准备",
    steps: [
      "智能手机：iOS 13+ 或 Android 8.0+。",
      "国际银行卡：Visa / Mastercard / JCB / Amex。",
      "有效护照（用于实名认证）。",
      "可接收短信的手机号（国际漫游或中国本地 SIM 卡）。",
      "提前在 App Store / Google Play 下载微信和支付宝。",
    ],
    note:
      "建议：抵达后在机场购买本地 SIM 卡（移动 / 联通 / 电信），月费约 ¥30–100，含流量与短信。",
  },
  wechat: {
    title: "微信支付 WeChat Pay",
    register: {
      heading: "1. 下载与注册",
      steps: [
        "在 App Store / Google Play 搜索 \"WeChat\" 并安装。",
        "打开微信，点击「注册」。",
        "选择手机号注册，输入号码。",
        "设置 8–16 位密码（字母 + 数字）。",
        "同意协议后注册，输入短信验证码。",
        "完成滑块或图形验证。",
      ],
      note: "微信可能需要好友辅助扫码验证，请提前找一位已注册的好友帮忙。",
    },
    bindCard: {
      heading: "2. 绑定国际银行卡",
      steps: [
        "「我」→「服务」→「钱包」。",
        "点击「银行卡」→「添加银行卡」。",
        "设置 6 位支付密码（务必牢记）。",
        "输入持卡人姓名（须与护照完全一致）、卡号、有效期、CVV。",
        "输入银行短信验证码完成绑定。",
        "成功后卡片会显示在列表中。",
      ],
    },
    verify: {
      heading: "3. 实名认证",
      steps: [
        "「我」→「服务」→ 右上「···」→「实名认证」。",
        "选择「护照」并上传护照照片页。",
        "确认姓名、国籍、护照号。",
        "等待几分钟审核通过。",
      ],
    },
    pay: {
      heading: "4. 完成支付",
      steps: [
        "出示付款码：「我」→「服务」→「钱包」→ 点击条码图标，向商家出示。",
        "扫码支付：右上「+」→「扫一扫」，扫描商家二维码，输入金额并确认。",
        "向个人转账：聊天界面「+」→「转账」，输入金额，用支付密码 / Face ID 确认。",
      ],
    },
  },
  alipay: {
    title: "支付宝 Alipay",
    register: {
      heading: "1. 下载与注册",
      steps: [
        "在 App Store / Google Play 搜索 \"Alipay\" 并安装。",
        "点击「注册账号」→ 选择「国际手机号」。",
        "输入号码，接收短信验证码，设置登录密码。",
        "如需切换英文：「我的」→「设置」→「通用」→「语言」。",
      ],
    },
    bindCard: {
      heading: "2. 绑定国际卡（TourPass）",
      steps: [
        "「我的」→「银行卡」→「添加」。",
        "选择「国际卡」并输入卡片信息。",
        "通过银行短信验证码确认。",
        "支持 Visa、Mastercard、JCB、Diners、Discover。",
      ],
    },
    tip: "在支付宝内搜索 \"TourPass\" 可使用专为外国游客设计的小程序，包含英文界面、交通卡和汇率预览。",
  },
  scenarios: {
    title: "常见支付场景",
    items: [
      { name: "餐厅", text: "扫桌台二维码点单付款，或扫收银台二维码输入金额。" },
      { name: "便利店 / 超市", text: "出示付款码，收银员扫码即可。" },
      { name: "出租车 / 滴滴", text: "出租车扫司机二维码；滴滴自动扣款。" },
      { name: "酒店", text: "前台几乎都支持微信 / 支付宝结算房费和押金。" },
      { name: "景点门票", text: "通过支付宝或微信小程序购票，凭二维码或护照入场。" },
      { name: "路边摊 / 夜市", text: "扫摊主打印的二维码，输入金额，向摊主出示支付成功页面。" },
    ],
  },
  fees: {
    title: "费用与限额",
    rows: [
      { label: "单笔 200 元以下", w: "无手续费", a: "无手续费" },
      { label: "单笔 200 元以上", w: "约 3% 手续费", a: "约 3% 手续费" },
      { label: "单笔限额", w: "¥6,000", a: "¥5,000" },
      { label: "单日限额", w: "¥6,000", a: "¥10,000" },
      { label: "单月累计", w: "约 ¥50,000", a: "约 ¥50,000" },
    ],
  },
  safety: {
    title: "安全提示",
    items: [
      "不要将支付密码告诉任何人，官方客服不会索要密码。",
      "在支付设置中开启指纹 / 面部识别。",
      "随身备 ¥200–500 现金以防万一。",
      "确认金额无误后再支付。",
      "警惕景区粘贴的假二维码——付款前核对屏幕上的商户名称。",
    ],
  },
  faq: {
    title: "常见问题 FAQ",
    items: [
      { q: "同一张国际卡可以绑微信和支付宝吗？", a: "可以，互不影响。" },
      { q: "扣的是什么币种？", a: "页面显示人民币金额，银行按实时汇率换算为你的卡片结算币种。" },
      { q: "可以退税吗？", a: "可以。在指定商户单笔满 ¥500 即可在机场办理退税。" },
      { q: "支付遇到问题找谁？", a: "微信支付：+86-755-83765566；支付宝：+86-571-95188，或 App 内「我的」→「我的客服」。" },
    ],
  },
  summary: {
    title: "快速上手清单",
    items: [
      "抵达前：下载微信与支付宝。",
      "抵达后：购买本地 SIM 卡。",
      "立即：绑卡 + 实名认证。",
      "练习：在便利店做一笔 ¥1–5 的小额支付。",
      "备用：随身 ¥200–500 现金。",
    ],
  },
};

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="mt-3 space-y-2">
      {items.map((s, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {i + 1}
          </span>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <div>
      <h4 className="text-base font-semibold text-foreground">{section.heading}</h4>
      {section.body && <p className="mt-2 text-sm text-muted-foreground">{section.body}</p>}
      {section.steps && <Steps items={section.steps} />}
      {section.note && (
        <p className="mt-3 rounded-md border-l-2 border-primary bg-primary/5 p-3 text-xs text-muted-foreground">
          💡 {section.note}
        </p>
      )}
    </div>
  );
}

export function PaymentGuide({ trigger }: { trigger: ReactNode }) {
  const { lang } = useLanguage();
  const c = lang === "zh" ? zh : en;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="font-serif text-2xl">{c.title}</DialogTitle>
          <DialogDescription>{c.subtitle}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(85vh-5rem)]">
          <div className="space-y-8 px-6 py-6">
            <p className="text-sm leading-relaxed text-muted-foreground">{c.intro}</p>

            <section>
              <h3 className="mb-3 text-lg font-bold text-foreground">{c.why.title}</h3>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {c.why.items.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </section>

            <Separator />
            <SectionBlock section={c.prep} />

            <Separator />
            <section className="space-y-5">
              <h3 className="text-lg font-bold text-foreground">{c.wechat.title}</h3>
              <SectionBlock section={c.wechat.register} />
              <SectionBlock section={c.wechat.bindCard} />
              <SectionBlock section={c.wechat.verify} />
              <SectionBlock section={c.wechat.pay} />
            </section>

            <Separator />
            <section className="space-y-5">
              <h3 className="text-lg font-bold text-foreground">{c.alipay.title}</h3>
              <SectionBlock section={c.alipay.register} />
              <SectionBlock section={c.alipay.bindCard} />
              <p className="rounded-md border-l-2 border-primary bg-primary/5 p-3 text-xs text-muted-foreground">
                💡 {c.alipay.tip}
              </p>
            </section>

            <Separator />
            <section>
              <h3 className="mb-3 text-lg font-bold text-foreground">{c.scenarios.title}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {c.scenarios.items.map((it) => (
                  <div key={it.name} className="rounded-lg bg-secondary/40 p-3">
                    <p className="text-sm font-semibold text-foreground">{it.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{it.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />
            <section>
              <h3 className="mb-3 text-lg font-bold text-foreground">{c.fees.title}</h3>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">{lang === "zh" ? "项目" : "Item"}</th>
                      <th className="px-3 py-2 text-left font-semibold">WeChat</th>
                      <th className="px-3 py-2 text-left font-semibold">Alipay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.fees.rows.map((r) => (
                      <tr key={r.label} className="border-t">
                        <td className="px-3 py-2 text-foreground">{r.label}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.w}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <Separator />
            <section>
              <h3 className="mb-3 text-lg font-bold text-foreground">{c.safety.title}</h3>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {c.safety.items.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </section>

            <Separator />
            <section>
              <h3 className="mb-3 text-lg font-bold text-foreground">{c.faq.title}</h3>
              <div className="space-y-4">
                {c.faq.items.map((it, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold text-foreground">Q: {it.q}</p>
                    <p className="mt-1 text-sm text-muted-foreground">A: {it.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />
            <section>
              <h3 className="mb-3 text-lg font-bold text-foreground">{c.summary.title}</h3>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
                {c.summary.items.map((x, i) => <li key={i}>{x}</li>)}
              </ol>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
