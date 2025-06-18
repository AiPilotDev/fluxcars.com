import styles from './styles.module.css';

export default function ContactsBlock() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Контакты</h2>
        <div className="space-y-3">
          {/* Беларусь */}
          <div className={styles.contactSectionBelarus}>
            <div className={styles.contactHeader}>
              <div className={styles.countryIcon}>
                <span className={styles.flagEmoji}>🇧🇾</span>
              </div>
              <h3 className={styles.contactCountry}>Беларусь</h3>
            </div>
            <div className={styles.contactInfo}>
              <a 
                href="tel:+375257322575" 
                className={styles.contactPhone}
              >
                +375 (25) 732-25-75
              </a>
              <span className={styles.contactApps}>(Telegram, WhatsApp, Viber)</span>
            </div>
          </div>

          {/* English speaking support */}
          <div className={styles.contactSectionUK}>
            <div className={styles.contactHeader}>
              <div className={styles.countryIcon}>
                <span className={styles.flagEmoji}>🇬🇧</span>
              </div>
              <h3 className={styles.contactCountry}>English speaking support</h3>
            </div>
            <div className={styles.contactInfo}>
              <a 
                href="tel:+447822032515" 
                className={styles.contactPhone}
              >
                +44 (782) 203-25-15
              </a>
              <span className={styles.contactApps}>(WhatsApp)</span>
            </div>
          </div>

          {/* Китай */}
          <div className={styles.contactSectionChina}>
            <div className={styles.contactHeader}>
              <div className={styles.countryIcon}>
                <span className={styles.flagEmoji}>🇨🇳</span>
              </div>
              <h3 className={styles.contactCountry}>Китай</h3>
            </div>
            <div className={styles.contactInfo}>
              <a 
                href="tel:+8613966351040" 
                className={styles.contactPhone}
              >
                +86 (139) 663-51-040
              </a>
              <span className={styles.contactApps}>(WeChat, WhatsApp, Viber)</span>
            </div>
          </div>

          {/* РФ */}
          <div className={styles.contactSectionRussia}>
            <div className={styles.contactHeader}>
              <div className={styles.countryIcon}>
                <span className={styles.flagEmoji}>🇷🇺</span>
              </div>
              <h3 className={styles.contactCountry}>РФ</h3>
            </div>
            <div className={styles.contactInfo}>
              <a 
                href="tel:+79939242575" 
                className={styles.contactPhone}
              >
                +7 (993) 924-25-75
              </a>
              <span className={styles.contactApps}>(Telegram, WhatsApp)</span>
            </div>
          </div>

          {/* Email */}
          <div className={styles.contactSectionEmail}>
            <div className={styles.contactHeader}>
              <div className={styles.countryIcon}>
                <span className={styles.flagEmoji}>📧</span>
              </div>
              <h3 className={styles.contactCountry}>Email</h3>
            </div>
            <div className={styles.contactInfo}>
              <a 
                href="mailto:hello@chinamotor.by" 
                className={styles.contactEmail}
              >
                hello@chinamotor.by
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 