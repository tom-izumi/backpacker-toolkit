-- Backpacker Toolkit QLD — v2 schema 調整
-- 於 Supabase SQL Editor 執行（需先執行 0001_schema.sql）
--
-- 變更內容：
-- 1. 新增「是否可集簽」欄位 can_collect_stamp
-- 2. 驗證等級簡化：取消「創辦人實地驗證」等四級制，改為「已驗證 / 未驗證」二元狀態
-- 3. 新增「提供者」欄位 provider，預設值為「站長」

-- 1. 是否可集簽
alter table farms
  add column can_collect_stamp boolean not null default false;

-- 2. 驗證狀態簡化為二元制
create type verification_status as enum ('已驗證', '未驗證');

alter table farms
  add column verification_status verification_status;

update farms
  set verification_status = case
    when verification_level = '未驗證' then '未驗證'::verification_status
    else '已驗證'::verification_status
  end;

alter table farms
  alter column verification_status set not null,
  alter column verification_status set default '未驗證';

alter table farms
  drop column verification_level;

drop type verification_level;

-- 3. 提供者，預設站長
alter table farms
  add column provider text not null default '站長';
