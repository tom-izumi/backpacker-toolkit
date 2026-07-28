export type Region = 'Caboolture' | 'Stanthorpe';

export type PayMethod = '時薪' | '計件' | '保底計件' | '時薪+計件' | '團體計件' | '不確定';

export type EnglishLevel = '低' | '中' | '高';

export type VerificationStatus = '已驗證' | '未驗證';

export interface Farm {
  id: string;
  name: string;
  region: Region;

  approx_lat: number;
  approx_lng: number;
  fuzzy_radius_m: number;

  job_type: string;
  crop: string;
  season_range: string | null;
  suggested_entry_timing: string | null;

  pay_method: PayMethod;
  pay_range: string | null;

  accommodation: string | null;
  transport: string | null;

  difficulty_rating: number | null;
  english_requirement: EnglishLevel | null;

  founder_notes: string | null;

  verification_status: VerificationStatus;
  last_confirmed_date: string | null;

  can_collect_stamp: boolean;
  provider: string;

  created_at: string;
  updated_at: string;
}
