import { FocusMode } from '@/constants/modes';
import { ZodiacAnimal, ZodiacElement } from '@/constants/zodiac-data';

export interface Prophecy {
  id: string;
  stripe_session_id: string;
  stripe_payment_intent: string | null;
  email: string;
  birth_date: string;
  focus_mode: FocusMode;
  zodiac_sign: ZodiacAnimal | null;
  zodiac_element: ZodiacElement | null;
  fire_horse_relation: string | null;
  main_text: string | null;
  sub_text: string | null;
  full_reading: string | null;
  image_url: string | null;              // Raw AI-generated image
  image_storage_path: string | null;
  branded_image_url: string | null;      // Owner version: has CERT number (for DOWNLOAD only)
  branded_image_storage_path: string | null;
  shareable_image_url: string | null;    // Share version: WATERMARKED, NO cert (for SHARING)
  shareable_image_storage_path: string | null;
  edition_number: number | null;         // Limited edition number (e.g., 127)
  total_editions: number | null;         // Total editions for this sign (e.g., 888)
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  retry_count: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface GenerationResult {
  mainText: string;
  subText: string;
  fullReading: string;
  imageData: string; // base64 encoded image
}

export interface GenerateOptions {
  birthDate: string;
  focusMode: FocusMode;
  zodiacSign: ZodiacAnimal;
  zodiacElement: ZodiacElement;
  fireHorseAdvice: string;
}
