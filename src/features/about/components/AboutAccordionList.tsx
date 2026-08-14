import type { Lang, Translations } from "@/i18n";
import type { ReactNode } from "react";
import AboutAccordion from "./AboutAccordion";
import AboutSocialLink from "./AboutSocialLink";

interface AboutAccordionListProps {
  t: Translations;
  lang: Lang;
  openId?: string;
}

interface AboutContentProps {
  title: string;
  overview: ReactNode;
  highlights?: ReactNode[];
  note?: ReactNode;
}

const facebookUrl = "https://facebook.com/thang.pham.790508";

const copy = {
  en: {
    storeTitle: "About Us",
    shippingTitle: "Shipping",
    termsTitle: "Terms of Service",
    liveArrivalTitle: "Live Arrival",
    doaTitle: "DOA Policy",
    contactTitle: "Contact",
    ownerLabel: "Owner",

    aboutHeading: "Tony Shrimp Australia — Quality Over Quantity",
    shippingHeading: "Safe & Reliable Live Shrimp Shipping",
    termsHeading: "Ordering with Tony Shrimp",
    liveArrivalHeading: "Our Live Arrival Commitment",
    doaHeading: "Dead on Arrival (DOA) Policy",
    contactHeading: "Get in Touch",
  },

  vi: {
    storeTitle: "Giới thiệu",
    shippingTitle: "Vận chuyển",
    termsTitle: "Điều khoản dịch vụ",
    liveArrivalTitle: "Cam kết tép sống",
    doaTitle: "Chính sách DOA",
    contactTitle: "Liên hệ",
    ownerLabel: "Chủ cửa hàng",

    aboutHeading: "Tony Shrimp Australia — Chất Lượng Hơn Số Lượng",
    shippingHeading: "Vận Chuyển Tép Sống An Toàn",
    termsHeading: "Đặt Hàng Tại Tony Shrimp",
    liveArrivalHeading: "Cam Kết Tép Sống Khi Nhận Hàng",
    doaHeading: "Chính Sách Tép Chết Khi Nhận Hàng (DOA)",
    contactHeading: "Liên Hệ Với Chúng Tôi",
  },
};

const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-foreground">{children}</strong>
);

function AboutContent({
  title,
  overview,
  highlights,
  note,
}: AboutContentProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-semibold italic leading-snug text-foreground md:text-xl">
          {title}
        </h3>

        <div className="text-sm leading-7 text-muted-foreground md:text-[15px]">
          {overview}
        </div>
      </div>

      {highlights?.length ? (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
            Highlights
          </h4>

          <ul className="space-y-2 text-sm leading-6 text-muted-foreground md:text-[15px]">
            {highlights.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-[11px] size-1 shrink-0 rounded-full bg-foreground/60" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {note ? (
        <div className="border-l border-border pl-4 text-sm leading-6 text-muted-foreground md:text-[15px]">
          {note}
        </div>
      ) : null}
    </div>
  );
}

export default function AboutAccordionList({
  t,
  lang,
  openId,
}: AboutAccordionListProps) {
  const text = copy[lang];

  return (
    <div className="max-w-2xl">
      {/* ABOUT */}
      <AboutAccordion title={text.storeTitle} defaultOpen>
        {lang === "en" ? (
          <AboutContent
            title={text.aboutHeading}
            overview={
              <p>
                <Strong>Tony Shrimp Australia</Strong> provides{" "}
                <Strong>high-quality ornamental freshwater shrimp</Strong> for
                aquarium keepers and shrimp enthusiasts across Australia. Our
                philosophy is simple: <Strong>quality over quantity</Strong>.
                Every shrimp is carefully selected for colour, pattern, health,
                vigour, and overall quality.
              </p>
            }
            highlights={[
              <>
                <Strong>Years of hands-on experience</Strong> keeping, caring
                for, and selecting ornamental shrimp before opening the store.
              </>,
              <>
                Carefully selected shrimp with a focus on{" "}
                <Strong>health, colour, pattern, and quality</Strong>.
              </>,
              <>
                Built with <Strong>fresh ideas, genuine enthusiasm</Strong>, and
                a passion for the aquarium hobby.
              </>,
            ]}
            note={
              <Strong>
                Tony Shrimp Australia — Quality over quantity. Since 2025.
              </Strong>
            }
          />
        ) : (
          <AboutContent
            title={text.aboutHeading}
            overview={
              <p>
                <Strong>Tony Shrimp Australia</Strong> chuyên cung cấp các dòng{" "}
                <Strong>tép cảnh nước ngọt chất lượng cao</Strong> dành cho
                người chơi thủy sinh và những người đam mê tép cảnh tại Úc.
                Phương châm của chúng tôi rất đơn giản:{" "}
                <Strong>chất lượng hơn số lượng</Strong>. Mỗi cá thể đều được
                tuyển chọn kỹ dựa trên màu sắc, hoa văn, sức khỏe, độ sung và
                chất lượng tổng thể.
              </p>
            }
            highlights={[
              <>
                <Strong>Nhiều năm kinh nghiệm thực tế</Strong> nuôi, chăm sóc và
                tuyển chọn tép cảnh trước khi mở cửa hàng.
              </>,
              <>
                Tuyển chọn kỹ dựa trên{" "}
                <Strong>màu sắc, hoa văn, sức khỏe và chất lượng</Strong>.
              </>,
              <>
                Mang tinh thần <Strong>mới mẻ, nhiệt huyết</Strong> và niềm đam
                mê dành cho thú chơi thủy sinh.
              </>,
            ]}
            note={
              <Strong>
                Tony Shrimp Australia — Chất lượng hơn số lượng. Since 2025.
              </Strong>
            }
          />
        )}
      </AboutAccordion>

      {/* SHIPPING */}
      <AboutAccordion
        id="shipping"
        title={t.nav.shipping}
        forceOpen={openId === "shipping"}
      >
        {lang === "en" ? (
          <AboutContent
            title={text.shippingHeading}
            overview={
              <p>
                All shrimp are shipped live via{" "}
                <Strong>
                  Australia Post Express Post or StarTrack overnight courier
                </Strong>
                . Every order is prepared with livestock safety, weather
                conditions, and transit time in mind.
              </p>
            }
            highlights={[
              <>
                Dispatch days: <Strong>Monday to Wednesday</Strong>.
              </>,
              <>
                Flat Australia-wide shipping rate: <Strong>A$25</Strong>.
              </>,
              <>
                Orders are packed specifically to help protect{" "}
                <Strong>live shrimp during transit</Strong>.
              </>,
            ]}
          />
        ) : (
          <AboutContent
            title={text.shippingHeading}
            overview={
              <p>
                Tất cả tép được vận chuyển sống thông qua{" "}
                <Strong>
                  Australia Post Express Post hoặc StarTrack overnight courier
                </Strong>
                . Mỗi đơn hàng được chuẩn bị dựa trên độ an toàn của tép, điều
                kiện thời tiết và thời gian vận chuyển.
              </p>
            }
            highlights={[
              <>
                Ngày gửi hàng: <Strong>Thứ Hai đến Thứ Tư</Strong>.
              </>,
              <>
                Phí vận chuyển cố định toàn nước Úc: <Strong>A$25</Strong>.
              </>,
              <>
                Đơn hàng được đóng gói nhằm đảm bảo{" "}
                <Strong>an toàn cho tép sống trong quá trình vận chuyển</Strong>
                .
              </>,
            ]}
          />
        )}
      </AboutAccordion>

      {/* TERMS */}
      <AboutAccordion title={text.termsTitle}>
        {lang === "en" ? (
          <AboutContent
            title={text.termsHeading}
            overview={
              <p>
                Orders are prepared and dispatched after{" "}
                <Strong>payment confirmation</Strong> and when conditions are
                suitable for safely transporting live shrimp. Dispatch timing
                may be adjusted when weather or livestock safety requires it.
              </p>
            }
            highlights={[
              <>
                Orders require <Strong>confirmed payment</Strong> before
                dispatch.
              </>,
              <>
                Dispatch may change due to{" "}
                <Strong>weather or livestock safety</Strong>.
              </>,
              <>
                Product <Strong>availability may change</Strong> before checkout
                is completed.
              </>,
            ]}
            note={
              <>
                By placing an order, customers acknowledge the applicable{" "}
                <Strong>shipping, live arrival, and DOA conditions</Strong>.
              </>
            }
          />
        ) : (
          <AboutContent
            title={text.termsHeading}
            overview={
              <p>
                Đơn hàng được chuẩn bị và gửi đi sau khi{" "}
                <Strong>thanh toán được xác nhận</Strong> và điều kiện phù hợp
                để vận chuyển tép sống an toàn. Thời gian gửi có thể thay đổi
                nếu điều kiện thời tiết hoặc độ an toàn của tép yêu cầu.
              </p>
            }
            highlights={[
              <>
                Đơn hàng cần <Strong>được xác nhận thanh toán</Strong> trước khi
                gửi.
              </>,
              <>
                Lịch gửi có thể thay đổi do{" "}
                <Strong>thời tiết hoặc độ an toàn của tép</Strong>.
              </>,
              <>
                <Strong>Tình trạng còn hàng có thể thay đổi</Strong> trước khi
                hoàn tất thanh toán.
              </>,
            ]}
            note={
              <>
                Khi đặt hàng, khách hàng đồng ý với các{" "}
                <Strong>
                  điều kiện vận chuyển, live arrival và chính sách DOA
                </Strong>
                .
              </>
            }
          />
        )}
      </AboutAccordion>

      {/* LIVE ARRIVAL */}
      <AboutAccordion
        id="live-arrival"
        title={text.liveArrivalTitle}
        forceOpen={openId === "live-arrival"}
      >
        {lang === "en" ? (
          <AboutContent
            title={text.liveArrivalHeading}
            overview={
              <p>
                Tony Shrimp provides a <Strong>live arrival guarantee</Strong>{" "}
                when orders are received under the applicable delivery
                conditions. Customers should monitor tracking and arrange to
                receive the parcel promptly.
              </p>
            }
            highlights={[
              <>
                <Strong>Track your parcel closely</Strong> after dispatch.
              </>,
              <>
                Receive or collect the parcel{" "}
                <Strong>as soon as it is delivered</Strong>.
              </>,
              <>
                Use an address suitable for receiving{" "}
                <Strong>live livestock</Strong>.
              </>,
            ]}
            note={
              <>
                If there is an issue on arrival, please follow the{" "}
                <Strong>DOA Policy</Strong>.
              </>
            }
          />
        ) : (
          <AboutContent
            title={text.liveArrivalHeading}
            overview={
              <p>
                Tony Shrimp áp dụng{" "}
                <Strong>cam kết tép sống khi nhận hàng</Strong> đối với các đơn
                đáp ứng điều kiện vận chuyển. Khách hàng nên theo dõi tracking
                và sắp xếp nhận kiện hàng sớm nhất có thể.
              </p>
            }
            highlights={[
              <>
                <Strong>Theo dõi kiện hàng thường xuyên</Strong> sau khi gửi.
              </>,
              <>
                Nhận hoặc lấy hàng <Strong>ngay khi đơn được giao tới</Strong>.
              </>,
              <>
                Sử dụng địa chỉ phù hợp để tiếp nhận{" "}
                <Strong>sinh vật sống</Strong>.
              </>,
            ]}
            note={
              <>
                Nếu có vấn đề khi nhận hàng, vui lòng thực hiện theo{" "}
                <Strong>Chính sách DOA</Strong>.
              </>
            }
          />
        )}
      </AboutAccordion>

      {/* DOA */}
      <AboutAccordion
        id="doa"
        title={text.doaTitle}
        forceOpen={openId === "doa"}
      >
        {lang === "en" ? (
          <AboutContent
            title={text.doaHeading}
            overview={
              <p>
                We guarantee <Strong>live arrival</Strong> on all orders. Please
                check the{" "}
                <Strong>order details and delivery information</Strong> before
                opening the package.
              </p>
            }
            highlights={[
              <>
                If there is any loss, take{" "}
                <Strong>clear photos of the shipment</Strong>.
              </>,
              <>
                Include the{" "}
                <Strong>delivery time and tracking/order information</Strong>.
              </>,
              <>
                Then{" "}
                <a
                  href="/about#contact"
                  className="font-semibold text-foreground underline underline-offset-2"
                >
                  contact us
                </a>{" "}
                so we can review the case.
              </>,
            ]}
            note={
              <>
                We will arrange a <Strong>replacement or refund</Strong>.
                Transit delays outside our control are not covered by the DOA
                policy.
              </>
            }
          />
        ) : (
          <AboutContent
            title={text.doaHeading}
            overview={
              <p>
                Chúng tôi cam kết <Strong>tép sống khi nhận hàng</Strong> đối
                với tất cả đơn hàng. Vui lòng kiểm tra{" "}
                <Strong>thông tin đơn hàng và thông tin giao hàng</Strong> trước
                khi mở kiện hàng.
              </p>
            }
            highlights={[
              <>
                Nếu có tổn thất, vui lòng chụp{" "}
                <Strong>hình ảnh rõ ràng của kiện hàng</Strong>.
              </>,
              <>
                Cung cấp{" "}
                <Strong>
                  thời gian giao hàng và thông tin tracking/mã đơn hàng
                </Strong>
                .
              </>,
              <>
                Sau đó{" "}
                <a
                  href="/about#contact"
                  className="font-semibold text-foreground underline underline-offset-2"
                >
                  liên hệ với chúng tôi
                </a>{" "}
                để được kiểm tra và hỗ trợ.
              </>,
            ]}
            note={
              <>
                Chúng tôi sẽ hỗ trợ <Strong>gửi thay thế hoặc hoàn tiền</Strong>
                . Các trường hợp giao hàng chậm nằm ngoài khả năng kiểm soát của
                chúng tôi không thuộc phạm vi của chính sách DOA.
              </>
            }
          />
        )}
      </AboutAccordion>

      {/* CONTACT */}
      <AboutAccordion
        id="contact"
        title={text.contactTitle}
        forceOpen={openId === "contact"}
      >
        <AboutContent
          title={text.contactHeading}
          overview={
            <div className="space-y-3">
              <p>
                {text.ownerLabel}: <Strong>Mr. Thang Pham</Strong>
              </p>

              <AboutSocialLink href={facebookUrl} />
            </div>
          }
        />
      </AboutAccordion>
    </div>
  );
}
