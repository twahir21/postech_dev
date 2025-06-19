-- Migrations will appear here as you chat with AI

create table shops (
  id bigint primary key generated always as identity,
  name text not null,
  preferred_language text,
  preferred_currency text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table users (
  id bigint primary key generated always as identity,
  shop_id bigint references shops (id),
  username text not null unique,
  password text not null,
  role text check (role in ('admin', 'cashier')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table products (
  id bigint primary key generated always as identity,
  shop_id bigint references shops (id),
  name text not null,
  category text,
  stock int not null,
  price numeric(10, 2) not null,
  expiry_date date,
  barcode text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table customers (
  id bigint primary key generated always as identity,
  shop_id bigint references shops (id),
  name text not null,
  contact text,
  current_debt numeric(10, 2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table suppliers (
  id bigint primary key generated always as identity,
  shop_id bigint references shops (id),
  name text not null,
  contact text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table sales (
  id bigint primary key generated always as identity,
  shop_id bigint references shops (id),
  user_id bigint references users (id),
  customer_id bigint references customers (id),
  total numeric(10, 2) not null,
  cash_sale boolean default true,
  sale_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table purchases (
  id bigint primary key generated always as identity,
  shop_id bigint references shops (id),
  supplier_id bigint references suppliers (id),
  product_id bigint references products (id),
  unit_price numeric(10, 2) not null,
  quantity int not null,
  total numeric(10, 2) not null,
  purchase_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table debts_payments (
  id bigint primary key generated always as identity,
  shop_id bigint references shops (id),
  customer_id bigint references customers (id),
  amount numeric(10, 2) not null,
  payment_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table expenses (
  id bigint primary key generated always as identity,
  shop_id bigint references shops (id),
  description text not null,
  amount numeric(10, 2) not null,
  category text,
  expense_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table asked_products (
  id bigint primary key generated always as identity,
  shop_id bigint references shops (id),
  product_id bigint references products (id),
  frequency int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

## made by database.build