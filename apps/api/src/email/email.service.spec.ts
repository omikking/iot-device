import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

describe('EmailService', () => {
  let service: EmailService;

  const config = {
    SMTP_HOST: 'smtp.sandvik.com',
    SMTP_PORT: 587,
    SMTP_SECURE: 'false',
    SMTP_USER: 'testuser',
    SMTP_PASSWORD: 'testpass',
    SMTP_FROM: 'test@example.com',
    FRONTEND_URL: 'https://portal.groundsupport.mining.sandvik'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: ConfigService, 
          useValue: {
            get: jest.fn((key: keyof typeof config) => config[key]),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send invitation email', async () => {
    const sendMailMock = jest.spyOn(
      (service as any).transporter,
      'sendMail'
    ).mockResolvedValue({ messageId: '123' });

    await service.sendInvitationEmail(
      'user@example.com', //user.email,
      'inv123',           //invitation.id,
      'token123',         //invitation.token,
      'Test Company',     //company.name,
    );

    expect(sendMailMock).toHaveBeenCalled();
  });
});
