import nodemailer from 'nodemailer';
import { AppError } from '../utils/errors';
import { env } from '../config/environment';
import { logger } from '../utils/logger';

interface PasswordEmailParams {
  to: string;
  name: string;
  token: string;
}

interface VoucherEmailParams {
  to: string;
  guestName: string;
  reservationCode: string;
  accommodationName: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalAmount: number;
  checkInUrl?: string;
}

interface PreCheckInEmailParams {
  to: string;
  name: string;
  checkInUrl: string;
  reservationCode: string;
}

interface QuoteEmailParams {
  to: string;
  guestName: string;
  quoteCode: string;
  amount: number;
  paymentLinkUrl?: string;
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: env.SMTP_USER && env.SMTP_PASS
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        }
      : undefined,
  });

  static isConfigured(): boolean {
    return Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_FROM);
  }

  private static getResetUrl(token: string): string {
    return `${env.FRONTEND_URL.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
  }

  private static ensureConfigured(): void {
    if (!this.isConfigured()) {
      throw new AppError('Serviço de email não configurado', 503);
    }
  }

  private static async sendMail(to: string, subject: string, html: string): Promise<void> {
    this.ensureConfigured();

    await this.transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });

    logger.info(`Email enviado para ${to}: ${subject}`);
  }

  static async sendPasswordResetEmail({ to, name, token }: PasswordEmailParams): Promise<void> {
    const resetUrl = this.getResetUrl(token);

    await this.sendMail(
      to,
      'Recuperação de senha - FuseHotel',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Recuperação de senha</h2>
          <p>Olá, ${name}.</p>
          <p>Recebemos uma solicitação para redefinir sua senha.</p>
          <p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background: #0466C8; color: #fff; text-decoration: none; border-radius: 6px;">
              Redefinir senha
            </a>
          </p>
          <p>Se o botão não funcionar, copie este link:</p>
          <p>${resetUrl}</p>
          <p>Este link expira em 24 horas.</p>
        </div>
      `
    );
  }

  static async sendPortalAccessEmail({ to, name, token }: PasswordEmailParams): Promise<void> {
    const resetUrl = this.getResetUrl(token);

    await this.sendMail(
      to,
      'Ative seu acesso ao FuseHotel',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Seu acesso foi criado</h2>
          <p>Olá, ${name}.</p>
          <p>Criamos seu acesso à área do cliente do FuseHotel.</p>
          <p>Para definir sua senha, use o link abaixo:</p>
          <p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background: #0466C8; color: #fff; text-decoration: none; border-radius: 6px;">
              Definir minha senha
            </a>
          </p>
          <p>Se o botão não funcionar, copie este link:</p>
          <p>${resetUrl}</p>
          <p>Este link expira em 24 horas.</p>
        </div>
      `
    );
  }

  static async sendReservationVoucher({
    to,
    guestName,
    reservationCode,
    accommodationName,
    checkInDate,
    checkOutDate,
    totalAmount,
    checkInUrl,
  }: VoucherEmailParams): Promise<void> {
    await this.sendMail(
      to,
      `Voucher da reserva ${reservationCode} - FuseHotel`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Voucher da sua hospedagem</h2>
          <p>Olá, ${guestName}.</p>
          <p>Sua reserva está registrada com o código <strong>${reservationCode}</strong>.</p>
          <p><strong>Acomodação:</strong> ${accommodationName}</p>
          <p><strong>Check-in:</strong> ${checkInDate.toLocaleDateString('pt-BR')}</p>
          <p><strong>Check-out:</strong> ${checkOutDate.toLocaleDateString('pt-BR')}</p>
          <p><strong>Valor total:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}</p>
          ${
            checkInUrl
              ? `<p><a href="${checkInUrl}" style="display:inline-block;padding:12px 20px;background:#0466C8;color:#fff;text-decoration:none;border-radius:6px;">Fazer pré-check-in</a></p>`
              : ''
          }
        </div>
      `
    );
  }

  static async sendPreCheckInLink({
    to,
    name,
    checkInUrl,
    reservationCode,
  }: PreCheckInEmailParams): Promise<void> {
    await this.sendMail(
      to,
      `Pré-check-in da reserva ${reservationCode} - FuseHotel`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Pré-check-in online</h2>
          <p>Olá, ${name}.</p>
          <p>Seu pré-check-in já está disponível para a reserva <strong>${reservationCode}</strong>.</p>
          <p>
            <a href="${checkInUrl}" style="display:inline-block;padding:12px 20px;background:#0466C8;color:#fff;text-decoration:none;border-radius:6px;">
              Abrir pré-check-in
            </a>
          </p>
          <p>Se precisar, copie o link abaixo:</p>
          <p>${checkInUrl}</p>
        </div>
      `
    );
  }

  static async sendQuoteEmail({
    to,
    guestName,
    quoteCode,
    amount,
    paymentLinkUrl,
  }: QuoteEmailParams): Promise<void> {
    await this.sendMail(
      to,
      `Orçamento ${quoteCode} - FuseHotel`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Seu orçamento foi gerado</h2>
          <p>Olá, ${guestName}.</p>
          <p>Seu orçamento <strong>${quoteCode}</strong> está disponível.</p>
          <p><strong>Valor estimado:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}</p>
          ${
            paymentLinkUrl
              ? `<p><a href="${paymentLinkUrl}" style="display:inline-block;padding:12px 20px;background:#0466C8;color:#fff;text-decoration:none;border-radius:6px;">Pagar online</a></p>`
              : ''
          }
        </div>
      `
    );
  }
}
