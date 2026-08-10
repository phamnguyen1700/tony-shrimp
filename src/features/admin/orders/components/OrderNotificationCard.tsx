import Link from "next/link";
import type { OwnerNotification } from "@/types/notification";

interface Props {
  notification: OwnerNotification;
  index: number;
  onRead: (notificationId: string) => void;
}

function getOrderId(notification: OwnerNotification) {
  return typeof notification.data?.order_id === "string" ? notification.data.order_id : null;
}

export default function OrderNotificationCard({ notification, index, onRead }: Props) {
  const orderId = getOrderId(notification);
  const content = (
    <article className="ui-radius border border-border bg-card p-2.5 transition-colors hover:border-accent/40">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                #{String(index + 1).padStart(2, "0")}
              </span>
              {notification.data?.order_number && (
                <span className="font-mono-label text-[10px] uppercase tracking-widest text-accent">
                  {notification.data.order_number}
                </span>
              )}
            </div>
            <p className="mt-1 line-clamp-1 text-xs font-medium text-foreground">
              {notification.title}
            </p>
            <p className="mt-1 line-clamp-2 font-body text-[11px] leading-relaxed text-muted-foreground">
              {notification.message}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRead(notification.id);
          }}
          className="shrink-0 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
        >
          Read
        </button>
      </div>
    </article>
  );

  if (!orderId) {
    return (
      <button type="button" onClick={() => onRead(notification.id)} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return (
    <Link
      href={`/admin/orders/${orderId}`}
      onClick={() => onRead(notification.id)}
      className="block"
    >
      {content}
    </Link>
  );
}
