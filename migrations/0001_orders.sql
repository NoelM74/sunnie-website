CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL UNIQUE,
  -- 'review' means the capture is PENDING at PayPal (e.g. PENDING_REVIEW, ECHECK): the order must not ship until PayPal shows the capture as COMPLETED.
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'review')),
  paypal_env TEXT NOT NULL CHECK (paypal_env IN ('sandbox', 'live')),
  paypal_order_id TEXT UNIQUE,
  capture_id TEXT,
  email TEXT NOT NULL,
  address_json TEXT NOT NULL,
  lines_json TEXT NOT NULL,
  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TEXT NOT NULL,
  paid_at TEXT,
  customer_emailed INTEGER NOT NULL DEFAULT 0,
  shop_emailed INTEGER NOT NULL DEFAULT 0,
  email_error TEXT
);
CREATE INDEX IF NOT EXISTS orders_created_at ON orders (created_at);
