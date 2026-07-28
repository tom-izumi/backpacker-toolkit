-- 小修正：刪除 Golden Valley Farm 測試資料
-- 於 Supabase SQL Editor 執行
--
-- 說明：刪除後 Stanthorpe 座標會自動統一（其餘三筆 Stanthorpe 農場本來就共用同一組鎮中心座標
-- -28.6053, 151.9308，只有這筆測試資料用了不同座標 -28.6506, 151.9433，所以不需要另外做座標更新）。

delete from farms where id = '58d6a4b3-9c17-44f4-9cc2-c83affaf1df7';
