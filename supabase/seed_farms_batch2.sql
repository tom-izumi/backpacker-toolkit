-- 第三批資料：來自填寫表（11 筆新農場）
-- 於 Supabase SQL Editor 執行（需先執行 0001~0003 migrations）
--
-- 注意事項：
-- 1. 這批資料同樣沒填經緯度，比照前一批做法，依地區代填鎮中心概略座標
--    （Caboolture: -27.0853, 152.9503／Stanthorpe: -28.6053, 151.9308），如需更精確請之後再調整。
-- 2. Eastern Colour 沒填「計薪方式」（必填欄位），暫填「不確定」，請之後補實際資料。
-- 3. Archie's Produce、David 的計薪方式「團體計件」需先執行 0003_add_pay_method_group_piece.sql 才能寫入。
-- 4. 填寫表中第 1-5 列（Ashbern Farm x2、Taylor Farm、Red Jewel Farm、Donnybrook farm）
--    與既有資料重複，故不重複收錄。

insert into farms (
  name, region, approx_lat, approx_lng, fuzzy_radius_m,
  job_type, crop, season_range, suggested_entry_timing,
  pay_method, difficulty_rating, english_requirement, founder_notes,
  verification_status, last_confirmed_date,
  can_collect_stamp, provider
) values
(
  'Glass house farm', 'Caboolture', -27.0853, 152.9503, 2500,
  '包裝/採摘', '草莓', '6月-11月', '旺季6-10月',
  '保底計件', 5, '低',
  'Glass house在草莓圈的名聲非常糟糕，第一周的薪水第三周才開始領，但每年都有欠薪的紀錄，所以當你發現被欠薪時至少都是3周起跳，每年都倒閉換老闆又重新開張，絕對不是個好選擇，如果真的硬要去可以考慮季初約1-2個月的時間段。',
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'Pinata farm', 'Caboolture', -27.0853, 152.9503, 2500,
  '包裝', '草莓', '6月-11月', '旺季6-10月',
  '保底計件', 2, '低',
  'Pinata farm是唯一一間封膜包裝的草莓廠，整體優質並且工作內容輕鬆，只是工作流程導致大部分包裝很難超過時薪。',
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'Oasis Berries', 'Caboolture', -27.0853, 152.9503, 2500,
  '包裝', '草莓', '6月-11月', '旺季6-10月',
  '計件', 2, '低',
  'Oasis Berries是一間純計件的包裝廠，整體來說沒有太大的問題，但同樣對新包友好度不高。',
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'Queensland Berries', 'Caboolture', -27.0853, 152.9503, 2500,
  '包裝', '草莓', '6月-11月', '旺季6-10月',
  '計件', 2, '低',
  'Queensland Berries是一間純計件的包裝廠，整體來說沒有太大的問題，但同樣對新包友好度不高。',
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'A&A farm', 'Caboolture', -27.0853, 152.9503, 2500,
  '包裝/採摘', '草莓', '6月-11月', '旺季6-10月',
  '計件', 2, '低',
  'A&A farm有採果也有包裝，目前有的資訊表示他們的田並不多，跟其他廠比起時數明顯偏低，新包友好度中等。',
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'Sunray Strawberries', 'Caboolture', -27.0853, 152.9503, 2500,
  '包裝', '草莓', '6月-11月', '旺季6-10月',
  '保底計件', 2, '低',
  'Sunray Strawberries算鰻有名的包裝廠，由於他們是送箱的方式對於第一次接觸的人需要花點時間熟悉，因其有保底機制動作慢的是會被開除的，新包友好度中下。',
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'TSL Family Farms', 'Caboolture', -27.0853, 152.9503, 2500,
  '包裝/採摘', '草莓', '6月-11月', '旺季6-10月',
  '保底計件', 2, '低',
  'TSL Family Farms是高架草莓，對於採果來說相對友善，因為不用彎腰，整體來說工作時間也比較人性化，通常walk in會比較有機會，需要提前前往報名，新包友好度高。',
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'Ice Berry', 'Caboolture', -27.0853, 152.9503, 2500,
  '包裝', '草莓', '6月-11月', '旺季6-10月',
  '保底計件', 2, '低',
  null,
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'Eastern Colour', 'Stanthorpe', -28.6053, 151.9308, 2500,
  '包裝/採摘', '草莓/蘋果', null, null,
  '不確定', null, null,
  null,
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'Archie''s Produce', 'Stanthorpe', -28.6053, 151.9308, 2500,
  '採摘', '青椒', null, null,
  '團體計件', 4, '低',
  null,
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'David', 'Stanthorpe', -28.6053, 151.9308, 2500,
  '採摘', '青椒', null, null,
  '團體計件', 4, '低',
  null,
  '已驗證', '2026-07-01',
  true, '站長'
);
