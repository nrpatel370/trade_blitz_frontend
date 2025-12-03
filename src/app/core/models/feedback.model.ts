export interface Feedback {
  feedback_id?: number;
  feedbackId?: number;
  user_id?: number;
  userId?: number;
  subject: string;
  message: string;
  category: 'bug' | 'feature' | 'general' | 'other';
  rating: number; // 1-5
  created_at?: Date;
  createdAt?: Date;
}

export interface FeedbackRequest {
  subject: string;
  message: string;
  category: 'bug' | 'feature' | 'general' | 'other';
  rating: number;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  feedback?: Feedback;
}
