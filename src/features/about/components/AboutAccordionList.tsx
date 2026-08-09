import type { Lang, Translations } from "@/i18n";
import AboutAccordion from "./AboutAccordion";
import AboutSocialLink from "./AboutSocialLink";

interface AboutAccordionListProps {
  t: Translations;
  lang: Lang;
  openId?: string;
}

const facebookUrl = "https://facebook.com/thang.pham.790508";

const copy = {
  en: {
    storeTitle: "Store",
    termsTitle: "Terms of Service",
    liveArrivalTitle: "Live Arrival",
    doaTitle: "DOA Policy",
    contactTitle: "Contact",
    ownerLabel: "Owner",
    store:
      "Premium ornamental freshwater shrimp selected for colour, pattern, and vigour. Each listing focuses on clear variant pricing, practical water parameters, and availability that is easy to scan before ordering.",
    shipping:
      "Orders are shipped via AusPost Express with a fixed Australia-wide shipping fee of A$25. Each order is packed around livestock safety, weather conditions, and careful transit timing.",
    terms:
      "Orders are packed and dispatched based on livestock safety, payment confirmation, and suitable weather windows. Product availability may change before checkout is completed.",
    liveArrival:
      "Live arrival is supported when the parcel is received promptly and the delivery address is suitable for livestock shipping. Please track your parcel and collect it as soon as it arrives.",
    doa: "If shrimp arrive deceased, photograph the unopened bag within 2 hours of delivery and contact us with your order details. We will review the case and arrange support according to the order conditions.",
  },
  vi: {
    storeTitle: "Giới thiệu",
    termsTitle: "Điều khoản dịch vụ",
    liveArrivalTitle: "Cam kết tép sống",
    doaTitle: "Chính sách DOA",
    contactTitle: "Thông tin liên hệ",
    ownerLabel: "Chủ cửa hàng",
    store:
      "Tony Shrimp Australia chuyên các dòng tép cảnh nước ngọt được chọn lọc theo màu sắc, hoa văn và sức khỏe. Mỗi sản phẩm hiển thị rõ giá theo pack, thông số nước và tình trạng còn hàng để khách dễ cân nhắc trước khi đặt.",
    shipping:
      "Đơn hàng sẽ được gửi thông qua AusPost Express với phí ship cố định A$25 toàn nước Úc. Mỗi đơn được đóng gói theo độ an toàn của sinh vật sống, điều kiện thời tiết và thời điểm vận chuyển phù hợp.",
    terms:
      "Đơn hàng được đóng gói và gửi đi dựa trên tình trạng thanh toán, độ an toàn khi vận chuyển sinh vật sống và điều kiện thời tiết phù hợp. Tình trạng sản phẩm có thể thay đổi trước khi hoàn tất thanh toán.",
    liveArrival:
      "Chính sách live arrival được áp dụng khi kiện hàng được nhận kịp thời và địa chỉ giao hàng phù hợp cho vận chuyển sinh vật sống. Vui lòng theo dõi đơn và nhận hàng sớm sau khi giao tới.",
    doa: "Nếu tép bị chết khi đến nơi, vui lòng chụp ảnh túi chưa mở trong vòng 2 giờ sau khi nhận hàng và liên hệ kèm thông tin đơn. Chúng tôi sẽ kiểm tra và hỗ trợ theo điều kiện của đơn hàng.",
  },
};

export default function AboutAccordionList({
  t,
  lang,
  openId,
}: AboutAccordionListProps) {
  const text = copy[lang];

  return (
    <div className="max-w-2xl">
      <AboutAccordion title={text.storeTitle} defaultOpen>
        <p>{text.store}</p>
      </AboutAccordion>

      <AboutAccordion id="shipping" title={t.nav.shipping} forceOpen={openId === "shipping"}>
        <p>{text.shipping}</p>
      </AboutAccordion>

      <AboutAccordion title={text.termsTitle}>
        <p>{text.terms}</p>
      </AboutAccordion>

      <AboutAccordion
        id="live-arrival"
        title={text.liveArrivalTitle}
        forceOpen={openId === "live-arrival"}
      >
        <p>{text.liveArrival}</p>
      </AboutAccordion>

      <AboutAccordion id="doa" title={text.doaTitle} forceOpen={openId === "doa"}>
        <p>{text.doa}</p>
      </AboutAccordion>

      <AboutAccordion id="contact" title={text.contactTitle} forceOpen={openId === "contact"}>
        <div className="space-y-4">
          <p>
            {text.ownerLabel}:{" "}
            <span className="text-foreground">Mr. Thang Pham</span>
          </p>
          <AboutSocialLink href={facebookUrl} />
        </div>
      </AboutAccordion>
    </div>
  );
}
