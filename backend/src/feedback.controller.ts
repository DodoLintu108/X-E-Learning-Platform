import { Controller, Get } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  async getAllFeedback() {
    return this.feedbackService.getAllFeedback();
  }
}

