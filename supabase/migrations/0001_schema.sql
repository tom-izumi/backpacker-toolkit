-- Backpacker Toolkit QLD — v1 schema
-- 於 Supabase SQL Editor 執行

-- Enums
create type region_type as enum ('Caboolture', 'Stanthorpe');
create type pay_method_type as enum ('時薪', '計件', '保底計件', '時薪+計件', '不確定');
create type english_level as enum ('低', '中', '高');
create type verification_level as enum ('創辦人實地驗證', '多人回報確認', '單人回報', '未驗證');

-- 主資料表
create table farms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region region_type not null,

  -- 模糊定位：只存城鎮級座標，不存門牌地址
  approx_lat numeric(9,6) not null,
  approx_lng numeric(9,6) not null,
  fuzzy_radius_m int not null default 2500,

  job_type text not null,              -- 例如：包裝、採摘、農助、種苗
  crop text not null,                  -- 例如：草莓
  season_range text,                   -- 農場實際產季，例如「5月-10月」
  suggested_entry_timing text,         -- 背包客建議入職/抵達時間點，與產季不同概念

  pay_method pay_method_type not null,
  pay_range text,                      -- 文字描述，先不強制拆數字區間

  accommodation text,
  transport text,

  difficulty_rating smallint check (difficulty_rating between 1 and 5), -- 創辦人主觀評分
  english_requirement english_level,

  founder_notes text,                  -- 創辦人介紹/心得，非結構化敘述文字，是內容核心賣點

  verification_level verification_level not null default '創辦人實地驗證',
  last_confirmed_date date,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security：網站只能讀，不能寫
alter table farms enable row level security;

create policy "public can read farms"
  on farms for select
  using (true);

-- 不建立任何 insert/update/delete policy
-- 代表除了 Supabase 後台（service role / 專案擁有者登入）以外，
-- 沒有任何角色可以新增或修改資料，前端完全沒有寫入路徑
