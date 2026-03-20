import { pool } from '../config/database.js';
import { whatsappConnection } from './WhatsAppConnectionService.js';

interface Automation {
  id: string;
  company_id: string;
  name: string;
  trigger_type: string;
  trigger_value: string | null;
  action_type: string;
  action_value: string;
  is_active: boolean;
}

export class AutomationService {
  async runForNewConversation(companyId: string, conversationId: string, customerPhone: string) {
    const automations = await this.getActive(companyId, 'new_conversation');
    for (const auto of automations) {
      await this.executeAction(auto, conversationId, customerPhone);
    }
  }

  async runForNewMessage(companyId: string, conversationId: string, customerPhone: string, messageContent: string) {
    // off_hours
    if (this.isOffHours()) {
      const offHourAutos = await this.getActive(companyId, 'off_hours');
      for (const auto of offHourAutos) {
        await this.executeAction(auto, conversationId, customerPhone);
      }
    }

    // keyword
    const keywordAutos = await this.getActive(companyId, 'keyword');
    for (const auto of keywordAutos) {
      if (auto.trigger_value && messageContent.toLowerCase().includes(auto.trigger_value.toLowerCase())) {
        await this.executeAction(auto, conversationId, customerPhone);
      }
    }

    // new_message (generic)
    const msgAutos = await this.getActive(companyId, 'new_message');
    for (const auto of msgAutos) {
      await this.executeAction(auto, conversationId, customerPhone);
    }
  }

  private async getActive(companyId: string, triggerType: string): Promise<Automation[]> {
    const result = await pool.query(
      'SELECT * FROM automations WHERE company_id = $1 AND trigger_type = $2 AND is_active = true',
      [companyId, triggerType]
    );
    return result.rows;
  }

  private async executeAction(auto: Automation, conversationId: string, customerPhone: string) {
    try {
      switch (auto.action_type) {
        case 'send_message':
          await whatsappConnection.sendMessage(customerPhone, auto.action_value);
          await pool.query(
            `INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, 'system', $2)`,
            [conversationId, auto.action_value]
          );
          break;

        case 'add_tag': {
          const convResult = await pool.query('SELECT customer_id FROM conversations WHERE id = $1', [conversationId]);
          if (convResult.rows.length > 0) {
            await pool.query(
              'UPDATE customers SET tags = array_append(tags, $1) WHERE id = $2 AND NOT ($1 = ANY(tags))',
              [auto.action_value, convResult.rows[0].customer_id]
            );
          }
          break;
        }

        case 'assign_agent':
          await pool.query(
            'UPDATE conversations SET assigned_to = $1, updated_at = NOW() WHERE id = $2',
            [auto.action_value, conversationId]
          );
          break;

        case 'close_conversation':
          await pool.query(
            "UPDATE conversations SET status = 'CLOSED', updated_at = NOW() WHERE id = $1",
            [conversationId]
          );
          break;
      }
      console.log(`⚡ Automation "${auto.name}" executed for conversation ${conversationId}`);
    } catch (error) {
      console.error(`❌ Automation "${auto.name}" failed:`, error);
    }
  }

  private isOffHours(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    return day === 0 || day === 6 || hour < 8 || hour >= 18;
  }
}

export const automationService = new AutomationService();
