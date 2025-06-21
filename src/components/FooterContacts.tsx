export default function FooterContacts() {
  return (
    <div>
      <h3 suppressHydrationWarning className="text-white text-lg font-semibold mb-4">Контакты</h3>
      <div className="space-y-4">
        <div>
          <h4 suppressHydrationWarning className="text-white font-medium mb-2">Беларусь:</h4>
          <p className="text-sm">
            +375 25 732 25 75 (Telegram, WhatsApp, Viber)
          </p>
        </div>
        <div>
          <h4 suppressHydrationWarning className="text-white font-medium mb-2">English speaking support:</h4>
          <p className="text-sm">
            + 447822032515 (WhatsApp)
          </p>
        </div>
        <div>
          <h4 suppressHydrationWarning className="text-white font-medium mb-2">Китай:</h4>
          <p className="text-sm">
            +8613966351040 (WeChat, WhatsApp, Viber)
          </p>
        </div>
        <div>
          <h4 suppressHydrationWarning className="text-white font-medium mb-2">РФ:</h4>
          <p className="text-sm">
            +79939242575 (Telegram, WhatsApp)
          </p>
        </div>
        <div>
          <h4 suppressHydrationWarning className="text-white font-medium mb-2">Email:</h4>
          <a href="mailto:hello@chinamotor.by" className="text-blue-400 hover:text-blue-300 transition-colors">
            hello@chinamotor.by
          </a>
        </div>
      </div>
    </div>
  );
} 