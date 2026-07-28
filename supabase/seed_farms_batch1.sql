-- 第二批資料：來自填寫表（4 筆新農場，第 2 列 Ashbern Caboolture 範例列與既有 seed.sql 重複故略過）
-- 於 Supabase SQL Editor 執行（需先執行 0001_schema.sql、0002_alter_farms.sql）
--
-- 注意：填寫表中「參考金額範圍」「住宿」「交通」三欄已被移除未填寫，故以下全部留 NULL。
-- 注意：Stanthorpe 三筆（Ashbern Stanthorpe / Taylor Farm / Red Jewel Farm）未填寫經緯度，
--       暫用 Stanthorpe 鎮中心概略座標代填，請確認是否需要調整。

insert into farms (
  name, region, approx_lat, approx_lng, fuzzy_radius_m,
  job_type, crop, season_range, suggested_entry_timing,
  pay_method, difficulty_rating, english_requirement, founder_notes,
  verification_status, last_confirmed_date,
  can_collect_stamp, provider
) values
(
  'Ashbern Farm', 'Stanthorpe', -28.6053, 151.9308, 2500,
  '包裝', '草莓', '9月-5月', '9-12月為旺季，過後開始減量，陸續直到5月都保持有果但不多',
  '保底計件', 2, '低',
  'Stanthorpe的Ashbern是同一間公司，基本與Caboolture差不多，屬於新手友善的優質工廠。',
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'Taylor Farm', 'Stanthorpe', -28.6053, 151.9308, 2500,
  '種苗/包裝', '蔬菜', '10月-5月', '1月開始直到4月工時都不短',
  '時薪', 1, '中',
  'Taylor算是Stanthorpe最大的農場之一，主要工作內容有機械種苗、包裝、除草、採摘，除了採摘以外的工作都算十分輕鬆，不太需要大量體力又有穩定工時，對新手十分友善。',
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'Red Jewel Farm', 'Stanthorpe', -28.6053, 151.9308, 2500,
  '綁苗', '草莓', '2月-3月', '為期1個月左右的短期工',
  '保底計件', 3, '低',
  'RedJewel綁苗是Stanthorpe著名的一項工作，是一份晚上的工作時間通常為2pm-11pm左右，要跪在地上頭戴夜燈進行拔苗或綁苗，部輕鬆但不需要長時間日曬，以前很多背包客會特意為了這1個月而移動至此，因其特殊的工作時間有的人會選擇當兼職，但從2025開始薪水制度發生變化，不再採用純計件制。',
  '已驗證', '2026-07-01',
  true, '站長'
),
(
  'Donnybrook farm', 'Caboolture', -27.0853, 152.9503, 2500,
  '包裝/採摘', '草莓', '6月-12月', '幾乎全年有工，若想趕旺季推薦6-10月',
  '時薪+計件', 3, '低',
  'Donnybrook前身為大名鼎鼎的MJC，屬於純計件制包裝廠，同時也有時薪工以及外場採果，旺季時工時非常可觀同時也沒有休假，新手需謹慎考慮，純計件制度導致有些新包在此無法達到集簽低標。',
  '已驗證', '2026-07-01',
  true, '站長'
);
