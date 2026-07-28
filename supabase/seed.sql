-- 第一筆測試資料：Ashbern Farm
-- 於 Supabase SQL Editor 執行（需先執行 migrations/0001_schema.sql）

insert into farms (
  name, region, approx_lat, approx_lng, fuzzy_radius_m,
  job_type, crop, season_range, suggested_entry_timing,
  pay_method, founder_notes,
  verification_status, last_confirmed_date,
  can_collect_stamp, provider
) values (
  'Ashbern Farm', 'Caboolture', -27.0853, 152.9503, 2500,
  '包裝', '草莓', '5月-10月', '建議提早詢問卡位，五星廠競爭較大',
  '保底計件',
  'Ashbern 是 Caboolture 當地小有名氣的「五星廠」之一，有保底機制，對新手來說風險較低、屬於新手友善的選擇。建議提早詢問卡位。',
  '已驗證', current_date,
  true, '站長'
);

-- 座標為 Caboolture 鎮中心概略值，非農場實際位置，符合模糊定位原則
