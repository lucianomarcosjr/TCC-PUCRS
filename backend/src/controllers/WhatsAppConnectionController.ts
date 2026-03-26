import { Request, Response } from 'express';
import { whatsappConnection } from '../services/WhatsAppConnectionService.js';

export class WhatsAppConnectionController {
  async getStatus(_req: Request, res: Response) {
    res.json(whatsappConnection.getState());
  }

  async connect(_req: Request, res: Response) {
    const state = whatsappConnection.getState();
    if (state.status === 'connected') {
      return res.json({ message: 'Already connected', ...state });
    }

    try {
      whatsappConnection.initialize().catch((err) => {
        console.error('WhatsApp init error:', err);
      });

      // Wait for QR or connected status
      const result = await new Promise<any>((resolve, reject) => {
        const timeout = setTimeout(() => {
          cleanup();
          resolve(whatsappConnection.getState());
        }, 30000);

        const onQr = (qrDataUrl: string) => {
          cleanup();
          resolve({ status: 'qr', qrDataUrl });
        };

        const onStatus = (s: any) => {
          if (s.status === 'connected') {
            cleanup();
            resolve(s);
          }
        };

        const cleanup = () => {
          clearTimeout(timeout);
          whatsappConnection.removeListener('qr', onQr);
          whatsappConnection.removeListener('status', onStatus);
        };

        whatsappConnection.on('qr', onQr);
        whatsappConnection.on('status', onStatus);
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async disconnect(_req: Request, res: Response) {
    try {
      await whatsappConnection.destroy();
      res.json({ message: 'Disconnected', status: 'disconnected' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
